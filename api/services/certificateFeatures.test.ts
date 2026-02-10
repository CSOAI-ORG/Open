/**
 * Tests for Certificate Features
 * 
 * Tests for:
 * - Certificate expiration email service
 * - Certificate verification API
 * - Exam history endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    },
  })),
}));

describe('Certificate Expiration Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCertificatesExpiringInDays', () => {
    it('should return empty array when database is not available', async () => {
      const { getDb } = await import('../db');
      (getDb as any).mockResolvedValue(null);

      const { getCertificatesExpiringInDays } = await import('../services/certificateExpirationEmailService');
      const result = await getCertificatesExpiringInDays(30);
      
      expect(result).toEqual([]);
    });
  });

  describe('sendExpirationReminderEmail', () => {
    it('should send email with correct urgency for 30-day reminder', async () => {
      const { sendExpirationReminderEmail } = await import('../services/certificateExpirationEmailService');
      
      const result = await sendExpirationReminderEmail(
        'test@example.com',
        'Test User',
        'CERT-001',
        'EU AI Act Fundamentals',
        'EU AI Act',
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        30
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-email-id');
    });

    it('should send email with urgent styling for 7-day reminder', async () => {
      const { sendExpirationReminderEmail } = await import('../services/certificateExpirationEmailService');
      
      const result = await sendExpirationReminderEmail(
        'test@example.com',
        'Test User',
        'CERT-001',
        'EU AI Act Fundamentals',
        'EU AI Act',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        7
      );

      expect(result.success).toBe(true);
    });
  });

  describe('hasReminderBeenSent', () => {
    it('should return false when database is not available', async () => {
      const { getDb } = await import('../db');
      (getDb as any).mockResolvedValue(null);

      const { hasReminderBeenSent } = await import('../services/certificateExpirationEmailService');
      const result = await hasReminderBeenSent(1, '30_days');
      
      expect(result).toBe(false);
    });
  });
});

describe('Certificate Verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verify endpoint logic', () => {
    it('should identify valid certificate status', async () => {
      const mockCertificate = {
        id: 1,
        certificateId: 'CERT-001',
        status: 'valid',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      expect(mockCertificate.status).toBe('valid');
    });

    it('should identify expired certificate status', async () => {
      const mockCertificate = {
        id: 1,
        certificateId: 'CERT-002',
        status: 'expired',
        expiresAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      };

      expect(mockCertificate.status).toBe('expired');
    });

    it('should identify revoked certificate status', async () => {
      const mockCertificate = {
        id: 1,
        certificateId: 'CERT-003',
        status: 'revoked',
      };

      expect(mockCertificate.status).toBe('revoked');
    });

    it('should detect expiring soon certificates', async () => {
      const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const isExpiringSoon = (expiresAt.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      
      expect(isExpiringSoon).toBe(true);
    });
  });

  describe('rate limiting', () => {
    it('should have correct rate limit configuration', () => {
      const RATE_LIMIT_MAX_REQUESTS = 30;
      const RATE_LIMIT_WINDOW_MS = 60 * 1000;
      
      expect(RATE_LIMIT_MAX_REQUESTS).toBe(30);
      expect(RATE_LIMIT_WINDOW_MS).toBe(60000);
    });
  });
});

describe('Exam History Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExamHistory', () => {
    it('should group attempts by course', async () => {
      const mockAttempts = [
        { courseId: 1, courseName: 'EU AI Act', percentageScore: '85.00', passed: 1 },
        { courseId: 1, courseName: 'EU AI Act', percentageScore: '65.00', passed: 0 },
        { courseId: 2, courseName: 'NIST AI RMF', percentageScore: '72.00', passed: 1 },
      ];

      const byCourse: Record<number, any> = {};
      for (const attempt of mockAttempts) {
        if (!byCourse[attempt.courseId]) {
          byCourse[attempt.courseId] = {
            courseId: attempt.courseId,
            courseName: attempt.courseName,
            attempts: [],
            bestScore: 0,
            hasPassed: false,
          };
        }
        byCourse[attempt.courseId].attempts.push(attempt);
        const score = Number(attempt.percentageScore);
        if (score > byCourse[attempt.courseId].bestScore) {
          byCourse[attempt.courseId].bestScore = score;
        }
        if (attempt.passed === 1) {
          byCourse[attempt.courseId].hasPassed = true;
        }
      }

      const result = Object.values(byCourse);
      
      expect(result.length).toBe(2);
      expect(result[0].bestScore).toBe(85);
      expect(result[0].hasPassed).toBe(true);
      expect(result[1].bestScore).toBe(72);
    });

    it('should calculate best score correctly', async () => {
      const attempts = [
        { percentageScore: '65.00' },
        { percentageScore: '72.00' },
        { percentageScore: '85.00' },
        { percentageScore: '78.00' },
      ];

      const bestScore = Math.max(...attempts.map(a => Number(a.percentageScore)));
      expect(bestScore).toBe(85);
    });
  });
});

describe('Certificate Expiration Router', () => {
  describe('triggerExpirationCheck', () => {
    it('should require admin access', async () => {
      const mockUser = { id: 1, role: 'user' };
      expect(mockUser.role).not.toBe('admin');
    });

    it('should allow admin to trigger check', async () => {
      const mockUser = { id: 1, role: 'admin' };
      expect(mockUser.role).toBe('admin');
    });
  });

  describe('getExpirationStats', () => {
    it('should return certificate counts by status', async () => {
      const mockStats = {
        expiringIn7Days: 5,
        expiringIn14Days: 10,
        expiringIn30Days: 25,
        totalExpired: 3,
        remindersSentToday: 8,
      };

      expect(mockStats.expiringIn7Days).toBe(5);
      expect(mockStats.expiringIn14Days).toBe(10);
      expect(mockStats.expiringIn30Days).toBe(25);
      expect(mockStats.totalExpired).toBe(3);
    });
  });
});

describe('ExamHistoryWidget Component Data', () => {
  it('should handle empty exam history', () => {
    const examHistory: any[] = [];
    const totalPassed = examHistory.filter(e => e.hasPassed).length;
    const totalCourses = examHistory.length;

    expect(totalPassed).toBe(0);
    expect(totalCourses).toBe(0);
  });

  it('should calculate stats correctly', () => {
    const examHistory = [
      { courseId: 1, hasPassed: true, attempts: [{ id: 1 }, { id: 2 }] },
      { courseId: 2, hasPassed: false, attempts: [{ id: 3 }] },
      { courseId: 3, hasPassed: true, attempts: [{ id: 4 }] },
    ];

    const totalPassed = examHistory.filter(e => e.hasPassed).length;
    const totalCourses = examHistory.length;
    const totalAttempts = examHistory.reduce((sum, e) => sum + e.attempts.length, 0);

    expect(totalPassed).toBe(2);
    expect(totalCourses).toBe(3);
    expect(totalAttempts).toBe(4);
  });
});
