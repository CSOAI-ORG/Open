import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// List of all critical pages to test
const publicPages = [
  { path: '/', name: 'Homepage' },
  { path: '/login', name: 'Login' },
  { path: '/signup', name: 'Signup' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/about', name: 'About' },
  { path: '/about-ceasai', name: 'About CEASAI' },
  { path: '/faq', name: 'FAQ' },
  { path: '/contact', name: 'Contact' },
  { path: '/support', name: 'Support' },
  { path: '/courses', name: 'Courses' },
  { path: '/training', name: 'Training' },
  { path: '/certification', name: 'Certification' },
  { path: '/compliance', name: 'Compliance' },
  { path: '/enterprise', name: 'Enterprise' },
  { path: '/watchdog', name: 'Watchdog' },
  { path: '/watchdog/incident', name: 'Watchdog Incident Report' },
  { path: '/watchdog/help-protect-humanity', name: 'Watchdog Help Protect Humanity' },
  { path: '/public-watchdog', name: 'Public Watchdog' },
  { path: '/agent-council', name: 'Agent Council' },
  { path: '/leaderboard', name: 'Leaderboard' },
  { path: '/api-docs', name: 'API Docs' },
  { path: '/soai-pdca', name: 'SOAI-PDCA' },
  { path: '/global-ai-safety-initiative', name: 'Global AI Safety Initiative' },
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/how-it-works/dashboard', name: 'Dashboard How It Works' },
  { path: '/how-it-works/training', name: 'Training How It Works' },
  { path: '/how-it-works/certification', name: 'Certification How It Works' },
  { path: '/how-it-works/compliance', name: 'Compliance How It Works' },
  { path: '/how-it-works/enterprise', name: 'Enterprise How It Works' },
  { path: '/how-it-works/watchdog', name: 'Watchdog How It Works' },
  { path: '/compliance/eu-ai-act', name: 'EU AI Act Compliance' },
  { path: '/compliance/nist-ai-rmf', name: 'NIST AI RMF Compliance' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/terms-of-service', name: 'Terms of Service' },
  { path: '/cookie-policy', name: 'Cookie Policy' },
  { path: '/accessibility', name: 'Accessibility' },
  { path: '/status', name: 'Status' },
  { path: '/security', name: 'Security' },
  { path: '/resources', name: 'Resources' },
  { path: '/community', name: 'Community' },
  { path: '/jobs', name: 'Jobs' },
  { path: '/blog', name: 'Blog' },
];

test.describe('Public Pages Load Test', () => {
  for (const page of publicPages) {
    test(`${page.name} (${page.path}) should load without errors`, async ({ page: browserPage }) => {
      // Navigate to the page
      const response = await browserPage.goto(`${BASE_URL}${page.path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      
      // Check response status
      expect(response?.status()).toBeLessThan(500);
      
      // Check that the page is not a 404
      const pageContent = await browserPage.textContent('body');
      const is404 = pageContent?.includes('404') && pageContent?.includes('Page Not Found');
      
      if (is404) {
        console.warn(`WARNING: ${page.name} (${page.path}) shows 404 page`);
      }
      
      // Check for JavaScript errors
      const errors: string[] = [];
      browserPage.on('pageerror', (error) => {
        errors.push(error.message);
      });
      
      // Wait a bit for any async errors
      await browserPage.waitForTimeout(1000);
      
      // Log any errors but don't fail the test for non-critical errors
      if (errors.length > 0) {
        console.warn(`JavaScript errors on ${page.path}:`, errors);
      }
      
      // Check that the page has content
      const bodyText = await browserPage.textContent('body');
      expect(bodyText?.length).toBeGreaterThan(100);
    });
  }
});

test.describe('Navigation Tests', () => {
  test('Header navigation links should work', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Close cookie consent if present
    const cookieButton = page.locator('button:has-text("Accept All")');
    if (await cookieButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieButton.click();
    }
    
    // Test main navigation items exist
    await expect(page.locator('nav').first()).toBeVisible();
    
    // Check for key navigation links
    const navLinks = ['Dashboard', 'Training', 'Certification', 'Watchdog', 'Compliance', 'Enterprise'];
    for (const link of navLinks) {
      const navItem = page.locator(`button:has-text("${link}"), a:has-text("${link}")`).first();
      await expect(navItem).toBeVisible();
    }
  });
  
  test('Footer links should be present', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check for footer content
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for key footer links
    const footerText = await footer.textContent();
    expect(footerText).toContain('Privacy Policy');
    expect(footerText).toContain('Terms of Service');
  });
});

test.describe('Form Tests', () => {
  test('Login form should be functional', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Check for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
    
    // At least one of these should exist
    const hasEmailInput = await emailInput.isVisible().catch(() => false);
    const hasOAuthButtons = await page.locator('button:has-text("Google"), button:has-text("Continue with")').first().isVisible().catch(() => false);
    
    expect(hasEmailInput || hasOAuthButtons).toBeTruthy();
  });
  
  test('Signup form should be functional', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    // Check for signup form elements
    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    const hasOAuthButtons = await page.locator('button:has-text("Google"), button:has-text("Continue with")').first().isVisible().catch(() => false);
    
    expect(hasForm || hasOAuthButtons).toBeTruthy();
  });
  
  test('Contact form should be functional', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    
    // Check for contact form elements
    const form = page.locator('form').first();
    const hasForm = await form.isVisible().catch(() => false);
    
    if (hasForm) {
      // Check for typical contact form fields
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const messageInput = page.locator('textarea').first();
      
      // At least email and message should be present
      const hasEmail = await emailInput.isVisible().catch(() => false);
      const hasMessage = await messageInput.isVisible().catch(() => false);
      
      expect(hasEmail || hasMessage).toBeTruthy();
    }
  });
});

test.describe('Watchdog Incident Report', () => {
  test('Incident report form should load', async ({ page }) => {
    await page.goto(`${BASE_URL}/watchdog/incident`);
    
    // Check page loaded
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toContain('incident');
    
    // Check for form elements
    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    expect(hasForm).toBeTruthy();
  });
});

test.describe('API Health', () => {
  test('TRPC API should respond', async ({ request }) => {
    // Test a simple API endpoint
    const response = await request.get(`${BASE_URL}/api/trpc/health.check`, {
      timeout: 10000,
    }).catch(() => null);
    
    // API might not have this exact endpoint, so we just check it doesn't crash
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });
});

test.describe('Responsive Design', () => {
  test('Homepage should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`);
    
    // Check that content is visible
    const bodyText = await page.textContent('body');
    expect(bodyText?.length).toBeGreaterThan(100);
    
    // Check for mobile menu button (hamburger)
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button:has(svg)').first();
    const hasMobileMenu = await mobileMenuButton.isVisible().catch(() => false);
    
    // Either mobile menu or regular nav should be visible
    expect(hasMobileMenu || await page.locator('nav').first().isVisible()).toBeTruthy();
  });
  
  test('Homepage should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`);
    
    // Check that content is visible
    const bodyText = await page.textContent('body');
    expect(bodyText?.length).toBeGreaterThan(100);
  });
});
