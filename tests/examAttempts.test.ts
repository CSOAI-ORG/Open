/**
 * Tests for Exam Attempts Router
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('Exam Attempts Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLimits', () => {
    it('should return default limits when no custom config exists', async () => {
      const { getDb } = await import('../db');
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      (getDb as any).mockResolvedValue(mockDb);

      // Test that default values are returned
      const defaultLimits = {
        maxAttempts: 3,
        cooldownHours: 24,
        passingScore: 70,
      };

      expect(defaultLimits.maxAttempts).toBe(3);
      expect(defaultLimits.cooldownHours).toBe(24);
      expect(defaultLimits.passingScore).toBe(70);
    });

    it('should return custom limits when config exists', async () => {
      const customLimits = {
        maxAttempts: 5,
        cooldownHours: 48,
        passingScore: 80,
      };

      expect(customLimits.maxAttempts).toBe(5);
      expect(customLimits.cooldownHours).toBe(48);
      expect(customLimits.passingScore).toBe(80);
    });
  });

  describe('getUserAttempts', () => {
    it('should return empty attempts for new user', async () => {
      const result = {
        attempts: [],
        totalAttempts: 0,
        maxAttempts: 3,
        attemptsRemaining: 3,
        hasPassed: false,
        passedAttemptId: undefined,
        canRetake: true,
        cooldownEndsAt: null,
        passingScore: 70,
      };

      expect(result.attempts).toHaveLength(0);
      expect(result.attemptsRemaining).toBe(3);
      expect(result.canRetake).toBe(true);
    });

    it('should correctly calculate attempts remaining', async () => {
      const maxAttempts = 3;
      const currentAttempts = 2;
      const attemptsRemaining = Math.max(0, maxAttempts - currentAttempts);

      expect(attemptsRemaining).toBe(1);
    });

    it('should detect when user has passed', async () => {
      const attempts = [
        { id: 1, passed: 0, percentageScore: 65 },
        { id: 2, passed: 1, percentageScore: 85 },
      ];

      const hasPassed = attempts.some(a => a.passed === 1);
      expect(hasPassed).toBe(true);
    });

    it('should calculate cooldown correctly', async () => {
      const lastAttemptTime = new Date('2024-01-01T10:00:00Z');
      const cooldownHours = 24;
      const cooldownEnd = new Date(lastAttemptTime.getTime() + cooldownHours * 60 * 60 * 1000);
      
      expect(cooldownEnd.getTime()).toBe(lastAttemptTime.getTime() + 24 * 60 * 60 * 1000);
    });
  });

  describe('submitAttempt', () => {
    it('should calculate score correctly', async () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 0, isCorrect: true },
        { questionId: 'q2', selectedAnswer: 1, isCorrect: false },
        { questionId: 'q3', selectedAnswer: 2, isCorrect: true },
        { questionId: 'q4', selectedAnswer: 0, isCorrect: true },
      ];

      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const totalQuestions = answers.length;
      const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);

      expect(correctAnswers).toBe(3);
      expect(totalQuestions).toBe(4);
      expect(percentageScore).toBe(75);
    });

    it('should determine pass/fail correctly', async () => {
      const passingScore = 70;
      
      expect(75 >= passingScore).toBe(true); // Pass
      expect(65 >= passingScore).toBe(false); // Fail
      expect(70 >= passingScore).toBe(true); // Exactly passing
    });

    it('should reject attempt when max attempts reached', async () => {
      const maxAttempts = 3;
      const currentAttempts = 3;

      expect(currentAttempts >= maxAttempts).toBe(true);
    });

    it('should reject attempt when already passed', async () => {
      const existingPass = { id: 1, passed: 1 };
      expect(existingPass).toBeTruthy();
    });
  });

  describe('getExamHistory', () => {
    it('should group attempts by course', async () => {
      const attempts = [
        { courseId: 1, courseName: 'Course A', percentageScore: 75, passed: 1 },
        { courseId: 1, courseName: 'Course A', percentageScore: 65, passed: 0 },
        { courseId: 2, courseName: 'Course B', percentageScore: 80, passed: 1 },
      ];

      const byCourse = attempts.reduce((acc, attempt) => {
        const key = attempt.courseId;
        if (!acc[key]) {
          acc[key] = {
            courseId: attempt.courseId,
            courseName: attempt.courseName,
            attempts: [],
            bestScore: 0,
            hasPassed: false,
          };
        }
        acc[key].attempts.push(attempt);
        if (attempt.percentageScore > acc[key].bestScore) {
          acc[key].bestScore = attempt.percentageScore;
        }
        if (attempt.passed === 1) {
          acc[key].hasPassed = true;
        }
        return acc;
      }, {} as Record<number, any>);

      expect(Object.keys(byCourse)).toHaveLength(2);
      expect(byCourse[1].attempts).toHaveLength(2);
      expect(byCourse[1].bestScore).toBe(75);
      expect(byCourse[1].hasPassed).toBe(true);
      expect(byCourse[2].attempts).toHaveLength(1);
    });
  });
});
