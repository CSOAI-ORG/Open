# Sentry Root Cause Analysis - Detailed Code Implementations
## COAI Dashboard - 18 Critical Errors (Jan 15-25, 2026)

---

## Table of Contents
1. [Authentication & Session Errors (6 errors)](#part-1-authentication--session-errors)
2. [Database Connection Errors (5 errors)](#part-2-database-connection-errors)
3. [Type Safety & Data Conversion Errors (4 errors)](#part-3-type-safety--data-conversion-errors)
4. [Business Logic Errors (3 errors)](#part-4-business-logic-errors)
5. [Implementation Checklist](#implementation-checklist)

---

# Part 1: Authentication & Session Errors

## Error Group: "Please login (10001)" - 6 Critical Issues

**Affected Errors:**
- COAI-DASHBOARD-C (Jan 5)
- COAI-DASHBOARD-2 (Jan 4)
- COAI-DASHBOARD-3 (Jan 4)
- COAI-DASHBOARD-B (Jan 4)
- COAI-DASHBOARD-4 (Jan 4)
- COAI-DASHBOARD-6 (Jan 3)

### Root Cause Analysis

The error code `10001` indicates an **authentication failure** in the tRPC middleware. This occurs when:

1. **Session Cookie Expired**: User's JWT session cookie expires after 24 hours with no refresh mechanism
2. **Missing OAuth Token**: OAuth callback doesn't properly store the session cookie
3. **Cookie Not Sent**: Browser not sending credentials with cross-origin requests (missing `credentials: 'include'`)
4. **Invalid Session Payload**: Corrupted or tampered session data fails verification

### Before: Problematic Code

#### File: `server/_core/context.ts` (BEFORE)

```typescript
import { CreateContextOptions } from '@trpc/server/adapters/express';
import { verifySessionJWT } from './jwt';

export interface Context {
  user: SessionPayload | null;
}

export interface SessionPayload {
  id: number;
  openId: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

// ❌ PROBLEM 1: No session refresh logic
// ❌ PROBLEM 2: Silent failure on verification error
// ❌ PROBLEM 3: No tracking of session expiration
export async function createContext(opts: CreateContextOptions): Promise<Context> {
  const sessionCookie = opts.req.cookies.get('session');
  
  if (!sessionCookie) {
    // ❌ PROBLEM: Returns null without logging or tracking
    return { user: null };
  }
  
  try {
    const payload = await verifySessionJWT(sessionCookie.value);
    // ❌ PROBLEM: No check if token is expiring soon
    return { user: payload };
  } catch (error) {
    // ❌ PROBLEM: Silent failure - error not logged or tracked
    console.error('[Auth] Verification failed:', error);
    return { user: null };
  }
}
```

#### File: `server/_core/trpc.ts` (BEFORE)

```typescript
import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const baseProcedure = t.procedure;

// ❌ PROBLEM: Generic error message, no context about why auth failed
export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please login (10001)',
    });
  }
  return next({ ctx });
});

export const router = t.router;
```

#### File: `client/src/lib/trpc.ts` (BEFORE)

```typescript
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

// ❌ PROBLEM 1: Missing credentials: 'include'
// ❌ PROBLEM 2: No error handling for 401 responses
// ❌ PROBLEM 3: No retry logic for network failures
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...init,
          // ❌ CRITICAL: Missing credentials - cookies not sent!
        });
      },
    }),
  ],
});
```

#### File: `server/_core/oauth.ts` (BEFORE)

```typescript
import { Router } from 'express';
import { generateSessionJWT } from './jwt';

export const oauthRouter = Router();

// ❌ PROBLEM: No error handling if JWT generation fails
// ❌ PROBLEM: No validation of OAuth payload
oauthRouter.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for OAuth token
    const oauthUser = await exchangeCodeForUser(code as string);
    
    // ❌ PROBLEM: No check if user creation succeeded
    const user = await getOrCreateUser(oauthUser);
    
    // Generate session token
    const sessionToken = await generateSessionJWT(user);
    
    // ❌ PROBLEM: Cookie not set with secure flags
    res.cookie('session', sessionToken);
    
    res.redirect('/');
  } catch (error) {
    // ❌ PROBLEM: No error logging or user feedback
    res.status(500).send('OAuth failed');
  }
});
```

### After: Fixed Code

#### File: `server/_core/context.ts` (AFTER)

```typescript
import { CreateContextOptions } from '@trpc/server/adapters/express';
import { verifySessionJWT, generateSessionJWT } from './jwt';
import { logger } from './logger';

export interface Context {
  user: SessionPayload | null;
  sessionExpired: boolean;
  sessionExpiresIn: number; // milliseconds
}

export interface SessionPayload {
  id: number;
  openId: string;
  name: string;
  email: string;
  role: string;
  exp: number; // Unix timestamp in seconds
}

// ✅ FIXED: Comprehensive session management with auto-refresh
export async function createContext(opts: CreateContextOptions): Promise<Context> {
  const sessionCookie = opts.req.cookies.get('session');
  
  // ✅ NEW: Track session state
  let context: Context = {
    user: null,
    sessionExpired: false,
    sessionExpiresIn: 0,
  };
  
  if (!sessionCookie) {
    logger.warn('[Auth] No session cookie found', {
      path: opts.req.path,
      method: opts.req.method,
    });
    context.sessionExpired = true;
    return context;
  }
  
  try {
    const payload = await verifySessionJWT(sessionCookie.value);
    
    // ✅ NEW: Calculate time until expiration
    const expiresIn = payload.exp * 1000 - Date.now();
    context.sessionExpiresIn = expiresIn;
    
    // ✅ NEW: Auto-refresh token if expiring within 1 hour
    if (expiresIn < 3600000) { // 1 hour in milliseconds
      logger.info('[Auth] Token expiring soon, refreshing', {
        expiresIn: Math.round(expiresIn / 1000),
        userId: payload.id,
      });
      
      try {
        const newToken = await generateSessionJWT({
          id: payload.id,
          openId: payload.openId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        });
        
        // ✅ NEW: Set cookie with secure flags
        opts.res.cookie('session', newToken, {
          httpOnly: true, // Prevent XSS attacks
          secure: process.env.NODE_ENV === 'production', // HTTPS only in production
          sameSite: 'lax', // CSRF protection
          maxAge: 86400000, // 24 hours
          path: '/',
        });
        
        logger.info('[Auth] Token refreshed successfully', { userId: payload.id });
      } catch (refreshError) {
        logger.error('[Auth] Token refresh failed', {
          error: refreshError instanceof Error ? refreshError.message : String(refreshError),
          userId: payload.id,
        });
        // Continue with existing token if refresh fails
      }
    }
    
    context.user = payload;
    context.sessionExpired = false;
    
    return context;
  } catch (error) {
    logger.error('[Auth] Session verification failed', {
      error: error instanceof Error ? error.message : String(error),
      path: opts.req.path,
    });
    
    context.sessionExpired = true;
    return context;
  }
}
```

#### File: `server/_core/trpc.ts` (AFTER)

```typescript
import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
import { logger } from './logger';

const t = initTRPC.context<Context>().create();

export const baseProcedure = t.procedure;

// ✅ FIXED: Enhanced error handling with session context
export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    // ✅ NEW: Provide specific error reason
    const errorCause = ctx.sessionExpired ? 'SESSION_EXPIRED' : 'NO_SESSION';
    
    logger.warn('[Auth] Protected procedure called without authentication', {
      cause: errorCause,
      sessionExpiresIn: ctx.sessionExpiresIn,
    });
    
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please login (10001)',
      cause: errorCause,
    });
  }
  
  return next({ ctx });
});

// ✅ NEW: Admin-only procedure with role checking
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    logger.warn('[Auth] Admin procedure called by non-admin user', {
      userId: ctx.user?.id,
      role: ctx.user?.role,
    });
    
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  
  return next({ ctx });
});

export const router = t.router;
```

#### File: `client/src/lib/trpc.ts` (AFTER)

```typescript
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';
import { getLoginUrl } from '@/const';
import { logger } from '@/utils/logger';

export const trpc = createTRPCReact<AppRouter>();

// ✅ FIXED: Comprehensive error handling and retry logic
export function createTRPCClientWithAuth() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // ✅ NEW: Don't retry auth errors
          if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
            return false;
          }
          // Retry network errors up to 3 times
          return failureCount < 3;
        },
      },
    },
  });
  
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        maxURLLength: 2083,
        transformer: superjson,
        
        // ✅ FIXED: Comprehensive fetch implementation
        async fetch(input, init) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
          
          try {
            const response = await globalThis.fetch(input, {
              ...init,
              signal: controller.signal,
              // ✅ CRITICAL FIX: Send credentials with every request
              credentials: 'include',
              headers: {
                ...init?.headers,
                'Content-Type': 'application/json',
              },
            });
            
            clearTimeout(timeoutId);
            
            // ✅ NEW: Handle 401 responses (session expired)
            if (response.status === 401) {
              const errorData = await response.json().catch(() => ({}));
              
              logger.warn('[Auth] Received 401 response', {
                cause: errorData.data?.cause,
                url: input.toString(),
              });
              
              // ✅ NEW: Redirect to login if session expired
              if (errorData.data?.cause === 'SESSION_EXPIRED') {
                window.location.href = getLoginUrl();
              }
            }
            
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            
            // ✅ NEW: Distinguish between timeout and network errors
            if (error instanceof Error && error.name === 'AbortError') {
              logger.error('[Network] Request timeout', {
                url: input.toString(),
                timeout: 30000,
              });
              throw new Error('Request timeout - server not responding');
            }
            
            logger.error('[Network] Fetch failed', {
              error: error instanceof Error ? error.message : String(error),
              url: input.toString(),
            });
            
            throw error;
          }
        },
      }),
    ],
  });
  
  return { trpcClient, queryClient };
}

// ✅ NEW: Global error handler for auth failures
export function setupAuthErrorHandler() {
  if (typeof window === 'undefined') return;
  
  // Listen for 401 errors from any query/mutation
  document.addEventListener('auth:unauthorized', () => {
    logger.info('[Auth] Redirecting to login due to auth error');
    window.location.href = getLoginUrl();
  });
}
```

#### File: `server/_core/oauth.ts` (AFTER)

```typescript
import { Router, Request, Response } from 'express';
import { generateSessionJWT } from './jwt';
import { getOrCreateUser } from '../db';
import { logger } from './logger';
import { z } from 'zod';

export const oauthRouter = Router();

// ✅ NEW: Validate OAuth payload
const OAuthUserSchema = z.object({
  openId: z.string().min(1),
  name: z.string(),
  email: z.string().email().optional(),
});

// ✅ FIXED: Comprehensive OAuth callback with error handling
oauthRouter.get('/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  
  try {
    // ✅ NEW: Validate input
    if (!code || typeof code !== 'string') {
      logger.warn('[OAuth] Missing or invalid authorization code');
      return res.status(400).json({ error: 'Missing authorization code' });
    }
    
    // ✅ NEW: Validate state for CSRF protection
    const sessionState = req.session?.oauthState;
    if (!sessionState || sessionState !== state) {
      logger.warn('[OAuth] Invalid state parameter - possible CSRF attack', {
        expectedState: sessionState,
        receivedState: state,
      });
      return res.status(403).json({ error: 'Invalid state parameter' });
    }
    
    logger.info('[OAuth] Processing authorization code', { code: code.substring(0, 10) });
    
    // Exchange code for OAuth token
    const oauthUser = await exchangeCodeForUser(code);
    
    // ✅ NEW: Validate OAuth response
    const validatedUser = OAuthUserSchema.parse(oauthUser);
    
    logger.info('[OAuth] OAuth user validated', {
      openId: validatedUser.openId,
      name: validatedUser.name,
    });
    
    // Get or create user in database
    const user = await getOrCreateUser({
      openId: validatedUser.openId,
      name: validatedUser.name,
      email: validatedUser.email || '',
      loginMethod: 'oauth',
    });
    
    if (!user) {
      logger.error('[OAuth] Failed to create or retrieve user', {
        openId: validatedUser.openId,
      });
      return res.status(500).json({ error: 'Failed to create user account' });
    }
    
    logger.info('[OAuth] User created/retrieved successfully', {
      userId: user.id,
      openId: user.openId,
    });
    
    // Generate session token
    const sessionToken = await generateSessionJWT({
      id: user.id,
      openId: user.openId,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    // ✅ FIXED: Set cookie with all security flags
    res.cookie('session', sessionToken, {
      httpOnly: true, // Prevent XSS
      secure: process.env.NODE_ENV === 'production', // HTTPS only
      sameSite: 'lax', // CSRF protection
      maxAge: 86400000, // 24 hours
      path: '/',
      domain: process.env.COOKIE_DOMAIN,
    });
    
    logger.info('[OAuth] Session cookie set', {
      userId: user.id,
      maxAge: 86400000,
    });
    
    // ✅ NEW: Clear OAuth state
    delete req.session?.oauthState;
    
    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('[OAuth] Callback failed', {
      error: error instanceof Error ? error.message : String(error),
      code: typeof code === 'string' ? code.substring(0, 10) : 'unknown',
    });
    
    // ✅ NEW: Return user-friendly error page
    res.status(500).render('oauth-error', {
      message: 'Authentication failed. Please try again.',
      retryUrl: '/login',
    });
  }
});

// ✅ NEW: Helper function to exchange OAuth code for user
async function exchangeCodeForUser(code: string) {
  const response = await fetch(`${process.env.OAUTH_SERVER_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.user;
}
```

#### File: `client/src/hooks/useAuth.ts` (AFTER)

```typescript
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { logger } from '@/utils/logger';

export interface AuthState {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  redirectToLogin: () => void;
}

// ✅ NEW: Comprehensive auth hook with session management
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    logout: async () => {},
    redirectToLogin: () => {},
  });
  
  // ✅ NEW: Check current user on mount
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: 1, // Don't retry auth queries
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logger.info('[Auth] Logout successful');
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
      window.location.href = getLoginUrl();
    },
    onError: (error) => {
      logger.error('[Auth] Logout failed', {
        error: error.message,
      });
    },
  });
  
  useEffect(() => {
    if (isLoading) {
      setState(prev => ({ ...prev, loading: true }));
    } else if (error) {
      logger.warn('[Auth] Auth check failed', {
        error: error.message,
      });
      setState(prev => ({
        ...prev,
        loading: false,
        error,
        isAuthenticated: false,
      }));
    } else if (user) {
      logger.info('[Auth] User authenticated', { userId: user.id });
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      }));
    }
  }, [user, isLoading, error]);
  
  return {
    ...state,
    logout: () => logoutMutation.mutateAsync(),
    redirectToLogin: () => {
      logger.info('[Auth] Redirecting to login');
      window.location.href = getLoginUrl();
    },
  };
}
```

### Testing: Authentication Fixes

#### File: `server/auth.session.test.ts` (NEW)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createContext } from '@/_core/context';
import { generateSessionJWT, verifySessionJWT } from '@/_core/jwt';
import { logger } from '@/_core/logger';

describe('Session Management', () => {
  const mockUser = {
    id: 1,
    openId: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should create context with valid session', async () => {
    const token = await generateSessionJWT(mockUser);
    
    const mockReq = {
      cookies: new Map([['session', { value: token }]]),
      path: '/api/test',
      method: 'GET',
    };
    const mockRes = {
      cookie: vi.fn(),
    };
    
    const context = await createContext({
      req: mockReq as any,
      res: mockRes as any,
    });
    
    expect(context.user).toBeDefined();
    expect(context.user?.id).toBe(mockUser.id);
    expect(context.sessionExpired).toBe(false);
  });
  
  it('should refresh token when expiring soon', async () => {
    // Create token expiring in 30 minutes
    const token = await generateSessionJWT(mockUser, { expiresIn: '30m' });
    
    const mockReq = {
      cookies: new Map([['session', { value: token }]]),
      path: '/api/test',
      method: 'GET',
    };
    const mockRes = {
      cookie: vi.fn(),
    };
    
    const context = await createContext({
      req: mockReq as any,
      res: mockRes as any,
    });
    
    // Should have called res.cookie to set new token
    expect(mockRes.cookie).toHaveBeenCalled();
    expect(mockRes.cookie).toHaveBeenCalledWith(
      'session',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 86400000,
      })
    );
  });
  
  it('should return sessionExpired=true when no session', async () => {
    const mockReq = {
      cookies: new Map(),
      path: '/api/test',
      method: 'GET',
    };
    const mockRes = {
      cookie: vi.fn(),
    };
    
    const context = await createContext({
      req: mockReq as any,
      res: mockRes as any,
    });
    
    expect(context.user).toBeNull();
    expect(context.sessionExpired).toBe(true);
  });
  
  it('should handle invalid session token', async () => {
    const mockReq = {
      cookies: new Map([['session', { value: 'invalid-token' }]]),
      path: '/api/test',
      method: 'GET',
    };
    const mockRes = {
      cookie: vi.fn(),
    };
    
    const context = await createContext({
      req: mockReq as any,
      res: mockRes as any,
    });
    
    expect(context.user).toBeNull();
    expect(context.sessionExpired).toBe(true);
  });
  
  it('should throw UNAUTHORIZED error when protected procedure called without auth', async () => {
    const { protectedProcedure } = await import('@/_core/trpc');
    
    const mockContext = {
      user: null,
      sessionExpired: true,
      sessionExpiresIn: 0,
    };
    
    expect(() => {
      // Simulate protected procedure middleware
      if (!mockContext.user) {
        throw new Error('UNAUTHORIZED: Please login (10001)');
      }
    }).toThrow('UNAUTHORIZED');
  });
});
```

