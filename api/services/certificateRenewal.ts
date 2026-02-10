/**
 * Certificate Renewal Router - Expiration and renewal management
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  courseCertificates, 
  courses,
  users,
  certificateValidityConfig,
  certificateRenewalReminders,
  certificateRecertifications,
  finalExamAttempts
} from "../../drizzle/schema";
import { eq, and, desc, sql, isNull, or } from "drizzle-orm";

const DEFAULT_VALIDITY_DAYS = 730;

export const certificateRenewalRouter = router({
  getRenewalStatus: protectedProcedure
    .input(z.object({ certificateId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [cert] = await db
        .select({
          id: courseCertificates.id,
          certificateId: courseCertificates.certificateId,
          courseId: courseCertificates.courseId,
          issuedAt: courseCertificates.issuedAt,
          expiresAt: courseCertificates.expiresAt,
          status: courseCertificates.status,
          validityPeriodDays: courseCertificates.validityPeriodDays,
          courseName: courses.title,
          framework: courses.framework,
        })
        .from(courseCertificates)
        .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(and(
          eq(courseCertificates.id, input.certificateId),
          eq(courseCertificates.userId, ctx.user.id)
        ));

      if (!cert) throw new Error('Certificate not found');

      const [config] = await db
        .select()
        .from(certificateValidityConfig)
        .where(and(
          or(eq(certificateValidityConfig.courseId, cert.courseId!), isNull(certificateValidityConfig.courseId)),
          eq(certificateValidityConfig.isActive, 1)
        ))
        .orderBy(desc(certificateValidityConfig.courseId));

      const now = new Date();
      const expiresAt = cert.expiresAt ? new Date(cert.expiresAt) : null;
      const daysUntilExpiry = expiresAt 
        ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const recertifications = await db
        .select()
        .from(certificateRecertifications)
        .where(eq(certificateRecertifications.originalCertificateId, cert.id))
        .orderBy(desc(certificateRecertifications.createdAt));

      return {
        certificate: {
          id: cert.id,
          certificateId: cert.certificateId,
          courseName: cert.courseName,
          framework: cert.framework,
          issuedAt: cert.issuedAt,
          expiresAt: cert.expiresAt,
          status: cert.status,
        },
        expiration: {
          expiresAt: cert.expiresAt,
          daysUntilExpiry,
          isExpired: daysUntilExpiry !== null && daysUntilExpiry <= 0,
          isExpiringSoon: daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30,
        },
        renewal: {
          canRenew: config?.requiresRecertification === 1,
          requiresExam: true,
          discountPercent: config?.recertificationDiscountPercent ?? 50,
          validityPeriodDays: config?.validityPeriodDays ?? DEFAULT_VALIDITY_DAYS,
        },
        history: recertifications.map(r => ({
          id: r.id,
          type: r.recertificationType,
          previousExpiry: r.previousExpiryDate,
          newExpiry: r.newExpiryDate,
          createdAt: r.createdAt,
        })),
      };
    }),

  getCertificatesNeedingRenewal: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const certificates = await db
      .select({
        id: courseCertificates.id,
        certificateId: courseCertificates.certificateId,
        courseId: courseCertificates.courseId,
        issuedAt: courseCertificates.issuedAt,
        expiresAt: courseCertificates.expiresAt,
        status: courseCertificates.status,
        courseName: courses.title,
        framework: courses.framework,
      })
      .from(courseCertificates)
      .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
      .where(and(
        eq(courseCertificates.userId, ctx.user.id),
        or(
          eq(courseCertificates.status, 'expiring_soon'),
          eq(courseCertificates.status, 'expired'),
          sql`${courseCertificates.expiresAt} <= ${thirtyDaysFromNow.toISOString()}`
        )
      ))
      .orderBy(courseCertificates.expiresAt);

    return certificates.map(cert => {
      const expiresAt = cert.expiresAt ? new Date(cert.expiresAt) : null;
      const now = new Date();
      const daysUntilExpiry = expiresAt 
        ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...cert,
        daysUntilExpiry,
        isExpired: daysUntilExpiry !== null && daysUntilExpiry <= 0,
        isExpiringSoon: daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30,
      };
    });
  }),

  startRecertification: protectedProcedure
    .input(z.object({ certificateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [cert] = await db
        .select()
        .from(courseCertificates)
        .where(and(
          eq(courseCertificates.id, input.certificateId),
          eq(courseCertificates.userId, ctx.user.id)
        ));

      if (!cert) throw new Error('Certificate not found');

      const [existingRecert] = await db
        .select()
        .from(certificateRecertifications)
        .where(and(
          eq(certificateRecertifications.originalCertificateId, cert.id),
          eq(certificateRecertifications.userId, ctx.user.id),
          eq(certificateRecertifications.newCertificateId, 0)
        ));

      if (existingRecert) {
        return {
          success: true,
          recertificationId: existingRecert.id,
          message: 'Recertification already in progress',
          courseId: cert.courseId,
        };
      }

      await db
        .update(finalExamAttempts)
        .set({ passed: 0 })
        .where(and(
          eq(finalExamAttempts.userId, ctx.user.id),
          eq(finalExamAttempts.courseId, cert.courseId!)
        ));

      const [result] = await db.insert(certificateRecertifications).values({
        originalCertificateId: cert.id,
        newCertificateId: 0,
        userId: ctx.user.id,
        courseId: cert.courseId!,
        recertificationType: 'renewal',
        previousExpiryDate: cert.expiresAt,
        discountApplied: 50,
      });

      return {
        success: true,
        recertificationId: (result as any).insertId,
        message: 'Recertification started. Please complete the final exam.',
        courseId: cert.courseId,
      };
    }),

  getValidityConfig: protectedProcedure
    .input(z.object({ courseId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [config] = await db
        .select()
        .from(certificateValidityConfig)
        .where(and(
          input.courseId 
            ? eq(certificateValidityConfig.courseId, input.courseId)
            : isNull(certificateValidityConfig.courseId),
          eq(certificateValidityConfig.isActive, 1)
        ));

      if (!config) {
        return {
          validityPeriodDays: DEFAULT_VALIDITY_DAYS,
          renewalReminderDays: [30, 14, 7],
          requiresRecertification: true,
          recertificationDiscountPercent: 50,
        };
      }

      return {
        validityPeriodDays: config.validityPeriodDays,
        renewalReminderDays: config.renewalReminderDays?.split(',').map(Number) ?? [30, 14, 7],
        requiresRecertification: config.requiresRecertification === 1,
        recertificationDiscountPercent: config.recertificationDiscountPercent,
      };
    }),

  updateCertificateStatuses: publicProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    await db
      .update(courseCertificates)
      .set({ status: 'expired' })
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} < ${now.toISOString()}`,
        sql`${courseCertificates.status} != 'expired'`,
        sql`${courseCertificates.status} != 'revoked'`
      ));

    await db
      .update(courseCertificates)
      .set({ status: 'expiring_soon' })
      .where(and(
        sql`${courseCertificates.expiresAt} IS NOT NULL`,
        sql`${courseCertificates.expiresAt} >= ${now.toISOString()}`,
        sql`${courseCertificates.expiresAt} <= ${thirtyDaysFromNow.toISOString()}`,
        sql`${courseCertificates.status} = 'valid'`
      ));

    return { success: true };
  }),
});
