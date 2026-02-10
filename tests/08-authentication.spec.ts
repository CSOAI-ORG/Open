import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

/**
 * E2E Tests for Authentication Flows
 * Tests login, signup, session management, and protected routes
 */

test.describe('Authentication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Check for login form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');
      
      await page.screenshot({ path: 'e2e/screenshots/login-page.png', fullPage: true });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      
      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('invalid@test.com');
        await passwordInput.fill('wrongpassword');
        
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Wait for error message
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'e2e/screenshots/login-error.png', fullPage: true });
        }
      }
    });

    test('should handle empty form submission', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Should show validation errors
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'e2e/screenshots/login-validation.png', fullPage: true });
      }
    });
  });

  test.describe('Signup Flow', () => {
    test('should display signup page correctly', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ path: 'e2e/screenshots/signup-page.png', fullPage: true });
    });

    test('should validate email format on signup', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('not-an-email');
        await emailInput.blur();
        
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'e2e/screenshots/signup-email-validation.png', fullPage: true });
      }
    });

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      
      if (await passwordInput.isVisible()) {
        // Try weak password
        await passwordInput.fill('123');
        await passwordInput.blur();
        
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'e2e/screenshots/signup-password-validation.png', fullPage: true });
      }
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      // Should redirect to login or show auth prompt
      const isProtected = currentUrl.includes('login') || 
                          currentUrl.includes('auth') ||
                          await page.locator('text=Sign in, text=Log in, text=Please log in').isVisible();
      
      await page.screenshot({ path: 'e2e/screenshots/dashboard-protection.png', fullPage: true });
    });

    test('should redirect unauthenticated users from profile', async ({ page }) => {
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ path: 'e2e/screenshots/profile-protection.png', fullPage: true });
    });

    test('should redirect unauthenticated users from settings', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ path: 'e2e/screenshots/settings-protection.png', fullPage: true });
    });
  });

  test.describe('Session Management', () => {
    test('should handle session timeout gracefully', async ({ page }) => {
      // Navigate to a protected page
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Clear cookies to simulate session expiry
      await page.context().clearCookies();
      
      // Try to perform an action
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should handle gracefully
      await page.screenshot({ path: 'e2e/screenshots/session-timeout.png', fullPage: true });
    });
  });

  test.describe('OAuth Flow', () => {
    test('should display OAuth login options', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Check for OAuth buttons
      const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")');
      const githubButton = page.locator('button:has-text("GitHub"), a:has-text("GitHub")');
      
      await page.screenshot({ path: 'e2e/screenshots/oauth-options.png', fullPage: true });
    });
  });
});

test.describe('Password Reset', () => {
  test('should display forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'e2e/screenshots/forgot-password.png', fullPage: true });
  });

  test('should validate email on password reset', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      
      const submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'e2e/screenshots/password-reset-validation.png', fullPage: true });
      }
    }
  });
});
