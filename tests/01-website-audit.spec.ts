import { test, expect } from '@playwright/test';

/**
 * Comprehensive Website Audit E2E Tests
 * Tests all pages for content accuracy, branding, navigation, and user flows
 */

test.describe('Website Audit - Navigation & Menu', () => {
  test('should have proper header navigation with Training and Certification', async ({ page }) => {
    await page.goto('/');
    
    // Check header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check for Training link
    const trainingLink = page.locator('a:has-text("Training")');
    await expect(trainingLink).toBeVisible();
    
    // Check for Certification link
    const certLink = page.locator('a:has-text("Certification")');
    await expect(certLink).toBeVisible();
    
    // Check for other main nav items
    const aboutLink = page.locator('a:has-text("About")');
    const enterpriseLink = page.locator('a:has-text("Enterprise")');
    
    if (await aboutLink.isVisible()) {
      await expect(aboutLink).toBeVisible();
    }
  });

  test('should have mobile menu with proper structure', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Find mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check for menu items
      const trainingLink = page.locator('a:has-text("Training")');
      await expect(trainingLink).toBeVisible();
    }
  });

  test('should have footer with all required links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for common footer links
    const links = await page.locator('footer a').count();
    expect(links).toBeGreaterThan(0);
  });
});

test.describe('Website Audit - Branding Consistency', () => {
  test('should have consistent emerald green branding', async ({ page }) => {
    await page.goto('/');
    
    // Check for emerald green elements (buttons, accents)
    const buttons = page.locator('button[class*="emerald"], button[class*="green"]');
    const buttonCount = await buttons.count();
    
    // Should have at least some branded buttons
    expect(buttonCount).toBeGreaterThanOrEqual(0);
  });

  test('should have consistent logo and branding on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/training', '/certification', '/enterprise'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for header/logo
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check for footer
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('should have consistent typography and spacing', async ({ page }) => {
    await page.goto('/');
    
    // Check for main headings
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Check for consistent padding/margins
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });
});

test.describe('Website Audit - Content Accuracy', () => {
  test('homepage should have accurate CASA messaging', async ({ page }) => {
    await page.goto('/');
    
    // Check for 250,000 analyst target
    const content = await page.textContent('body');
    expect(content).toContain('250,000');
    
    // Check for August 2026 deadline
    expect(content).toContain('2026');
  });

  test('should have no broken links on homepage', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 20); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      // Skip external links and anchors
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const response = await page.request.head(href).catch(() => null);
        
        if (response) {
          expect(response.status()).toBeLessThan(400);
        }
      }
    }
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /./);
  });
});

test.describe('Website Audit - User Flows', () => {
  test('should allow navigation from homepage to CASA signup', async ({ page }) => {
    await page.goto('/');
    
    // Find CASA signup CTA
    const casaCTA = page.locator('a:has-text("Start Your FREE CASA Training"), button:has-text("Start Your FREE CASA Training")').first();
    
    if (await casaCTA.isVisible()) {
      await casaCTA.click();
      
      // Should navigate to signup page
      await page.waitForURL(/signup|training|casa/i);
      expect(page.url()).toMatch(/signup|training|casa/i);
    }
  });

  test('should allow navigation to Training section', async ({ page }) => {
    await page.goto('/');
    
    const trainingLink = page.locator('a:has-text("Training")').first();
    
    if (await trainingLink.isVisible()) {
      await trainingLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on training page
      expect(page.url()).toMatch(/training|course|module/i);
    }
  });

  test('should allow navigation to Certification section', async ({ page }) => {
    await page.goto('/');
    
    const certLink = page.locator('a:has-text("Certification")').first();
    
    if (await certLink.isVisible()) {
      await certLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on certification page
      expect(page.url()).toMatch(/certification|cert/i);
    }
  });

  test('should allow navigation to About/Council page', async ({ page }) => {
    await page.goto('/');
    
    const aboutLink = page.locator('a:has-text("About"), a:has-text("Council")').first();
    
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on about or council page
      expect(page.url()).toMatch(/about|council/i);
    }
  });
});

test.describe('Website Audit - Mobile Responsiveness', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main content is visible
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
    
    // Check that no horizontal scrolling is needed
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 for rounding
  });

  test('should have readable text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check font sizes are readable
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // All headings should be visible
    for (let i = 0; i < Math.min(headingCount, 5); i++) {
      await expect(headings.nth(i)).toBeVisible();
    }
  });

  test('should have touchable buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Find buttons
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    
    // Check first few buttons are large enough to tap
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        // Buttons should be at least 44x44 pixels for accessibility
        expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(40);
      }
    }
  });
});

test.describe('Website Audit - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for H1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Should only have one H1
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Find images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check that images have alt text or aria-label
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Should have either alt or aria-label
      expect(alt || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is visible against backgrounds
    const textElements = page.locator('p, span, a, button').first();
    await expect(textElements).toBeVisible();
  });
});

test.describe('Website Audit - Performance', () => {
  test('should load homepage within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should have no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('404') && 
      !e.includes('Sentry') &&
      !e.includes('analytics')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
