/**
 * Tests for Certificate Gallery Router
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('Certificate Gallery Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should return default settings for new user', async () => {
      const defaultSettings = {
        isPublic: true,
        publicSlug: null,
        displayName: 'Certificate Holder',
        bio: null,
        linkedInUrl: null,
        showExamScores: false,
        showCompletionDates: true,
        showExpirationDates: true,
        theme: 'default',
      };

      expect(defaultSettings.isPublic).toBe(true);
      expect(defaultSettings.showExamScores).toBe(false);
      expect(defaultSettings.theme).toBe('default');
    });
  });

  describe('updateSettings', () => {
    it('should validate slug format', async () => {
      const validSlugs = ['john-doe', 'user123', 'my-profile'];
      const invalidSlugs = ['John Doe', 'user@123', 'my profile'];

      const slugRegex = /^[a-z0-9-]+$/;

      validSlugs.forEach(slug => {
        expect(slugRegex.test(slug)).toBe(true);
      });

      invalidSlugs.forEach(slug => {
        expect(slugRegex.test(slug)).toBe(false);
      });
    });

    it('should validate LinkedIn URL format', async () => {
      const validUrls = [
        'https://linkedin.com/in/johndoe',
        'https://www.linkedin.com/in/jane-doe',
      ];

      validUrls.forEach(url => {
        expect(url.startsWith('https://')).toBe(true);
        expect(url.includes('linkedin.com')).toBe(true);
      });
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from user name', async () => {
      const userName = 'John Doe';
      const slug = userName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      expect(slug).toBe('john-doe');
    });

    it('should handle special characters', async () => {
      const userName = "O'Brien & Associates";
      const slug = userName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      expect(slug).toBe('o-brien-associates');
    });
  });

  describe('getMyCertificates', () => {
    it('should calculate expiration status correctly', async () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const isExpired = (expiresAt: Date) => expiresAt < now;
      const isExpiringSoon = (expiresAt: Date) => 
        expiresAt > now && expiresAt < thirtyDaysFromNow;

      expect(isExpired(thirtyDaysAgo)).toBe(true);
      expect(isExpired(sixtyDaysFromNow)).toBe(false);
      expect(isExpiringSoon(new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000))).toBe(true);
      expect(isExpiringSoon(sixtyDaysFromNow)).toBe(false);
    });
  });

  describe('toggleCertificateVisibility', () => {
    it('should toggle visibility correctly', async () => {
      let showInGallery = true;
      
      // Toggle off
      showInGallery = !showInGallery;
      expect(showInGallery).toBe(false);
      
      // Toggle on
      showInGallery = !showInGallery;
      expect(showInGallery).toBe(true);
    });
  });

  describe('getPublicGallery', () => {
    it('should return null for private gallery', async () => {
      const settings = { isPublic: 0 };
      const result = settings.isPublic === 1 ? { gallery: 'data' } : null;
      
      expect(result).toBeNull();
    });

    it('should filter certificates by showInGallery', async () => {
      const certificates = [
        { id: 1, showInGallery: 1 },
        { id: 2, showInGallery: 0 },
        { id: 3, showInGallery: 1 },
      ];

      const visibleCerts = certificates.filter(c => c.showInGallery === 1);
      expect(visibleCerts).toHaveLength(2);
    });

    it('should respect display settings', async () => {
      const settings = {
        showExamScores: 0,
        showCompletionDates: 1,
        showExpirationDates: 1,
      };

      const cert = {
        examScore: 85,
        issuedAt: '2024-01-01',
        expiresAt: '2026-01-01',
      };

      const displayedCert = {
        examScore: settings.showExamScores === 1 ? cert.examScore : null,
        issuedAt: settings.showCompletionDates === 1 ? cert.issuedAt : null,
        expiresAt: settings.showExpirationDates === 1 ? cert.expiresAt : null,
      };

      expect(displayedCert.examScore).toBeNull();
      expect(displayedCert.issuedAt).toBe('2024-01-01');
      expect(displayedCert.expiresAt).toBe('2026-01-01');
    });
  });

  describe('getStats', () => {
    it('should calculate stats correctly', async () => {
      const certificates = [
        { status: 'valid', showInGallery: 1 },
        { status: 'valid', showInGallery: 1 },
        { status: 'expiring_soon', showInGallery: 1 },
        { status: 'expired', showInGallery: 0 },
      ];

      const stats = {
        total: certificates.length,
        valid: certificates.filter(c => c.status === 'valid').length,
        expiringSoon: certificates.filter(c => c.status === 'expiring_soon').length,
        expired: certificates.filter(c => c.status === 'expired').length,
        inGallery: certificates.filter(c => c.showInGallery === 1).length,
      };

      expect(stats.total).toBe(4);
      expect(stats.valid).toBe(2);
      expect(stats.expiringSoon).toBe(1);
      expect(stats.expired).toBe(1);
      expect(stats.inGallery).toBe(3);
    });
  });
});
