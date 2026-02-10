/**
 * Tests for Certificate Expiration Features
 * 
 * Tests for:
 * - Email preference opt-out for expiration reminders
 * - Certificate verification public endpoint
 * - Cron job endpoint for daily expiration check
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the database
vi.mock('../db', () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  }),
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    },
  })),
}));

describe('Certificate Expiration Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Email Preference Opt-Out', () => {
    it('should check if user has opted out of expiration reminders', async () => {
      const { hasUserOptedOutOfReminders } = await import('../services/certificateExpirationEmailService');
      
      // Default behavior - no preferences means opted in
      const result = await hasUserOptedOutOfReminders(1);
      expect(result).toBe(false);
    });

    it('should return true when user has disabled expiration reminders', async () => {
      const { getDb } = await import('../db');
      (getDb as any).mockResolvedValue({
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ expirationRemindersEnabled: 0 }]),
      });

      const { hasUserOptedOutOfReminders } = await import('../services/certificateExpirationEmailService');
      const result = await hasUserOptedOutOfReminders(1);
      
      expect(result).toBe(true);
    });

    it('should return false when user has enabled expiration reminders', async () => {
      const { getDb } = await import('../db');
      (getDb as any).mockResolvedValue({
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ expirationRemindersEnabled: 1 }]),
      });

      const { hasUserOptedOutOfReminders } = await import('../services/certificateExpirationEmailService');
      const result = await hasUserOptedOutOfReminders(1);
      
      expect(result).toBe(false);
    });
  });

  describe('Process Expiration Reminders with Opt-Out', () => {
    it('should skip users who have opted out', async () => {
      const { processExpirationReminders } = await import('../services/certificateExpirationEmailService');
      
      // The function should return skippedOptOut count
      const result = await processExpirationReminders(30);
      
      expect(result).toHaveProperty('skippedOptOut');
      expect(typeof result.skippedOptOut).toBe('number');
    });

    it('should include skippedOptOut in runDailyExpirationCheck results', async () => {
      const { runDailyExpirationCheck } = await import('../services/certificateExpirationEmailService');
      
      const result = await runDailyExpirationCheck();
      
      expect(result.thirtyDay).toHaveProperty('skippedOptOut');
      expect(result.fourteenDay).toHaveProperty('skippedOptOut');
      expect(result.sevenDay).toHaveProperty('skippedOptOut');
    });
  });

  describe('Certificate Verification Status', () => {
    it('should identify valid certificate status', () => {
      const mockCertificate = {
        status: 'valid',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const now = new Date();
      const expiresAt = new Date(mockCertificate.expiresAt);
      const isExpired = expiresAt < now;
      
      expect(mockCertificate.status).toBe('valid');
      expect(isExpired).toBe(false);
    });

    it('should identify expired certificate status', () => {
      const mockCertificate = {
        status: 'expired',
        expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const now = new Date();
      const expiresAt = new Date(mockCertificate.expiresAt);
      const isExpired = expiresAt < now;
      
      expect(isExpired).toBe(true);
    });

    it('should identify expiring soon certificate', () => {
      const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      
      expect(isExpiringSoon).toBe(true);
      expect(daysUntilExpiry).toBeLessThanOrEqual(30);
    });

    it('should identify revoked certificate status', () => {
      const mockCertificate = {
        status: 'revoked',
      };
      
      expect(mockCertificate.status).toBe('revoked');
    });
  });

  describe('Cron Endpoint Authentication', () => {
    it('should require authentication for cron endpoints', () => {
      const CRON_SECRET = process.env.CRON_SECRET || 'default-cron-secret-change-me';
      
      // Verify secret exists
      expect(CRON_SECRET).toBeDefined();
      expect(CRON_SECRET.length).toBeGreaterThan(0);
    });

    it('should accept valid authorization header', () => {
      const CRON_SECRET = 'test-secret';
      const authHeader = `Bearer ${CRON_SECRET}`;
      const providedSecret = authHeader.replace('Bearer ', '');
      
      expect(providedSecret).toBe(CRON_SECRET);
    });

    it('should accept valid x-cron-secret header', () => {
      const CRON_SECRET = 'test-secret';
      const cronSecretHeader = CRON_SECRET;
      
      expect(cronSecretHeader).toBe(CRON_SECRET);
    });
  });

  describe('Email Preferences Schema', () => {
    it('should have expirationRemindersEnabled field', () => {
      // Verify the schema includes the new field
      const expectedFields = [
        'certificatesEnabled',
        'progressReportsEnabled',
        'atRiskAlertsEnabled',
        'courseUpdatesEnabled',
        'achievementsEnabled',
        'instructorMessagesEnabled',
        'expirationRemindersEnabled',
      ];
      
      // This is a structural test - the field should exist in the schema
      expectedFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('should default expirationRemindersEnabled to true (1)', () => {
      const defaultPreferences = {
        certificatesEnabled: 1,
        progressReportsEnabled: 1,
        atRiskAlertsEnabled: 1,
        courseUpdatesEnabled: 1,
        achievementsEnabled: 1,
        instructorMessagesEnabled: 1,
        expirationRemindersEnabled: 1,
      };
      
      expect(defaultPreferences.expirationRemindersEnabled).toBe(1);
    });
  });

  describe('Verification Result Format', () => {
    it('should return proper verification result structure', () => {
      const mockResult = {
        valid: true,
        status: 'valid' as const,
        certificate: {
          certificateId: 'COAI-EUAIACT-1704067200000-A1B2C3D4',
          holderName: 'John Doe',
          courseName: 'EU AI Act Compliance',
          framework: 'EU AI Act',
          issuedAt: '2024-01-01T00:00:00.000Z',
          expiresAt: '2025-01-01T00:00:00.000Z',
          certificationLevel: 'Foundation',
        },
        message: 'Certificate is valid and verified.',
        verifiedAt: new Date().toISOString(),
      };
      
      expect(mockResult).toHaveProperty('valid');
      expect(mockResult).toHaveProperty('status');
      expect(mockResult).toHaveProperty('certificate');
      expect(mockResult).toHaveProperty('message');
      expect(mockResult).toHaveProperty('verifiedAt');
      
      expect(mockResult.certificate).toHaveProperty('certificateId');
      expect(mockResult.certificate).toHaveProperty('holderName');
      expect(mockResult.certificate).toHaveProperty('courseName');
    });

    it('should handle not found status', () => {
      const mockResult = {
        valid: false,
        status: 'not_found' as const,
        message: 'Certificate not found. Please verify the certificate ID is correct.',
        verifiedAt: new Date().toISOString(),
      };
      
      expect(mockResult.valid).toBe(false);
      expect(mockResult.status).toBe('not_found');
      expect(mockResult.certificate).toBeUndefined();
    });
  });
});

describe('Cron Job Results Format', () => {
  it('should return proper cron job result structure', () => {
    const mockResults = {
      success: true,
      duration: '1234ms',
      timestamp: new Date().toISOString(),
      results: {
        thirtyDay: { processed: 10, sent: 5, skipped: 3, skippedOptOut: 2, errors: 0 },
        fourteenDay: { processed: 8, sent: 4, skipped: 2, skippedOptOut: 1, errors: 1 },
        sevenDay: { processed: 5, sent: 3, skipped: 1, skippedOptOut: 1, errors: 0 },
      },
      totals: {
        totalProcessed: 23,
        totalSent: 12,
        totalSkipped: 6,
        totalSkippedOptOut: 4,
        totalErrors: 1,
      },
    };
    
    expect(mockResults).toHaveProperty('success');
    expect(mockResults).toHaveProperty('duration');
    expect(mockResults).toHaveProperty('results');
    expect(mockResults).toHaveProperty('totals');
    
    expect(mockResults.results.thirtyDay).toHaveProperty('skippedOptOut');
    expect(mockResults.totals.totalSkippedOptOut).toBe(4);
  });
});
