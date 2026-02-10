/**
 * Verification Badge API Tests
 * 
 * Tests for the certificate verification badge endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database
vi.mock('../db', () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

describe('Verification Badge API', () => {
  describe('Badge SVG Generation', () => {
    it('should generate valid SVG for compact style', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/TEST-CERT-123?style=compact&theme=light');
      
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('image/svg+xml');
      
      const svg = await response.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('CSOAI Certified');
      expect(svg).toContain('width="180"');
      expect(svg).toContain('height="48"');
    });

    it('should generate valid SVG for minimal style', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/TEST-CERT-123?style=minimal&theme=light');
      
      expect(response.ok).toBe(true);
      
      const svg = await response.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="120"');
      expect(svg).toContain('height="28"');
    });

    it('should generate valid SVG for detailed style', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/TEST-CERT-123?style=detailed&theme=light');
      
      expect(response.ok).toBe(true);
      
      const svg = await response.text();
      expect(svg).toContain('<svg');
      // Detailed style has larger dimensions
      expect(svg).toContain('viewBox');
    });

    it('should support dark theme', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/TEST-CERT-123?style=compact&theme=dark');
      
      expect(response.ok).toBe(true);
      
      const svg = await response.text();
      expect(svg).toContain('<svg');
      // Dark theme uses different background color
      expect(svg).toContain('#1e293b');
    });
  });

  describe('Widget.js Endpoint', () => {
    it('should return JavaScript widget code', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/widget.js');
      
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/javascript');
      
      const script = await response.text();
      expect(script).toContain('CSOAI Certificate Verification Badge Widget');
      expect(script).toContain('function initBadges()');
      expect(script).toContain('window.CSOAIBadge');
    });
  });

  describe('Embed Code Endpoint', () => {
    it('should return embed code for certificate', async () => {
      const response = await fetch('http://localhost:3000/api/verification-badge/TEST-CERT-123/embed');
      
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');
      
      const data = await response.json();
      expect(data.certificateId).toBe('TEST-CERT-123');
      expect(data.badgeUrl).toContain('/api/verification-badge/TEST-CERT-123');
      expect(data.verifyUrl).toContain('/verify/TEST-CERT-123');
      expect(data.embedCode).toHaveProperty('html');
      expect(data.embedCode).toHaveProperty('markdown');
      expect(data.embedCode).toHaveProperty('bbcode');
      expect(data.styles).toContain('compact');
      expect(data.styles).toContain('detailed');
      expect(data.styles).toContain('minimal');
      expect(data.themes).toContain('light');
      expect(data.themes).toContain('dark');
    });
  });
});

describe('Cron API', () => {
  describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
      const response = await fetch('http://localhost:3000/api/cron/health');
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('cron');
      expect(data.timestamp).toBeDefined();
      expect(data.endpoints).toBeInstanceOf(Array);
      expect(data.endpoints.length).toBeGreaterThan(0);
      expect(data.endpoints[0].path).toBe('/api/cron/certificate-expiration');
    });
  });

  describe('Certificate Expiration Endpoint', () => {
    it('should reject requests without authentication', async () => {
      const response = await fetch('http://localhost:3000/api/cron/certificate-expiration', {
        method: 'POST',
      });
      
      expect(response.status).toBe(401);
      
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject requests with invalid secret', async () => {
      const response = await fetch('http://localhost:3000/api/cron/certificate-expiration', {
        method: 'POST',
        headers: {
          'x-cron-secret': 'invalid-secret',
        },
      });
      
      expect(response.status).toBe(401);
    });
  });
});
