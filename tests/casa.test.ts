import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { sendWelcomeEmail, scheduleNurtureSequence } from '../_core/emailService';

describe('CASA Enrollment E2E Tests', () => {
  const testEmail = `test-casa-${Date.now()}@example.com`;
  const testUser = {
    name: 'Test Analyst',
    email: testEmail,
    organization: 'Test Org',
  };

  describe('CASA Signup and Email Integration', () => {
    it('should create a new CASA subscriber', async () => {
      // Simulate signup
      const subscriber = await db.insert({
        email: testUser.email,
        name: testUser.name,
        organization: testUser.organization,
        enrollmentDate: new Date(),
        status: 'active',
      });

      expect(subscriber).toBeDefined();
      expect(subscriber.email).toBe(testUser.email);
    });

    it('should send welcome email on signup', async () => {
      const result = await sendWelcomeEmail({
        email: testUser.email,
        name: testUser.name,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should schedule 7-part nurture sequence', async () => {
      const scheduleResult = await scheduleNurtureSequence({
        email: testUser.email,
        name: testUser.name,
        enrollmentDate: new Date(),
      });

      expect(scheduleResult).toBeDefined();
      expect(scheduleResult.scheduled).toBe(true);
      expect(scheduleResult.emailsScheduled).toBe(7);
    });

    it('should track email delivery status', async () => {
      // Verify email was sent and tracked
      const emailHistory = await db.query(
        'SELECT * FROM emailHistory WHERE email = ? ORDER BY createdAt DESC LIMIT 1',
        [testUser.email]
      );

      expect(emailHistory).toBeDefined();
      expect(emailHistory.length).toBeGreaterThan(0);
      expect(emailHistory[0].type).toBe('welcome');
      expect(emailHistory[0].status).toBe('sent');
    });

    it('should verify nurture sequence is scheduled for future dates', async () => {
      const futureEmails = await db.query(
        'SELECT * FROM emailSchedule WHERE email = ? AND scheduledFor > NOW() ORDER BY scheduledFor ASC',
        [testUser.email]
      );

      expect(futureEmails).toBeDefined();
      expect(futureEmails.length).toBe(7);

      // Verify spacing (approximately 4 days apart)
      for (let i = 1; i < futureEmails.length; i++) {
        const daysDiff = Math.floor(
          (new Date(futureEmails[i].scheduledFor).getTime() - 
           new Date(futureEmails[i-1].scheduledFor).getTime()) / (1000 * 60 * 60 * 24)
        );
        expect(daysDiff).toBeGreaterThanOrEqual(3);
        expect(daysDiff).toBeLessThanOrEqual(5);
      }
    });

    it('should create CASA enrollment record', async () => {
      const enrollment = await db.insert({
        email: testUser.email,
        courseId: 'casa-2026',
        status: 'enrolled',
        enrollmentDate: new Date(),
        completionTarget: new Date(2026, 7, 2), // August 2, 2026
      });

      expect(enrollment).toBeDefined();
      expect(enrollment.status).toBe('enrolled');
    });

    it('should track module progress', async () => {
      // Simulate starting Module 1
      const progress = await db.insert({
        email: testUser.email,
        moduleId: 'module-1',
        status: 'in_progress',
        startDate: new Date(),
      });

      expect(progress).toBeDefined();
      expect(progress.moduleId).toBe('module-1');
      expect(progress.status).toBe('in_progress');
    });

    it('should send module-specific nurture email', async () => {
      const moduleEmail = await sendWelcomeEmail({
        email: testUser.email,
        name: testUser.name,
        type: 'module-1-intro',
      });

      expect(moduleEmail).toBeDefined();
      expect(moduleEmail.success).toBe(true);
    });

    it('should verify complete enrollment workflow', async () => {
      // Full workflow verification
      const subscriber = await db.query(
        'SELECT * FROM casaSubscribers WHERE email = ?',
        [testUser.email]
      );

      const enrollment = await db.query(
        'SELECT * FROM casaEnrollments WHERE email = ?',
        [testUser.email]
      );

      const emailHistory = await db.query(
        'SELECT * FROM emailHistory WHERE email = ?',
        [testUser.email]
      );

      expect(subscriber.length).toBeGreaterThan(0);
      expect(enrollment.length).toBeGreaterThan(0);
      expect(emailHistory.length).toBeGreaterThanOrEqual(2); // Welcome + at least one nurture
    });
  });

  describe('Email Content Verification', () => {
    it('should contain correct welcome email content', async () => {
      const emailContent = await getEmailContent(testUser.email, 'welcome');
      
      expect(emailContent).toContain('Welcome to CASA');
      expect(emailContent).toContain('250,000 trained analysts');
      expect(emailContent).toContain('August 2, 2026');
      expect(emailContent).toContain('7 modules');
    });

    it('should contain module-specific nurture content', async () => {
      const module1Email = await getEmailContent(testUser.email, 'module-1');
      
      expect(module1Email).toContain('Module 1');
      expect(module1Email).toContain('AI Safety Fundamentals');
      expect(module1Email).toContain('start learning');
    });
  });
});

// Helper function to get email content from history
async function getEmailContent(email: string, type: string): Promise<string> {
  const result = await db.query(
    'SELECT content FROM emailHistory WHERE email = ? AND type = ? LIMIT 1',
    [email, type]
  );
  return result[0]?.content || '';
}