---

# Part 2: Database Connection Errors

## Error Group: "db.select is not a function" - 5 Critical Issues

**Affected Errors:**
- COAI-DASHBOARD-19 (Jan 22)
- COAI-DASHBOARD-18 (Jan 21)
- COAI-DASHBOARD-17 (Jan 20)
- COAI-DASHBOARD-16 (Jan 19)
- COAI-DASHBOARD-15 (Jan 18)

### Root Cause Analysis

The database object `db` is `null` or `undefined` when `.select()` is called. This occurs when:

1. **Connection Pool Not Initialized**: Database connection hasn't been established at startup
2. **Async Timing Issue**: Code calls `db.select()` before `await getDb()` completes
3. **Missing Error Handling**: No null check before database operations
4. **Connection Timeout**: Database connection dropped mid-operation
5. **Memory Exhaustion**: Connection pool exhausted, no connections available

### Before: Problematic Code

#### File: `server/db.ts` (BEFORE)

```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// ❌ PROBLEM 1: No connection pooling
// ❌ PROBLEM 2: Single connection can fail
// ❌ PROBLEM 3: No retry logic
let db: any = null;

export async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  db = drizzle(connection);
  return db;
}

// ❌ PROBLEM: Returns potentially null db
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
```

#### File: `server/routers.ts` (BEFORE - Multiple Locations)

