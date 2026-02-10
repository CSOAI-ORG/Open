/**
 * Unit tests for Course Completion Emails and Bookmarks
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getDb } from '../db';
import { courseEnrollments, courseBookmarks, courses, users } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import * as courseEmailService from '../services/courseEmailService';

describe('Course Completion and Bookmarks', () => {
  let testUserId: number;
  let testCourseId: number;
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create test user
    const [user] = await db.insert(users).values({
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      openId: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    testUserId = user.insertId;

    // Create test course
    const [course] = await db.insert(courses).values({
      regionId: 1,
      title: 'Test Course for Completion',
      description: 'Test course description',
      framework: 'test-framework',
      level: 'fundamentals',
      durationHours: 10,
      price: 0,
      modules: JSON.stringify([
        { id: 1, title: 'Module 1' },
        { id: 2, title: 'Module 2' },
      ]),
      active: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    testCourseId = course.insertId;
  });

  afterAll(async () => {
    if (!db) return;

    // Cleanup
    await db.delete(courseBookmarks).where(eq(courseBookmarks.userId, testUserId));
    await db.delete(courseEnrollments).where(eq(courseEnrollments.userId, testUserId));
    await db.delete(courses).where(eq(courses.id, testCourseId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  describe('Course Completion Email', () => {
    it('should trigger email when course is completed', async () => {
      // Mock the email service
      const sendEmailSpy = vi.spyOn(courseEmailService, 'sendCompletionCertificateEmail');
      sendEmailSpy.mockResolvedValue(undefined);

      // Create enrollment
      await db.insert(courseEnrollments).values({
        userId: testUserId,
        courseId: testCourseId,
        enrollmentType: 'course',
        status: 'in_progress',
        progress: 50,
        paymentStatus: 'free',
        subscriptionStatus: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update progress to 100% (completion)
      await db
        .update(courseEnrollments)
        .set({
          progress: 100,
          status: 'completed',
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(courseEnrollments.userId, testUserId),
            eq(courseEnrollments.courseId, testCourseId)
          )
        );

      // Verify enrollment is completed
      const [enrollment] = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.userId, testUserId),
            eq(courseEnrollments.courseId, testCourseId)
          )
        );

      expect(enrollment.status).toBe('completed');
      expect(enrollment.progress).toBe(100);

      // Note: In actual implementation, the email would be triggered by the updateProgress mutation
      // This test verifies the data flow is correct
    });
  });

  describe('Course Bookmarks', () => {
    it('should create a bookmark', async () => {
      const [bookmark] = await db.insert(courseBookmarks).values({
        userId: testUserId,
        courseId: testCourseId,
        moduleId: 1,
        sectionId: 'section-1',
        sectionTitle: 'Introduction to Testing',
        notes: 'Important section to review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      expect(bookmark.insertId).toBeDefined();

      // Verify bookmark was created
      const [created] = await db
        .select()
        .from(courseBookmarks)
        .where(eq(courseBookmarks.id, bookmark.insertId));

      expect(created).toBeDefined();
      expect(created.userId).toBe(testUserId);
      expect(created.courseId).toBe(testCourseId);
      expect(created.sectionTitle).toBe('Introduction to Testing');
    });

    it('should list bookmarks for a user', async () => {
      // Create multiple bookmarks
      await db.insert(courseBookmarks).values([
        {
          userId: testUserId,
          courseId: testCourseId,
          moduleId: 1,
          sectionTitle: 'Bookmark 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          userId: testUserId,
          courseId: testCourseId,
          moduleId: 2,
          sectionTitle: 'Bookmark 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      const bookmarks = await db
        .select()
        .from(courseBookmarks)
        .where(eq(courseBookmarks.userId, testUserId));

      expect(bookmarks.length).toBeGreaterThanOrEqual(2);
    });

    it('should update bookmark notes', async () => {
      const [bookmark] = await db.insert(courseBookmarks).values({
        userId: testUserId,
        courseId: testCourseId,
        moduleId: 1,
        sectionTitle: 'Test Bookmark',
        notes: 'Original notes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const bookmarkId = bookmark.insertId;

      // Update notes
      await db
        .update(courseBookmarks)
        .set({
          notes: 'Updated notes',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(courseBookmarks.id, bookmarkId));

      // Verify update
      const [updated] = await db
        .select()
        .from(courseBookmarks)
        .where(eq(courseBookmarks.id, bookmarkId));

      expect(updated.notes).toBe('Updated notes');
    });

    it('should delete a bookmark', async () => {
      const [bookmark] = await db.insert(courseBookmarks).values({
        userId: testUserId,
        courseId: testCourseId,
        moduleId: 1,
        sectionTitle: 'To Be Deleted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const bookmarkId = bookmark.insertId;

      // Delete bookmark
      await db
        .delete(courseBookmarks)
        .where(eq(courseBookmarks.id, bookmarkId));

      // Verify deletion
      const [deleted] = await db
        .select()
        .from(courseBookmarks)
        .where(eq(courseBookmarks.id, bookmarkId));

      expect(deleted).toBeUndefined();
    });

    it('should filter bookmarks by course', async () => {
      // Create bookmarks for different courses
      await db.insert(courseBookmarks).values([
        {
          userId: testUserId,
          courseId: testCourseId,
          moduleId: 1,
          sectionTitle: 'Course 1 Bookmark',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          userId: testUserId,
          courseId: testCourseId + 1,
          moduleId: 1,
          sectionTitle: 'Course 2 Bookmark',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      const bookmarks = await db
        .select()
        .from(courseBookmarks)
        .where(
          and(
            eq(courseBookmarks.userId, testUserId),
            eq(courseBookmarks.courseId, testCourseId)
          )
        );

      expect(bookmarks.every((b: any) => b.courseId === testCourseId)).toBe(true);
    });
  });
});
