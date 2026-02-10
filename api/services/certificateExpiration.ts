/**
 * Certificate Expiration Router
 * 
 * Provides API endpoints for certificate expiration management
 * and manual triggering of expiration checks.
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { 
  runDailyExpirationCheck,
  processExpirationReminders,
} from "../services/certificateExpirationEmailService";
import { getDb } from "../db";
import { certificateRenewalReminders, courseCertificates, courses, users } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const certificateExpirationRouter = router({
  /**
   * Manually trigger the daily expiration check (admin only)
   */
  triggerExpirationCheck: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    const results = await runDailyExpirationCheck();
    return { success: true, results, message: 'Expiration check completed' };
  }),

  /**
   * Process reminders for a specific day threshold (admin only)
   */
  processRemindersForDays: protectedProcedure
    .input(z.object({ days: z.enum(['30', '14', '7']) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      const result = await processExpirationReminders(parseInt(input.days));
      return { success: true, ...result };
    }),

  /**
   * Get certificates expiring soon (for admin dashboard)
   */
  getExpiringCertificates: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const db = await getDb();
      if (!db) return [];

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + input.days);

      const certificates = await db
        .select({
          id: courseCertificates.id,
          certificateId: courseCertificates.certificateId,
          userId: courseCertificates.userId,
          userName: users.name,
          userEmail: users.email,
          courseName: courses.title,
          framework: courses.framework,
          expiresAt: courseCertificates.expiresAt,
          status: courseCertificates.status,
          reminderSent30: courseCertificates.renewalReminderSent30,
          reminderSent14: courseCertificates.renewalReminderSent14,
          reminderSent7: courseCertificates.renewalReminderSent7,
        })
        .from(courseCertificates)
        .innerJoin(users, eq(courseCertificates.userId, users.id))
        .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(and(
          sql`${courseCertificates.expiresAt} IS NOT NULL`,
          sql`${courseCertificates.expiresAt} <= ${targetDate.toISOString()}`,
          sql`${courseCertificates.expiresAt} >= NOW()`,
          sql`${courseCertificates.status} != 'revoked'`
        ))
        .orderBy(courseCertificates.expiresAt)
        .limit(100);

      return certificates.map(cert => {
        const expiresAt = cert.expiresAt ? new Date(cert.expiresAt) : null;
        const now = new Date();
        const daysUntilExpiry = expiresAt 
          ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        return { ...cert, daysUntilExpiry };
      });
    }),

  /**
   * Get reminder history for a certificate
   */
  getReminderHistory: protectedProcedure
    .input(z.object({ certificateId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const [cert] = await db
        .select()
        .from(courseCertificates)
        .where(eq(courseCertificates.id, input.certificateId))
        .limit(1);

      if (!cert) throw new Error('Certificate not found');
      if (cert.userId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new Error('Access denied');
      }

      return db
        .select()
        .from(certificateRenewalReminders)
        .where(eq(certificateRenewalReminders.certificateId, input.certificateId))
        .orderBy(desc(certificateRenewalReminders.sentAt));
    }),

  /**
   * Get expiration stats (admin dashboard)
   */
  getExpirationStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const db = await getDb();
    if (!db) return null;

    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    const fourteenDays = new Date();
    fourteenDays.setDate(fourteenDays.getDate() + 14);
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const [expiring7] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} >= NOW()`,
        sql`${courseCertificates.expiresAt} <= ${sevenDays.toISOString()}`,
        sql`${courseCertificates.status} != 'revoked'`
      ));

    const [expiring14] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} > ${sevenDays.toISOString()}`,
        sql`${courseCertificates.expiresAt} <= ${fourteenDays.toISOString()}`,
        sql`${courseCertificates.status} != 'revoked'`
      ));

    const [expiring30] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} > ${fourteenDays.toISOString()}`,
        sql`${courseCertificates.expiresAt} <= ${thirtyDays.toISOString()}`,
        sql`${courseCertificates.status} != 'revoked'`
      ));

    const [expired] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} < NOW()`,
        sql`${courseCertificates.status} = 'expired'`
      ));

    const [remindersSentToday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(certificateRenewalReminders)
      .where(sql`DATE(${certificateRenewalReminders.sentAt}) = CURDATE()`);

    return {
      expiringIn7Days: expiring7?.count || 0,
      expiringIn14Days: expiring14?.count || 0,
      expiringIn30Days: expiring30?.count || 0,
      totalExpired: expired?.count || 0,
      remindersSentToday: remindersSentToday?.count || 0,
    };
  }),
});
