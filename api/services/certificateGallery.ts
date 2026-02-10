/**
 * Certificate Gallery Router - Public certificate showcase
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userCertificateGallerySettings, courseCertificates, courses, users } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const certificateGalleryRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const [settings] = await db
      .select()
      .from(userCertificateGallerySettings)
      .where(eq(userCertificateGallerySettings.userId, ctx.user.id));

    if (!settings) {
      return {
        isPublic: true,
        publicSlug: null,
        displayName: ctx.user.name || 'Certificate Holder',
        bio: null,
        linkedInUrl: null,
        showExamScores: false,
        showCompletionDates: true,
        showExpirationDates: true,
        theme: 'default',
      };
    }

    return {
      isPublic: settings.isPublic === 1,
      publicSlug: settings.publicSlug,
      displayName: settings.displayName || ctx.user.name,
      bio: settings.bio,
      linkedInUrl: settings.linkedInUrl,
      showExamScores: settings.showExamScores === 1,
      showCompletionDates: settings.showCompletionDates === 1,
      showExpirationDates: settings.showExpirationDates === 1,
      theme: settings.theme,
    };
  }),

  updateSettings: protectedProcedure
    .input(z.object({
      isPublic: z.boolean().optional(),
      publicSlug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/).optional().nullable(),
      displayName: z.string().max(255).optional(),
      bio: z.string().max(1000).optional().nullable(),
      linkedInUrl: z.string().url().optional().nullable(),
      showExamScores: z.boolean().optional(),
      showCompletionDates: z.boolean().optional(),
      showExpirationDates: z.boolean().optional(),
      theme: z.enum(['default', 'professional', 'minimal', 'dark']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      if (input.publicSlug) {
        const [existing] = await db
          .select()
          .from(userCertificateGallerySettings)
          .where(and(
            eq(userCertificateGallerySettings.publicSlug, input.publicSlug),
            sql`${userCertificateGallerySettings.userId} != ${ctx.user.id}`
          ));
        if (existing) {
          throw new Error('This URL slug is already taken');
        }
      }

      const [currentSettings] = await db
        .select()
        .from(userCertificateGallerySettings)
        .where(eq(userCertificateGallerySettings.userId, ctx.user.id));

      const updateData: any = {};
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic ? 1 : 0;
      if (input.publicSlug !== undefined) updateData.publicSlug = input.publicSlug;
      if (input.displayName !== undefined) updateData.displayName = input.displayName;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.linkedInUrl !== undefined) updateData.linkedInUrl = input.linkedInUrl;
      if (input.showExamScores !== undefined) updateData.showExamScores = input.showExamScores ? 1 : 0;
      if (input.showCompletionDates !== undefined) updateData.showCompletionDates = input.showCompletionDates ? 1 : 0;
      if (input.showExpirationDates !== undefined) updateData.showExpirationDates = input.showExpirationDates ? 1 : 0;
      if (input.theme !== undefined) updateData.theme = input.theme;

      if (currentSettings) {
        await db
          .update(userCertificateGallerySettings)
          .set(updateData)
          .where(eq(userCertificateGallerySettings.id, currentSettings.id));
      } else {
        await db.insert(userCertificateGallerySettings).values({
          userId: ctx.user.id,
          ...updateData,
        });
      }

      return { success: true };
    }),

  generateSlug: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const baseSlug = (ctx.user.name || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const [existing] = await db
        .select()
        .from(userCertificateGallerySettings)
        .where(eq(userCertificateGallerySettings.publicSlug, slug));
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return { slug };
  }),

  getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const certificates = await db
      .select({
        id: courseCertificates.id,
        certificateId: courseCertificates.certificateId,
        courseId: courseCertificates.courseId,
        issuedAt: courseCertificates.issuedAt,
        expiresAt: courseCertificates.expiresAt,
        status: courseCertificates.status,
        examScore: courseCertificates.examScore,
        showInGallery: courseCertificates.showInGallery,
        courseName: courses.title,
        framework: courses.framework,
      })
      .from(courseCertificates)
      .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
      .where(eq(courseCertificates.userId, ctx.user.id))
      .orderBy(desc(courseCertificates.issuedAt));

    return certificates.map(cert => ({
      ...cert,
      showInGallery: cert.showInGallery === 1,
    }));
  }),

  toggleCertificateVisibility: protectedProcedure
    .input(z.object({
      certificateId: z.number(),
      showInGallery: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db
        .update(courseCertificates)
        .set({ showInGallery: input.showInGallery ? 1 : 0 })
        .where(and(
          eq(courseCertificates.id, input.certificateId),
          eq(courseCertificates.userId, ctx.user.id)
        ));

      return { success: true };
    }),

  getPublicGallery: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [settings] = await db
        .select({
          userId: userCertificateGallerySettings.userId,
          isPublic: userCertificateGallerySettings.isPublic,
          displayName: userCertificateGallerySettings.displayName,
          bio: userCertificateGallerySettings.bio,
          linkedInUrl: userCertificateGallerySettings.linkedInUrl,
          showExamScores: userCertificateGallerySettings.showExamScores,
          showCompletionDates: userCertificateGallerySettings.showCompletionDates,
          showExpirationDates: userCertificateGallerySettings.showExpirationDates,
          theme: userCertificateGallerySettings.theme,
          userName: users.name,
        })
        .from(userCertificateGallerySettings)
        .leftJoin(users, eq(userCertificateGallerySettings.userId, users.id))
        .where(eq(userCertificateGallerySettings.publicSlug, input.slug));

      if (!settings || settings.isPublic !== 1) {
        return null;
      }

      const certificates = await db
        .select({
          id: courseCertificates.id,
          certificateId: courseCertificates.certificateId,
          issuedAt: courseCertificates.issuedAt,
          expiresAt: courseCertificates.expiresAt,
          status: courseCertificates.status,
          examScore: courseCertificates.examScore,
          courseName: courses.title,
          framework: courses.framework,
        })
        .from(courseCertificates)
        .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(and(
          eq(courseCertificates.userId, settings.userId),
          eq(courseCertificates.showInGallery, 1)
        ))
        .orderBy(desc(courseCertificates.issuedAt));

      return {
        profile: {
          displayName: settings.displayName || settings.userName,
          bio: settings.bio,
          linkedInUrl: settings.linkedInUrl,
          theme: settings.theme,
        },
        certificates: certificates.map(cert => ({
          id: cert.id,
          certificateId: cert.certificateId,
          courseName: cert.courseName,
          framework: cert.framework,
          status: cert.status,
          issuedAt: settings.showCompletionDates === 1 ? cert.issuedAt : null,
          expiresAt: settings.showExpirationDates === 1 ? cert.expiresAt : null,
          examScore: settings.showExamScores === 1 ? cert.examScore : null,
        })),
        stats: {
          totalCertificates: certificates.length,
          validCertificates: certificates.filter(c => c.status === 'valid').length,
        },
      };
    }),
});