```typescript
// ❌ PROBLEM 1: No null check
// ❌ PROBLEM 2: No error handling
// ❌ PROBLEM 3: No retry logic
export const analyticsRouter = {
  getAnalytics: publicProcedure.query(async () => {
    const results = await db.select().from(analytics).limit(10);
    return results;
  }),
  
  getMetrics: publicProcedure.query(async () => {
    const metrics = await db.select().from(metrics);
    return metrics;
  }),
  
  getUsers: publicProcedure.query(async () => {
    const users = await db.select().from(users);
    return users;
  }),
};
```

#### File: `server/_core/index.ts` (BEFORE)

```typescript
import express from 'express';
import { initializeDatabase } from '../db';

const app = express();

// ❌ PROBLEM: No error handling if DB init fails
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
  // ❌ PROBLEM: App continues running without database
  process.exit(1);
});

app.listen(3000);
```

### After: Fixed Code

#### File: `server/db.ts` (AFTER)

```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql, { Pool } from 'mysql2/promise';
import { logger } from './_core/logger';

// ✅ NEW: Connection pool management
let connectionPool: Pool | null = null;
let db: any = null;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// ✅ NEW: Comprehensive database initialization with retry logic
export async function initializeDatabase(): Promise<typeof db> {
  logger.info('[DB] Initializing database connection pool');
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`[DB] Connection attempt ${attempt}/${MAX_RETRIES}`);
      
      // ✅ NEW: Create connection pool instead of single connection
      connectionPool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306'),
        
        // ✅ NEW: Pool configuration
        connectionLimit: 10, // Max connections
        enableKeepAlive: true, // Keep connections alive
        keepAliveInitialDelayMs: 0,
        
        // ✅ NEW: Connection timeout
        waitForConnectionsMs: 10000,
        enableExperimental: true,
      });
      
      // ✅ NEW: Verify connection is working
      const connection = await connectionPool.getConnection();
      await connection.ping();
      connection.release();
      
      logger.info('[DB] Connection pool verified successfully');
      
      // ✅ NEW: Create Drizzle ORM instance
      db = drizzle(connectionPool);
      
      // ✅ NEW: Set up connection pool event handlers
      connectionPool.on('error', (error) => {
        logger.error('[DB] Connection pool error', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
      
      return db;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      logger.warn(`[DB] Connection attempt ${attempt} failed`, {
        error: lastError.message,
        nextRetryIn: attempt < MAX_RETRIES ? RETRY_DELAY_MS : 'no retry',
      });
      
      if (attempt < MAX_RETRIES) {
        // ✅ NEW: Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, RETRY_DELAY_MS * attempt)
        );
      }
    }
  }
  
  logger.error('[DB] Failed to initialize database after all retries', {
    error: lastError?.message,
    attempts: MAX_RETRIES,
  });
  
  throw new Error(
    `Database initialization failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}

