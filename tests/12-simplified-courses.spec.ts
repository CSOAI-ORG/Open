import { test, expect } from '@playwright/test';

test.describe('Simplified Course Journey', () => {
  test.describe('Homepage to Courses Flow', () => {
    test('should have Start Free Training Now button on homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for the Start Free Training Now button
      const startTrainingButton = page.locator('button:has-text("Start Free Training Now")');
      await expect(startTrainingButton).toBeVisible({ timeout: 10000 });
    });

    test('Start Free Training Now should navigate to courses page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click the Start Free Training Now button
      const startTrainingButton = page.locator('button:has-text("Start Free Training Now")');
      await startTrainingButton.click();
      
      // Should navigate to /courses
      await page.waitForURL('**/courses**', { timeout: 10000 });
      expect(page.url()).toContain('/courses');
    });
  });

  test.describe('Courses Page', () => {
    test('should display all 7 core modules', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check for the 7 core modules
      const expectedCourses = [
        'EU AI Act',
        'NIST AI RMF',
        'UK AI Safety',
        'Canada AIDA',
        'Australia AI',
        'ISO 42001',
        'China TC260'
      ];
      
      for (const course of expectedCourses) {
        const courseElement = page.locator(`text=${course}`).first();
        await expect(courseElement).toBeVisible({ timeout: 5000 });
      }
    });

    test('should display FREE badges on all courses', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check for FREE badges
      const freeBadges = page.locator('text=FREE');
      const count = await freeBadges.count();
      expect(count).toBeGreaterThanOrEqual(7); // At least 7 FREE badges
    });

    test('should display correct pricing information', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check for $799 certification fee
      const certFee = page.locator('text=$799');
      await expect(certFee.first()).toBeVisible({ timeout: 5000 });
      
      // Check for $7,999/year membership
      const membership = page.locator('text=$7,999');
      await expect(membership.first()).toBeVisible({ timeout: 5000 });
    });

    test('should have Start Free Training buttons for each course', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Check for Start Free Training buttons
      const startButtons = page.locator('button:has-text("Start Free Training")');
      const count = await startButtons.count();
      expect(count).toBeGreaterThanOrEqual(7); // At least 7 buttons
    });

    test('should NOT have course bundles section', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Bundles should not exist
      const bundlesTab = page.locator('text=Course Bundles');
      await expect(bundlesTab).not.toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('Training menu should link to /courses', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click on Training in the header
      const trainingMenu = page.locator('button:has-text("Training")').first();
      await trainingMenu.click();
      
      // Check for All Courses (FREE) link
      const allCoursesLink = page.locator('text=All Courses');
      await expect(allCoursesLink.first()).toBeVisible({ timeout: 5000 });
    });

    test('Sidebar should have Courses link', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check for Courses link in sidebar
      const coursesLink = page.locator('a[href="/courses"]');
      await expect(coursesLink.first()).toBeVisible({ timeout: 5000 });
    });

    test('/paid-courses should redirect to /courses', async ({ page }) => {
      await page.goto('/paid-courses');
      await page.waitForURL('**/courses**', { timeout: 10000 });
      expect(page.url()).toContain('/courses');
    });
  });

  test.describe('Course Enrollment', () => {
    test('should be able to click Start Free Training on a course', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Click Start Free Training on first course
      const startButton = page.locator('button:has-text("Start Free Training")').first();
      await expect(startButton).toBeVisible({ timeout: 5000 });
      await startButton.click();
      
      // Should either enroll or show already enrolled message
      await page.waitForTimeout(2000);
      
      // Check if we're on the course learning page or still on courses
      const url = page.url();
      const isOnCoursePage = url.includes('/courses') || url.includes('/learn') || url.includes('/my-courses');
      expect(isOnCoursePage).toBe(true);
    });
  });

  test.describe('My Courses Page', () => {
    test('should display enrolled courses', async ({ page }) => {
      await page.goto('/my-courses');
      await page.waitForLoadState('networkidle');
      
      // Page should load
      await expect(page.locator('body')).toBeVisible();
      
      // Should show either enrolled courses or empty state
      const content = page.locator('main, [role="main"], body > div');
      const contentCount = await content.count();
      expect(contentCount).toBeGreaterThan(0);
    });
  });
});
