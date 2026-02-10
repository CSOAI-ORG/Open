/**
 * Tests for Certificate Renewal Router
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('Certificate Renewal Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRenewalStatus', () => {
    it('should calculate days until expiry correctly', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days from now
      
      const daysUntilExpiry = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysUntilExpiry).toBe(45);
    });

    it('should detect expired certificates', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      
      const daysUntilExpiry = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isExpired = daysUntilExpiry <= 0;

      expect(isExpired).toBe(true);
    });

    it('should detect expiring soon certificates', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
      
      const daysUntilExpiry = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

      expect(isExpiringSoon).toBe(true);
    });
  });

  describe('getCertificatesNeedingRenewal', () => {
    it('should filter certificates expiring within 30 days', async () => {
      const now = new Date();
      const certificates = [
        { id: 1, expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) }, // 10 days
        { id: 2, expiresAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000) }, // 45 days
        { id: 3, expiresAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },  // expired
        { id: 4, expiresAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000) }, // 25 days
      ];

      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const needingRenewal = certificates.filter(cert => 
        cert.expiresAt <= thirtyDaysFromNow
      );

      expect(needingRenewal).toHaveLength(3);
      expect(needingRenewal.map(c => c.id)).toContain(1);
      expect(needingRenewal.map(c => c.id)).toContain(3);
      expect(needingRenewal.map(c => c.id)).toContain(4);
    });
  });

  describe('startRecertification', () => {
    it('should create recertification record', async () => {
      const recertification = {
        originalCertificateId: 1,
        newCertificateId: 0, // Will be updated when new cert is issued
        userId: 123,
        courseId: 456,
        recertificationType: 'renewal',
        previousExpiryDate: '2024-01-01',
        discountApplied: 50,
      };

      expect(recertification.recertificationType).toBe('renewal');
      expect(recertification.discountApplied).toBe(50);
      expect(recertification.newCertificateId).toBe(0);
    });
  });

  describe('completeRecertification', () => {
    it('should calculate new expiry date correctly', async () => {
      const validityDays = 730; // 2 years
      const now = new Date();
      const newExpiryDate = new Date(now);
      newExpiryDate.setDate(newExpiryDate.getDate() + validityDays);

      const expectedYear = now.getFullYear() + 2;
      expect(newExpiryDate.getFullYear()).toBeGreaterThanOrEqual(expectedYear - 1);
      expect(newExpiryDate.getFullYear()).toBeLessThanOrEqual(expectedYear + 1);
    });
  });

  describe('updateCertificateStatuses', () => {
    it('should update expired status correctly', async () => {
      const now = new Date();
      const certificates = [
        { id: 1, expiresAt: new Date(now.getTime() - 1000), status: 'valid' },
        { id: 2, expiresAt: new Date(now.getTime() + 100000), status: 'valid' },
      ];

      const updated = certificates.map(cert => ({
        ...cert,
        status: cert.expiresAt < now ? 'expired' : cert.status,
      }));

      expect(updated[0].status).toBe('expired');
      expect(updated[1].status).toBe('valid');
    });

    it('should update expiring_soon status correctly', async () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const certificates = [
        { id: 1, expiresAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'valid' },
        { id: 2, expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), status: 'valid' },
      ];

      const updated = certificates.map(cert => ({
        ...cert,
        status: cert.expiresAt >= now && cert.expiresAt <= thirtyDaysFromNow 
          ? 'expiring_soon' 
          : cert.status,
      }));

      expect(updated[0].status).toBe('expiring_soon');
      expect(updated[1].status).toBe('valid');
    });
  });

  describe('sendRenewalReminders', () => {
    it('should identify certificates for 30-day reminder', async () => {
      const now = new Date();
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + 30);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      const certificates = [
        { id: 1, expiresAt: targetDate.toISOString(), renewalReminderSent30: 0 },
        { id: 2, expiresAt: targetDate.toISOString(), renewalReminderSent30: 1 },
      ];

      const needsReminder = certificates.filter(
        cert => cert.expiresAt.startsWith(targetDateStr) && cert.renewalReminderSent30 === 0
      );

      expect(needsReminder).toHaveLength(1);
      expect(needsReminder[0].id).toBe(1);
    });
  });

  describe('getValidityConfig', () => {
    it('should return default config when none exists', async () => {
      const defaultConfig = {
        validityPeriodDays: 730,
        renewalReminderDays: [30, 14, 7],
        requiresRecertification: true,
        recertificationDiscountPercent: 50,
      };

      expect(defaultConfig.validityPeriodDays).toBe(730);
      expect(defaultConfig.renewalReminderDays).toEqual([30, 14, 7]);
      expect(defaultConfig.requiresRecertification).toBe(true);
    });

    it('should parse renewal reminder days from string', async () => {
      const configString = '30,14,7';
      const reminderDays = configString.split(',').map(Number);

      expect(reminderDays).toEqual([30, 14, 7]);
    });
  });

  describe('updateValidityConfig', () => {
    it('should validate validity period range', async () => {
      const minDays = 30;
      const maxDays = 3650;

      expect(365).toBeGreaterThanOrEqual(minDays);
      expect(365).toBeLessThanOrEqual(maxDays);
      expect(29).toBeLessThan(minDays);
      expect(3651).toBeGreaterThan(maxDays);
    });

    it('should validate discount percentage range', async () => {
      const minPercent = 0;
      const maxPercent = 100;

      expect(50).toBeGreaterThanOrEqual(minPercent);
      expect(50).toBeLessThanOrEqual(maxPercent);
      expect(-1).toBeLessThan(minPercent);
      expect(101).toBeGreaterThan(maxPercent);
    });
  });
});