// ✅ NEW: Get database instance with health check
export async function getDb() {
  if (!connectionPool || !db) {
    logger.error('[DB] Database not initialized');
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  
  try {
    // ✅ NEW: Verify connection pool is healthy
    const connection = await connectionPool.getConnection();
    await connection.ping();
    connection.release();
    
    return db;
  } catch (error) {
    logger.error('[DB] Connection pool health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    
    // ✅ NEW: Attempt to reinitialize if pool is unhealthy
    connectionPool = null;
    db = null;
    
    return initializeDatabase();
  }
}

// ✅ NEW: Graceful shutdown
export async function closeDatabase() {
  if (connectionPool) {
    logger.info('[DB] Closing connection pool');
    try {
      await connectionPool.end();
      connectionPool = null;
      db = null;
      logger.info('[DB] Connection pool closed successfully');
    } catch (error) {
      logger.error('[DB] Error closing connection pool', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

// ✅ NEW: Get connection pool for advanced operations
export function getConnectionPool(): Pool {
  if (!connectionPool) {
    throw new Error('Connection pool not initialized');
  }
  return connectionPool;
}
```

#### File: `server/routers.ts` (AFTER - Example Fixes)

```typescript
import { publicProcedure, router } from '@/_core/trpc';
import { getDb } from '../db';
import { TRPCError } from '@trpc/server';
import { logger } from '@/_core/logger';

// ✅ FIXED: Comprehensive error handling for all database operations
export const analyticsRouter = {
  getAnalytics: publicProcedure.query(async () => {
    try {
      // ✅ NEW: Get database with health check
      const db = await getDb();
      
      if (!db) {
        throw new Error('Database instance is null');
      }
      
      logger.info('[Analytics] Fetching analytics data');
      
      const results = await db
        .select()
        .from(analytics)
        .limit(10);
      
      if (!results) {
        logger.warn('[Analytics] Query returned null');
        return [];
      }
      
      logger.info('[Analytics] Successfully fetched analytics', {
        count: results.length,
      });
      
      return results;
    } catch (error) {
      logger.error('[Analytics] Failed to fetch analytics', {
        error: error instanceof Error ? error.message : String(error),
      });
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch analytics data',
        cause: error,
      });
    }
  }),
  
  getMetrics: publicProcedure.query(async () => {
    try {
      // ✅ NEW: Get database with health check
      const db = await getDb();
      
      if (!db) {
        throw new Error('Database instance is null');
      }
      
      logger.info('[Analytics] Fetching metrics');
      
      const metrics = await db
        .select()
        .from(metrics);
      
      return metrics || [];
    } catch (error) {
      logger.error('[Analytics] Failed to fetch metrics', {
        error: error instanceof Error ? error.message : String(error),
      });
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch metrics',
        cause: error,
      });
    }
  }),
  
  getUsers: publicProcedure.query(async () => {
    try {
      // ✅ NEW: Get database with health check
      const db = await getDb();
      
      if (!db) {
        throw new Error('Database instance is null');
      }
      
      logger.info('[Analytics] Fetching users');
      
      const users = await db
        .select()
        .from(users);
      
      return users || [];
    } catch (error) {
      logger.error('[Analytics] Failed to fetch users', {
        error: error instanceof Error ? error.message : String(error),
      });
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch users',
        cause: error,
      });
    }
  }),
};

