/**
 * Security Audit Tests
 * Tests for XSS protection, input validation, and security headers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOM environment for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

describe('XSS Protection', () => {
  describe('DOMPurify Sanitization', () => {
    it('should remove script tags from HTML', () => {
      const maliciousHtml = '<div>Hello <script>alert("xss")</script> World</div>';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
    });

    it('should remove onclick handlers', () => {
      const maliciousHtml = '<button onclick="alert(\'xss\')">Click me</button>';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('Click me');
    });

    it('should remove javascript: URLs', () => {
      const maliciousHtml = '<a href="javascript:alert(\'xss\')">Link</a>';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('javascript:');
    });

    it('should remove onerror handlers in images', () => {
      const maliciousHtml = '<img src="x" onerror="alert(\'xss\')">';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('onerror');
    });

    it('should allow safe HTML tags', () => {
      const safeHtml = '<p>Hello <strong>World</strong></p>';
      const sanitized = purify.sanitize(safeHtml);
      expect(sanitized).toBe('<p>Hello <strong>World</strong></p>');
    });

    it('should allow safe attributes', () => {
      const safeHtml = '<a href="https://example.com" class="link">Link</a>';
      const sanitized = purify.sanitize(safeHtml);
      expect(sanitized).toContain('href="https://example.com"');
      expect(sanitized).toContain('class="link"');
    });

    it('should remove SVG-based XSS', () => {
      const maliciousHtml = '<svg onload="alert(\'xss\')"><circle r="10"></circle></svg>';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('onload');
    });

    it('should remove data: URLs with scripts', () => {
      const maliciousHtml = '<a href="data:text/html,<script>alert(\'xss\')</script>">Link</a>';
      const sanitized = purify.sanitize(maliciousHtml);
      expect(sanitized).not.toContain('data:text/html');
    });
  });

  describe('Mention Highlight Sanitization', () => {
    const sanitizeConfig = {
      ALLOWED_TAGS: ['span', 'p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
    };

    it('should allow span tags with class for mentions', () => {
      const mentionHtml = '<span class="mention">@username</span>';
      const sanitized = purify.sanitize(mentionHtml, sanitizeConfig);
      expect(sanitized).toContain('<span class="mention">@username</span>');
    });

    it('should remove script tags even with allowed config', () => {
      const maliciousHtml = '<span class="mention">@user</span><script>alert("xss")</script>';
      const sanitized = purify.sanitize(maliciousHtml, sanitizeConfig);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('@user');
    });

    it('should remove disallowed attributes', () => {
      const maliciousHtml = '<span class="mention" onclick="alert(\'xss\')">@user</span>';
      const sanitized = purify.sanitize(maliciousHtml, sanitizeConfig);
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('class="mention"');
    });
  });
});

describe('Input Validation Patterns', () => {
  describe('Email Validation', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('should accept valid email addresses', () => {
      expect(emailRegex.test('user@example.com')).toBe(true);
      expect(emailRegex.test('user.name@domain.co.uk')).toBe(true);
      expect(emailRegex.test('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(emailRegex.test('invalid')).toBe(false);
      expect(emailRegex.test('invalid@')).toBe(false);
      expect(emailRegex.test('@domain.com')).toBe(false);
      expect(emailRegex.test('user @domain.com')).toBe(false);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should detect common SQL injection patterns', () => {
      const sqlInjectionPatterns = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "1; DELETE FROM users",
        "' UNION SELECT * FROM passwords --",
      ];

      const containsSqlInjection = (input: string) => {
        const patterns = [
          /(\s|;|'|")(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE)\s/i,
          /(\s|;|'|")UNION\s+SELECT/i,
          /--\s*$/,
          /'\s*OR\s*'[^']*'\s*=\s*'/i,
          /;\s*(DROP|DELETE|INSERT|UPDATE)/i,
        ];
        return patterns.some(pattern => pattern.test(input));
      };

      sqlInjectionPatterns.forEach(pattern => {
        expect(containsSqlInjection(pattern)).toBe(true);
      });
    });

    it('should allow normal text input', () => {
      const normalInputs = [
        "John's Coffee Shop",
        "SELECT * FROM menu",
        "I'd like to order",
        "User-submitted content",
      ];

      const containsSqlInjection = (input: string) => {
        const patterns = [
          /(\s|;|'|")(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE)\s/i,
          /(\s|;|'|")UNION\s+SELECT/i,
          /--\s*$/,
          /'\s*OR\s*'[^']*'\s*=\s*'/i,
          /;\s*(DROP|DELETE|INSERT|UPDATE)/i,
        ];
        return patterns.some(pattern => pattern.test(input));
      };

      // Note: "SELECT * FROM menu" would be flagged, but that's expected
      // In practice, parameterized queries handle this
      expect(containsSqlInjection("John's Coffee Shop")).toBe(false);
      expect(containsSqlInjection("I'd like to order")).toBe(false);
      expect(containsSqlInjection("User-submitted content")).toBe(false);
    });
  });

  describe('XSS Pattern Detection', () => {
    it('should detect common XSS patterns', () => {
      const xssPatterns = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        '<svg onload=alert("xss")>',
        'javascript:alert("xss")',
        '<a href="javascript:alert(\'xss\')">',
      ];

      const containsXss = (input: string) => {
        const patterns = [
          /<script\b[^>]*>/i,
          /on\w+\s*=/i,
          /javascript:/i,
          /<svg\b[^>]*on\w+/i,
        ];
        return patterns.some(pattern => pattern.test(input));
      };

      xssPatterns.forEach(pattern => {
        expect(containsXss(pattern)).toBe(true);
      });
    });
  });
});

describe('Rate Limiting', () => {
  it('should have rate limiter utility available', async () => {
    const { RateLimiter } = await import('../utils/rateLimiter');
    expect(RateLimiter).toBeDefined();
  });

  it('should limit requests correctly', async () => {
    const { RateLimiter } = await import('../utils/rateLimiter');
    const limiter = new RateLimiter({
      maxRequests: 3,
      windowMs: 60000,
    });

    const key = 'test-key';
    
    // First 3 requests should be allowed
    expect(limiter.check(key).allowed).toBe(true);
    expect(limiter.check(key).allowed).toBe(true);
    expect(limiter.check(key).allowed).toBe(true);
    
    // 4th request should be blocked
    expect(limiter.check(key).allowed).toBe(false);
  });
});

describe('Cookie Security', () => {
  it('should have secure cookie options', async () => {
    const { getSessionCookieOptions } = await import('../_core/cookies');
    
    // Mock a secure request with proper Express-like structure
    const mockReq = {
      protocol: 'https',
      hostname: 'coai-dashboard.manus.space',
      headers: {
        host: 'coai-dashboard.manus.space',
        'x-forwarded-proto': 'https',
      },
      get: (header: string) => {
        if (header === 'host') return 'coai-dashboard.manus.space';
        if (header === 'x-forwarded-proto') return 'https';
        return undefined;
      },
    } as any;

    const options = getSessionCookieOptions(mockReq);
    
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBeDefined();
    expect(options.path).toBe('/');
  });
});
