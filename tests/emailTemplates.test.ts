import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';
import { getDb } from '../db';
import { emailTemplates } from '../../drizzle/schema';
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

describe('Email Templates Router', () => {
  const ctx = createTestContext();
  const caller = appRouter.createCaller(ctx);
  let testTemplateId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    const db = await getDb();
    if (db) {
      await db.delete(emailTemplates).where(eq(emailTemplates.key, 'test-template'));
      await db.delete(emailTemplates).where(eq(emailTemplates.key, 'test-template-copy'));
    }
  });

  afterAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (db && testTemplateId) {
      await db.delete(emailTemplates).where(eq(emailTemplates.id, testTemplateId));
    }
  });

  describe('create', () => {
    it('should create a new email template', async () => {
      const result = await caller.emailTemplates.create({
        name: 'Test Welcome Email',
        key: 'test-template',
        subject: 'Welcome {{firstName}}!',
        htmlBody: '<h1>Welcome {{firstName}} {{lastName}}</h1><p>Your email is {{email}}</p>',
        textBody: 'Welcome {{firstName}} {{lastName}}! Your email is {{email}}',
        category: 'onboarding',
        availableMergeTags: [
          { tag: 'firstName', description: 'First name', example: 'John' },
          { tag: 'lastName', description: 'Last name', example: 'Doe' },
          { tag: 'email', description: 'Email address', example: 'john@example.com' },
        ],
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      
      testTemplateId = result.id;
    });

    it('should fail to create template with duplicate key', async () => {
      await expect(
        caller.emailTemplates.create({
          name: 'Duplicate Template',
          key: 'test-template', // Same key
          subject: 'Test',
          htmlBody: '<p>Test</p>',
          category: 'notification',
          availableMergeTags: [],
        })
      ).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list all templates', async () => {
      const result = await caller.emailTemplates.list({});

      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThan(0);
      
      const testTemplate = result.items.find((t: { key: string }) => t.key === 'test-template');
      expect(testTemplate).toBeDefined();
    });

    it('should filter templates by category', async () => {
      const result = await caller.emailTemplates.list({ category: 'onboarding' });

      expect(result.items.every((t: { category: string }) => t.category === 'onboarding')).toBe(true);
    });

    it('should filter templates by isActive', async () => {
      const result = await caller.emailTemplates.list({ isActive: true });

      expect(result.items.every((t: { isActive: boolean }) => t.isActive === true)).toBe(true);
    });

    it('should search templates by name', async () => {
      const result = await caller.emailTemplates.list({ search: 'Test Welcome' });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.some((t: { name: string }) => t.name.includes('Test Welcome'))).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get template by id', async () => {
      const result = await caller.emailTemplates.getById({ id: testTemplateId });

      expect(result).toBeDefined();
      expect(result.id).toBe(testTemplateId);
      expect(result.name).toBe('Test Welcome Email');
      expect(result.key).toBe('test-template');
    });

    it('should throw error for non-existent template', async () => {
      await expect(
        caller.emailTemplates.getById({ id: 999999 })
      ).rejects.toThrow('Template not found');
    });
  });

  describe('getByKey', () => {
    it('should get template by key', async () => {
      const result = await caller.emailTemplates.getByKey({ key: 'test-template' });

      expect(result).toBeDefined();
      expect(result.id).toBe(testTemplateId);
      expect(result.key).toBe('test-template');
    });

    it('should throw error for non-existent key', async () => {
      await expect(
        caller.emailTemplates.getByKey({ key: 'non-existent-key' })
      ).rejects.toThrow('Template not found');
    });
  });

  describe('update', () => {
    it('should update template details', async () => {
      const result = await caller.emailTemplates.update({
        id: testTemplateId,
        name: 'Updated Welcome Email',
        subject: 'Hello {{firstName}}!',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      
      // Verify the update
      const updated = await caller.emailTemplates.getById({ id: testTemplateId });
      expect(updated.name).toBe('Updated Welcome Email');
      expect(updated.subject).toBe('Hello {{firstName}}!');
    });
  });

  describe('preview', () => {
    it('should preview template with sample data', async () => {
      const result = await caller.emailTemplates.preview({
        id: testTemplateId,
        sampleData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      });

      expect(result).toBeDefined();
      expect(result.subject).toContain('John');
      expect(result.htmlBody).toContain('John');
      expect(result.htmlBody).toContain('Doe');
      if (result.textBody) {
        expect(result.textBody).toContain('John');
        expect(result.textBody).toContain('Doe');
      }
    });
  });

  describe('delete', () => {
    it('should delete template', async () => {
      const result = await caller.emailTemplates.delete({ id: testTemplateId });

      expect(result.success).toBe(true);
      
      // Verify template was deleted
      await expect(
        caller.emailTemplates.getById({ id: testTemplateId })
      ).rejects.toThrow('Template not found');
      
      testTemplateId = 0; // Prevent cleanup from trying to delete again
    });
  });
});
