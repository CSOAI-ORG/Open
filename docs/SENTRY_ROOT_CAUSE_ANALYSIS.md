## COAI Dashboard - 18 Critical Errors (Jan 15-25, 2026)

---

## Executive Summary

**18 critical Sentry errors** were identified and fixed across two primary categories:
1. **Authentication & Session Management** (6 errors) - Session expiration and auth flow issues
2. **Database Operations** (5 errors) - Null safety and connection pool issues
3. **Type Safety & Data Conversion** (4 errors) - Date/Decimal/Property access errors
4. **Business Logic** (3 errors) - Enrollment and payment validation

All errors have been **permanently fixed** with architectural improvements to prevent recurrence.

---

## Part 1: Authentication & Session Errors (6 Errors)

### Error Group: "Please login (10001)" - COAI-DASHBOARD-C/2/3/B/4

**Affected Issues:**
- COAI-DASHBOARD-C (Jan 5)
- COAI-DASHBOARD-2 (Jan 4)
- COAI-DASHBOARD-3 (Jan 4)
- COAI-DASHBOARD-B (Jan 4)
- COAI-DASHBOARD-4 (Jan 4)

**Root Cause Analysis:**

The error code `10001` indicates an **authentication failure** in the tRPC middleware. This occurs when:

1. **Session Cookie Expired**: User's JWT session cookie has expired (default: 24 hours)
2. **Missing OAuth Token**: OAuth callback didn't properly store the session
3. **Cookie Not Sent**: Browser not sending credentials with cross-origin requests
4. **Invalid Session Payload**: Corrupted or tampered session data

**Root Cause Location:**
```typescript
// server/_core/context.ts
export async function createContext(opts: CreateContextOptions) {
  const sessionCookie = opts.req.cookies.get('session');
  
  if (!sessionCookie) {
    // ❌ PROBLEM: Returns null without proper error handling
    return { user: null };
  }
  
  try {
    const payload = await verifySessionJWT(sessionCookie.value);
    return { user: payload };
  } catch (error) {
    // ❌ PROBLEM: Silent failure - no error thrown
    return { user: null };
  }
}

// server/_core/trpc.ts
export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    // ❌ PROBLEM: Generic error message, no session refresh attempt
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please login (10001)',
    });
  }
  return next({ ctx });
});
```

**Permanent Fix Implemented:**

```typescript
// ✅ FIXED: server/_core/context.ts
export async function createContext(opts: CreateContextOptions) {
  const sessionCookie = opts.req.cookies.get('session');
  
  if (!sessionCookie) {
    console.warn('[Auth] No session cookie found');
    return { user: null, sessionExpired: true };
  }
  
  try {
    const payload = await verifySessionJWT(sessionCookie.value);
    
    // ✅ NEW: Refresh token if expiring soon (within 1 hour)
    const expiresIn = payload.exp * 1000 - Date.now();
    if (expiresIn < 3600000) {
      const newToken = await generateSessionJWT(payload);
      opts.res.cookie('session', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400000, // 24 hours
      });
    }
    
    return { user: payload, sessionExpired: false };
  } catch (error) {
    console.error('[Auth] Session verification failed:', error);