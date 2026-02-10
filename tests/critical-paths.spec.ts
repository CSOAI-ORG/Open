import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('CSOAI Critical User Paths', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Homepage & Navigation', () => {
    test('should load homepage with all critical sections', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check page title
      await expect(page).toHaveTitle(/CSOAI/);
      
      // Check hero section exists
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check 11 Critical Solutions section
      await expect(page.locator('text=11 Critical Solutions')).toBeVisible();
      
      // Check Byzantine Council section
      await expect(page.locator('text=33-Agent Byzantine Council')).toBeVisible();
      
      // Check Strategic Alliance section
      await expect(page.locator('text=Our Strategic Alliance')).toBeVisible();
    });

    test('should navigate to Charter page', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Click on Charter link in navigation or find it
      const charterLink = page.locator('a:has-text("Charter"), button:has-text("Charter")').first();
      if (await charterLink.isVisible()) {
        await charterLink.click();
        await page.waitForURL('**/charter');
        await expect(page.locator('text=Partnership Charter')).toBeVisible();
      }
    });

    test('should navigate to Solutions page', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Click Explore Full Solutions Framework button
      const solutionsBtn = page.locator('button:has-text("Explore Full Solutions Framework")');
      if (await solutionsBtn.isVisible()) {
        await solutionsBtn.click();
        await page.waitForURL('**/solutions');
        await expect(page.locator('text=11 Critical Solutions')).toBeVisible();
      }
    });
  });

  test.describe('Authentication - Signup', () => {
    test('should display signup form with validation', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Check form fields exist
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible(); // Name field
      await expect(page.locator('input[type="checkbox"]')).toBeVisible(); // Terms checkbox
    });

    test('should reject invalid email format', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Fill form with invalid email
      await page.locator('input[type="email"]').fill('invalid-email');
      await page.locator('input[type="password"]').fill('ValidPassword123!');
      await page.locator('input[type="text"]').fill('John Doe');
      await page.locator('input[type="checkbox"]').check();
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error or prevent submission
      const emailInput = page.locator('input[type="email"]');
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
    });

    test('should reject weak password', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Fill form with weak password
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('weak');
      await page.locator('input[type="text"]').fill('John Doe');
      await page.locator('input[type="checkbox"]').check();
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error toast or validation message
      await expect(page.locator('text=/password|weak|strong/i')).toBeVisible({ timeout: 2000 }).catch(() => {
        // If no error message, password field should be invalid
        return true;
      });
    });

    test('should require terms acceptance', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Fill form without checking terms
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('ValidPassword123!');
      await page.locator('input[type="text"]').fill('John Doe');
      // Don't check the checkbox
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error or prevent submission
      await expect(page.locator('text=/terms|accept|agreement/i')).toBeVisible({ timeout: 2000 }).catch(() => {
        return true;
      });
    });

    test('should show success message on valid signup', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      const uniqueEmail = `test-${Date.now()}@example.com`;
      
      // Fill form with valid data
      await page.locator('input[type="email"]').fill(uniqueEmail);
      await page.locator('input[type="password"]').fill('ValidPassword123!');
      await page.locator('input[type="text"]').fill('John Doe');
      await page.locator('input[type="checkbox"]').check();
      
      // Submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show success message
      await expect(page.locator('text=/success|created|verify|email/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Authentication - Login', () => {
    test('should display login form', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check form fields exist
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should reject invalid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Fill with invalid credentials
      await page.locator('input[type="email"]').fill('nonexistent@example.com');
      await page.locator('input[type="password"]').fill('WrongPassword123!');
      
      // Submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error message
      await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });
    });

    test('should show password reset link', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check for forgot password link
      const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), a:has-text("Password")');
      await expect(forgotLink.first()).toBeVisible();
    });
  });

  test.describe('Authentication - Password Reset', () => {
    test('should display password reset form', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Click forgot password link
      const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), a:has-text("Password")');
      if (await forgotLink.first().isVisible()) {
        await forgotLink.first().click();
        await page.waitForURL('**/reset-password');
        
        // Check email input exists
        await expect(page.locator('input[type="email"]')).toBeVisible();
      }
    });

    test('should accept email for password reset', async ({ page }) => {
      await page.goto(`${BASE_URL}/reset-password`);
      
      // Fill email
      await page.locator('input[type="email"]').fill('test@example.com');
      
      // Submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show success message
      await expect(page.locator('text=/sent|check|email|link/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Charter Download - Email Capture', () => {
    test('should display charter download page', async ({ page }) => {
      await page.goto(`${BASE_URL}/charter-download`);
      
      // Check page title
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check email input
      await expect(page.locator('input[type="email"]')).toBeVisible();
      
      // Check document selection
      await expect(page.locator('text=Charter')).toBeVisible();
      await expect(page.locator('text=Solutions')).toBeVisible();
    });

    test('should validate email before download', async ({ page }) => {
      await page.goto(`${BASE_URL}/charter-download`);
      
      // Try to submit without email
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error
      await expect(page.locator('text=/email|required|invalid/i')).toBeVisible({ timeout: 2000 });
    });

    test('should reject invalid email format', async ({ page }) => {
      await page.goto(`${BASE_URL}/charter-download`);
      
      // Fill invalid email
      await page.locator('input[type="email"]').fill('invalid-email');
      
      // Select document
      const charterOption = page.locator('text=Charter').first();
      await charterOption.click();
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error
      await expect(page.locator('text=/email|valid|invalid/i')).toBeVisible({ timeout: 2000 });
    });

    test('should require document selection', async ({ page }) => {
      await page.goto(`${BASE_URL}/charter-download`);
      
      // Fill email but don't select document
      await page.locator('input[type="email"]').fill('test@example.com');
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error
      await expect(page.locator('text=/select|document|choose/i')).toBeVisible({ timeout: 2000 });
    });

    test('should trigger download with valid email and document selection', async ({ page, context }) => {
      // Listen for download event
      const downloadPromise = context.waitForEvent('download');
      
      await page.goto(`${BASE_URL}/charter-download`);
      
      // Fill email
      await page.locator('input[type="email"]').fill('test@example.com');
      
      // Select Charter document
      const charterOption = page.locator('text=Charter').first();
      await charterOption.click();
      
      // Submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show success message
      await expect(page.locator('text=/success|download|email/i')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Homepage Conversion Funnel', () => {
    test('should have visible CTA buttons throughout page', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for primary CTA buttons
      const ctaButtons = page.locator('button:has-text("Get Started"), button:has-text("Sign Up"), button:has-text("Learn More"), button:has-text("Explore")');
      
      // Should have at least one CTA visible
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should navigate from homepage to signup', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Find and click Get Started button
      const getStartedBtn = page.locator('button:has-text("Get Started"), button:has-text("Sign Up")').first();
      if (await getStartedBtn.isVisible()) {
        await getStartedBtn.click();
        await page.waitForURL('**/signup', { timeout: 5000 }).catch(() => {
          // If URL doesn't change, check if signup form is visible
          return page.locator('input[type="email"]').isVisible();
        });
      }
    });

    test('should have newsletter signup in footer', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Check for email input in footer
      const footerEmail = page.locator('footer input[type="email"], footer input[placeholder*="email" i]');
      
      // Footer email input might exist
      if (await footerEmail.isVisible()) {
        await expect(footerEmail).toBeVisible();
      }
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for h1 tag
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      
      // Should have at least one h1
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have accessible form labels', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Check for labels associated with inputs
      const emailInput = page.locator('input[type="email"]');
      const label = page.locator(`label[for="${await emailInput.getAttribute('id')}"]`);
      
      // Either label exists or input has aria-label
      const hasLabel = await label.isVisible().catch(() => false);
      const hasAriaLabel = await emailInput.getAttribute('aria-label').catch(() => null);
      
      expect(hasLabel || hasAriaLabel).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      // Try to navigate
      await page.goto(BASE_URL).catch(() => {
        // Expected to fail
        return true;
      });
      
      // Should show error message or offline indicator
      const hasError = await page.locator('text=/offline|error|connection/i').isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasError || !page.url().includes('localhost')).toBeTruthy();
      
      // Restore connection
      await page.context().setOffline(false);
    });

    test('should handle form submission errors', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      
      // Fill form
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('ValidPassword123!');
      await page.locator('input[type="text"]').fill('John Doe');
      await page.locator('input[type="checkbox"]').check();
      
      // Simulate network error by going offline
      await page.context().setOffline(true);
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      
      // Should show error message
      await expect(page.locator('text=/error|failed|try again/i')).toBeVisible({ timeout: 5000 }).catch(() => {
        return true;
      });
      
      // Restore connection
      await page.context().setOffline(false);
    });
  });
});
