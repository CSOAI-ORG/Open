import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';
import { getDb } from '../db';
import { cohorts, students } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

function createTestContext(): TrpcContext {
  return {
    user: {
      id: 1,
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'admin',
      openId: 'test_admin',
      brand: 'councilof.ai',
      password: null,
      loginMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSignedIn: new Date().toISOString(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: 'free',
      subscriptionStatus: 'none',
      foundingMember: 0,
      referralCode: null,
      payoutFrequency: 'monthly',
      lastPayoutDate: null,
      stripeConnectAccountId: null,
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext['res'],
  };
}

describe('Cohorts Router', () => {
  const ctx = createTestContext();
  const caller = appRouter.createCaller(ctx);
  let testCohortId: number;
  let testStudentId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    const db = await getDb();
    if (db) {
      await db.delete(cohorts).where(eq(cohorts.code, 'TEST-2026'));
      await db.delete(students).where(eq(students.email, 'test-cohort@example.com'));
    }
  });

  afterAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (db) {
      if (testCohortId) {
        await db.delete(cohorts).where(eq(cohorts.id, testCohortId));
      }
      if (testStudentId) {
        await db.delete(students).where(eq(students.id, testStudentId));
      }
    }
  });

  describe('create', () => {
    it('should create a new cohort', async () => {
      const result = await caller.cohorts.create({
        name: 'Test Cohort 2026',
        code: 'TEST-2026',
        description: 'Test cohort for automated testing',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        capacity: 50,
        status: 'active',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      
      testCohortId = result.id;
    });

    it('should fail to create cohort with duplicate code', async () => {
      await expect(
        caller.cohorts.create({
          name: 'Duplicate Cohort',
          code: 'TEST-2026', // Same code as above
          description: 'Should fail',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          capacity: 30,
          status: 'active',
        })
      ).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list all cohorts', async () => {
      const result = await caller.cohorts.list({});

      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThan(0);
      
      const testCohort = result.items.find((c: { code: string }) => c.code === 'TEST-2026');
      expect(testCohort).toBeDefined();
    });

    it('should filter cohorts by status', async () => {
      const result = await caller.cohorts.list({ status: 'active' });

      expect(result.items.every((c: { status: string }) => c.status === 'active')).toBe(true);
    });

    it('should search cohorts by name', async () => {
      const result = await caller.cohorts.list({ search: 'Test Cohort' });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.some((c: { name: string }) => c.name.includes('Test Cohort'))).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get cohort by id', async () => {
      const result = await caller.cohorts.getById({ id: testCohortId });

      expect(result).toBeDefined();
      expect(result.id).toBe(testCohortId);
      expect(result.name).toBe('Test Cohort 2026');
      expect(result.code).toBe('TEST-2026');
    });

    it('should throw error for non-existent cohort', async () => {
      await expect(
        caller.cohorts.getById({ id: 999999 })
      ).rejects.toThrow('Cohort not found');
    });
  });

  describe('update', () => {
    it('should update cohort details', async () => {
      const result = await caller.cohorts.update({
        id: testCohortId,
        name: 'Updated Test Cohort 2026',
        capacity: 60,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      
      // Verify the update
      const updated = await caller.cohorts.getById({ id: testCohortId });
      expect(updated.name).toBe('Updated Test Cohort 2026');
      expect(updated.capacity).toBe(60);
    });
  });

  describe('getStats', () => {
    it('should return cohort statistics', async () => {
      const result = await caller.cohorts.getStats();

      expect(result).toBeDefined();
      expect(result.totalCohorts).toBeGreaterThanOrEqual(0);
      expect(result.activeCohorts).toBeGreaterThanOrEqual(0);
      expect(result.totalStudents).toBeGreaterThanOrEqual(0);
      expect(result.activeStudents).toBeGreaterThanOrEqual(0);
    });
  });

  describe('delete', () => {
    it('should delete cohort', async () => {
      const result = await caller.cohorts.delete({ id: testCohortId });

      expect(result.success).toBe(true);
      
      // Verify cohort was deleted
      await expect(
        caller.cohorts.getById({ id: testCohortId })
      ).rejects.toThrow('Cohort not found');
      
      testCohortId = 0; // Prevent cleanup from trying to delete again
    });
  });
});
