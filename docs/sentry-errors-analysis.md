# Sentry Error Analysis - Jan 5, 2026

## Error 1: COAI-DASHBOARD-B - TRPCClientError: Please login (10001)

**URL**: https://csoai.org/courses?filter=free
**Transaction**: /courses
**Browser**: Chrome Mobile 143.0.0 on Android 10

**Root Cause**: 
The `enrollInCourse` mutation in `server/courses.ts` is a `protectedProcedure`, which requires authentication. When an unauthenticated user clicks "Enroll Now" on the Courses page, the mutation fails with "Please login (10001)".

**Fix Required**:
- The frontend should check if the user is logged in before allowing enrollment
- If not logged in, redirect to login page or show a login prompt
- The error should be caught gracefully and not reported to Sentry as a critical error

## Error 2: COAI-DASHBOARD-A - TRPCClientError: Payment plan not available for this course

**URL**: https://csoai.org/courses
**Transaction**: /courses
**Browser**: Chrome Mobile 143.0.0 on Android 10

**Root Cause**:
In `server/courses.ts` line 272-274, when a user tries to enroll in a paid course, the code looks up the Stripe price ID based on the selected payment type. If the course doesn't have a Stripe price ID configured for that payment plan, it throws this error.

```javascript
if (!stripePriceId) {
  console.error('[enrollInCourse] Missing Stripe price ID:', { courseId: course.id, paymentType: input.paymentType });
  throw new Error(`Payment plan not available for this course. Please contact support.`);
}
```

**Fix Required**:
1. Check if courses have Stripe price IDs configured before displaying payment options
2. Only show payment plans that are actually available for each course
3. Add better error handling on the frontend to show a user-friendly message

## Implementation Plan

1. **Frontend Fix for Auth Check**:
   - Add authentication check in `CourseCard` component before calling `enrollMutation`
   - Show login modal or redirect to login if user is not authenticated

2. **Frontend Fix for Payment Plans**:
   - Filter payment plan options based on which Stripe price IDs are available
   - Disable or hide payment plans that don't have configured prices

3. **Backend Enhancement**:
   - Return available payment plans in the course catalog response
   - Add validation to prevent showing unavailable plans