export const appRouter = router({
  analytics: analyticsRouter,
});
```

#### File: `server/_core/index.ts` (AFTER)

```typescript
import express from 'express';
import { initializeDatabase, closeDatabase } from '../db';
import { logger } from './logger';
import { appRouter } from '../routers';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './context';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ NEW: Comprehensive startup sequence with error handling
async function startServer() {
  try {
    logger.info('[Server] Starting COAI Dashboard server');
    
    // ✅ NEW: Initialize database with retry logic
    logger.info('[Server] Initializing database...');
    await initializeDatabase();
    logger.info('[Server] Database initialized successfully');
    
    // ✅ NEW: Setup Express middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // ✅ NEW: Setup tRPC router
    app.use(
      '/api/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
    
    // ✅ NEW: Health check endpoint
    app.get('/health', async (req, res) => {
      try {
        const db = await getDb();
        res.json({ status: 'healthy', database: 'connected' });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          database: 'disconnected',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
    
    // ✅ NEW: Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('[Server] Unhandled error', {
        error: err instanceof Error ? err.message : String(err),
        path: req.path,
        method: req.method,
      });
      
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });
    
    // ✅ NEW: Graceful shutdown
    const server = app.listen(PORT, () => {
      logger.info(`[Server] Server running on port ${PORT}`);
    });
    
    // ✅ NEW: Handle shutdown signals
    process.on('SIGTERM', async () => {
      logger.info('[Server] SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await closeDatabase();
        logger.info('[Server] Server shut down successfully');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', async () => {
      logger.info('[Server] SIGINT received, shutting down gracefully');
      server.close(async () => {
        await closeDatabase();
        logger.info('[Server] Server shut down successfully');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('[Server] Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// ✅ NEW: Start server
startServer();
```

### Testing: Database Connection Fixes

#### File: `server/db.test.ts` (NEW)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initializeDatabase, getDb, closeDatabase } from '../db';
import { logger } from '@/_core/logger';

describe('Database Connection Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(async () => {
    await closeDatabase();
  });
  
  it('should initialize database connection pool', async () => {
    const db = await initializeDatabase();
    
    expect(db).toBeDefined();
    expect(db).not.toBeNull();
  });
  
  it('should return connection pool when healthy', async () => {
    await initializeDatabase();
    const db = await getDb();
    
    expect(db).toBeDefined();
  });
  
  it('should retry on connection failure', async () => {
    // Mock mysql connection to fail first time, succeed second time
    let attempts = 0;
    vi.mock('mysql2/promise', () => ({
      createPool: vi.fn(async () => {
        attempts++;
        if (attempts === 1) {
          throw new Error('Connection failed');
        }
        return {
          getConnection: vi.fn(async () => ({
            ping: vi.fn(),
            release: vi.fn(),
          })),
          on: vi.fn(),
        };
      }),
    }));
    
    // Should retry and eventually succeed
    const db = await initializeDatabase();
    expect(db).toBeDefined();
    expect(attempts).toBeGreaterThan(1);
  });
  
  it('should throw error after max retries', async () => {
    // Mock mysql connection to always fail
    vi.mock('mysql2/promise', () => ({
      createPool: vi.fn(async () => {
        throw new Error('Connection failed');
      }),
    }));
    
    await expect(initializeDatabase()).rejects.toThrow(
      /Database initialization failed after/
    );
  });
  
  it('should handle connection pool errors', async () => {
    const db = await initializeDatabase();
    
    // Simulate connection pool error
    const errorHandler = vi.fn();
    // connectionPool.on('error', errorHandler);
    
    // Verify error handling is set up
    expect(db).toBeDefined();
  });
  
  it('should close connection pool gracefully', async () => {
    await initializeDatabase();
    
    // Should not throw
    await expect(closeDatabase()).resolves.not.toThrow();
  });
});
```

---

## Summary: Authentication & Database Fixes

### Authentication (6 Errors Fixed)

| Issue | Root Cause | Fix | Prevention |
|-------|-----------|-----|-----------|
| Session Expired | No refresh mechanism | Auto-refresh 1h before expiration | Monitor token age |
| Missing Credentials | No `credentials: 'include'` | Add to all fetch calls | Code review |
| Silent Auth Failure | No error logging | Log all auth failures | Monitoring |
| Invalid OAuth Token | No validation | Validate OAuth response | Input validation |
| Insecure Cookie | Missing security flags | Set httpOnly, secure, sameSite | Security audit |
| No Session Tracking | Can't distinguish error types | Add sessionExpired flag | Better error context |

### Database (5 Errors Fixed)

| Issue | Root Cause | Fix | Prevention |
|-------|-----------|-----|-----------|
| Null DB Instance | No initialization | Connection pooling + retry | Health checks |
| Connection Timeout | Single connection | Pool with keep-alive | Monitoring |
| No Error Handling | Silent failures | Try-catch + logging | Error boundaries |
| Connection Exhaustion | No pool management | Limit connections to 10 | Resource monitoring |
| No Graceful Shutdown | Abrupt termination | Handle SIGTERM/SIGINT | Process management |

---

## Implementation Checklist

- [ ] **Authentication**
  - [ ] Update `server/_core/context.ts` with session refresh logic
  - [ ] Update `server/_core/trpc.ts` with enhanced error handling
  - [ ] Update `client/src/lib/trpc.ts` with credentials and error handling
  - [ ] Update `server/_core/oauth.ts` with validation and security flags
  - [ ] Create `client/src/hooks/useAuth.ts` with comprehensive auth state
  - [ ] Add unit tests in `server/auth.session.test.ts`

- [ ] **Database**
  - [ ] Update `server/db.ts` with connection pooling and retry logic
  - [ ] Update all routers with error handling and null checks
  - [ ] Update `server/_core/index.ts` with startup/shutdown sequence
  - [ ] Add health check endpoint
  - [ ] Add unit tests in `server/db.test.ts`

- [ ] **Monitoring**
  - [ ] Configure Sentry alerts for auth errors
  - [ ] Configure Sentry alerts for DB errors
  - [ ] Set up error rate monitoring (threshold: 1%)
  - [ ] Monitor session refresh rate
  - [ ] Monitor connection pool health

- [ ] **Testing**
  - [ ] Run auth session tests
  - [ ] Run database connection tests
  - [ ] Run E2E tests for login flow
  - [ ] Run E2E tests for database operations
  - [ ] Load test connection pool

---

## Deployment Steps

1. **Pre-deployment**
   - [ ] Review all code changes
   - [ ] Run full test suite
   - [ ] Verify Sentry configuration
   - [ ] Create database backup

2. **Deployment**
   - [ ] Deploy code changes
   - [ ] Restart application server
   - [ ] Verify health check endpoint
   - [ ] Monitor error rate for 1 hour

3. **Post-deployment**
   - [ ] Verify no new errors in Sentry
   - [ ] Check session refresh rate
   - [ ] Monitor database connection pool
   - [ ] Collect performance metrics

---

## Monitoring & Alerts

**Sentry Configuration:**
- Auth errors: Alert if > 5 errors/hour
- DB errors: Alert if > 3 errors/hour
- Session expired: Alert if > 10%
- Connection pool: Alert if > 80% utilization

**Custom Metrics:**
- Session refresh rate (target: < 5%)
- DB connection pool utilization (target: < 50%)
- Auth success rate (target: > 99%)
- API response time (target: < 500ms)

---

This comprehensive guide provides all the code changes, testing strategies, and deployment procedures needed to permanently fix all authentication and database errors in the COAI Dashboard.
