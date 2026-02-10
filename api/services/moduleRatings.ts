import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { moduleRatings, moduleFeedback } from "../../drizzle/schema";
import { eq, and, avg, desc, sql } from "drizzle-orm";

export const moduleRatingsRouter = router({
  // Submit a rating for a module
  submitRating: protectedProcedure
    .input(z.object({
      moduleId: z.string(),
      rating: z.number().min(1).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Check if user already rated this module
      const existingRating = await db
        .select()
        .from(moduleRatings)
        .where(
          and(
            eq(moduleRatings.moduleId, input.moduleId),
            eq(moduleRatings.userId, userId)
          )
        )
        .limit(1);

      if (existingRating.length > 0) {
        // Update existing rating
        await db
          .update(moduleRatings)
          .set({
            rating: input.rating,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(moduleRatings.moduleId, input.moduleId),
              eq(moduleRatings.userId, userId)
            )
          );
      } else {
        // Insert new rating
        await db.insert(moduleRatings).values({
          moduleId: input.moduleId,
          userId,
          rating: input.rating,
        });
      }

      return { success: true };
    }),

  // Submit feedback for a module
  submitFeedback: protectedProcedure
    .input(z.object({
      moduleId: z.string(),
      feedback: z.string().min(10).max(1000),
      helpful: z.number().optional().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      await db.insert(moduleFeedback).values({
        moduleId: input.moduleId,
        userId,
        feedback: input.feedback,
        helpful: input.helpful,
      });

      return { success: true };
    }),

  // Get average rating for a module
  getAverageRating: publicProcedure
    .input(z.object({
      moduleId: z.string(),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      const result = await db
        .select({
          averageRating: avg(moduleRatings.rating),
          totalRatings: sql<number>`COUNT(*)`,
        })
        .from(moduleRatings)
        .where(eq(moduleRatings.moduleId, input.moduleId));

      const avgRating = result[0]?.averageRating 
        ? parseFloat(result[0].averageRating.toString()) 
        : 0;
      const count = result[0]?.totalRatings || 0;

      return {
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings: count,
      };
    }),

  // Get user's rating for a module
  getUserRating: protectedProcedure
    .input(z.object({
      moduleId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const result = await db
        .select()
        .from(moduleRatings)
        .where(
          and(
            eq(moduleRatings.moduleId, input.moduleId),
            eq(moduleRatings.userId, userId)
          )
        )
        .limit(1);

      return result[0] || null;
    }),

  // Get feedback for a module
  getModuleFeedback: publicProcedure
    .input(z.object({
      moduleId: z.string(),
      limit: z.number().default(5),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      const feedback = await db
        .select()
        .from(moduleFeedback)
        .where(eq(moduleFeedback.moduleId, input.moduleId))
        .orderBy(desc(moduleFeedback.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const totalCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(moduleFeedback)
        .where(eq(moduleFeedback.moduleId, input.moduleId));

      return {
        feedback,
        total: totalCount[0]?.count || 0,
      };
    }),

  // Get all ratings for a module (for admin)
  getModuleRatings: publicProcedure
    .input(z.object({
      moduleId: z.string(),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      const ratings = await db
        .select()
        .from(moduleRatings)
        .where(eq(moduleRatings.moduleId, input.moduleId))
        .orderBy(desc(moduleRatings.createdAt));

      // Calculate rating distribution
      const distribution = {
        5: ratings.filter(r => r.rating === 5).length,
        4: ratings.filter(r => r.rating === 4).length,
        3: ratings.filter(r => r.rating === 3).length,
        2: ratings.filter(r => r.rating === 2).length,
        1: ratings.filter(r => r.rating === 1).length,
      };

      return {
        ratings,
        distribution,
        total: ratings.length,
      };
    }),

  // Mark feedback as helpful/unhelpful
  markFeedbackHelpful: protectedProcedure
    .input(z.object({
      feedbackId: z.number(),
      helpful: z.number().refine(val => [-1, 0, 1].includes(val)),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(moduleFeedback)
        .set({
          helpful: input.helpful,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(moduleFeedback.id, input.feedbackId));

      return { success: true };
    }),
});
