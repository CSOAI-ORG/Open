# TypeScript Error Analysis Report

**Total Errors**: 257  
**Analysis Date**: January 24, 2026  
**Status**: Categorized by error type and file for prioritized fixing

---

## Error Type Summary (Ranked by Frequency)

| Error Code | Count | Category | Severity | Description |
|-----------|-------|----------|----------|-------------|
| **TS2322** | 65 | Type Mismatch | 🔴 High | Type 'X' is not assignable to type 'Y' - Database schema/API response type mismatches |
| **TS2339** | 56 | Missing Property | 🔴 High | Property 'X' does not exist on type 'Y' - Missing router procedures or env vars |
| **TS2769** | 36 | Overload Mismatch | 🟡 Medium | No overload matches this call - Function signature mismatches |
| **TS7053** | 28 | Index Type Error | 🟡 Medium | Element implicitly has 'any' type - Dynamic object indexing without proper types |
| **TS7006** | 14 | Implicit Any | 🟡 Medium | Parameter implicitly has 'any' type - Missing parameter type annotations |
| **TS7031** | 12 | Implicit Any | 🟡 Medium | Binding element implicitly has 'any' type - Destructuring without types |
| **TS2345** | 12 | Argument Type | 🟡 Medium | Argument of type 'X' not assignable to 'Y' - Function call type mismatch |
| **TS2554** | 7 | Argument Count | 🟡 Medium | Expected N arguments but got M - Function arity mismatch |
| **TS2304** | 7 | Undefined Name | 🟡 Medium | Cannot find name 'X' - Missing imports or undefined variables |
| **TS2367** | 6 | Comparison Type | 🟢 Low | This comparison appears to be unintentional - Type comparison issues |
| **TS2353** | 5 | Object Literal | 🟢 Low | Object literal may only specify known properties - Extra properties |
| **Other** | 12 | Various | 🟢 Low | Various minor issues (1-2 occurrences each) |

---

## Top 15 Files with Most Errors

### 1. **server/routers/emailCampaignRouter.ts** (14 errors)
- **Error Breakdown**: TS7031 (12), TS2554 (1), TS2307 (1)
- **Root Cause**: Missing type annotations on destructured parameters; incorrect function calls
- **Fix Priority**: 🔴 HIGH
- **Sample Errors**:
  - `Binding element 'input' implicitly has an 'any' type` (12x)
  - `Expected 2-3 arguments, but got 1`
  - `Cannot find module '../trpc'`

### 2. **server/services/emailCampaignService.ts** (13 errors)
- **Error Breakdown**: TS2322 (9), TS2769 (3), TS2339 (1)
- **Root Cause**: Database query result type mismatches; Drizzle ORM integration issues
- **Fix Priority**: 🔴 HIGH
- **Sample Errors**:
  - `Type 'Date' is not assignable to type 'string | SQL<unknown>'` (multiple)
  - `No overload matches this call` (Drizzle methods)
  - `Property 'insertId' does not exist on MySqlRawQueryResult`

### 3. **client/src/components/CASAProgressDashboard.tsx** (12 errors)
- **Error Breakdown**: TS7006 (10), TS2339 (2)
- **Root Cause**: Missing type annotations on function parameters; missing tRPC router procedures
- **Fix Priority**: 🔴 HIGH
- **Sample Errors**:
  - `Parameter 'module' implicitly has an 'any' type` (10x)
  - `Property 'casaCurriculum' does not exist on tRPC router`

### 4. **server/routers.ts** (10 errors)
- **Error Breakdown**: TS2339 (10)
- **Root Cause**: Missing router procedures or incorrect procedure names
- **Fix Priority**: 🔴 HIGH
- **Sample Errors**:
  - `Property 'getOverview' does not exist on router`
  - Multiple missing procedure definitions

### 5. **server/_core/sdk.ts** (7 errors)
- **Error Breakdown**: TS2339 (3), TS2322 (1), TS2345 (1), TS2367 (1), TS2769 (1)
- **Root Cause**: Environment variable type mismatches; SDK initialization issues
- **Fix Priority**: 🔴 HIGH
- **Sample Errors**:
  - `Property 'BUILT_IN_FORGE_API_KEY' does not exist on env config`

### 6. **client/src/pages/Certificates.tsx** (6 errors)
- **Error Breakdown**: TS2322 (4), TS7006 (2)
- **Root Cause**: Type mismatches in certificate data; missing parameter types
- **Fix Priority**: 🟡 MEDIUM

### 7. **server/routers/emailPreferences.ts** (6 errors)
- **Error Breakdown**: TS2339 (6)
- **Root Cause**: Missing router procedures or incorrect names
- **Fix Priority**: 🟡 MEDIUM

### 8. **server/services/byzantineRealtimeService.ts** (6 errors)
- **Error Breakdown**: TS2769 (3), TS2322 (2), TS2724 (1)
- **Root Cause**: WebSocket/realtime API integration type mismatches
- **Fix Priority**: 🟡 MEDIUM

### 9. **server/services/complianceMarketplace.ts** (6 errors)
- **Error Breakdown**: TS2322 (6)
- **Root Cause**: Database schema type mismatches
- **Fix Priority**: 🟡 MEDIUM

### 10. **client/src/hooks/useNotificationWebSocket.ts** (5 errors)
- **Error Breakdown**: TS2367 (2), TS2345 (2), TS2322 (1)
- **Root Cause**: WebSocket event type mismatches
- **Fix Priority**: 🟡 MEDIUM

### 11-15. Other Files (5 errors each)
- **client/src/pages/AISystems.tsx** (5 TS7053)
- **client/src/pages/ComplianceRulesEngine.tsx** (5 TS2322)
- **client/src/pages/EmailPreferences.tsx** (5 mixed)
- **server/routers/emailScheduling.ts** (5 mixed)
- **server/routers/workflowTemplates.ts** (5 mixed)

---

## Error Categories by Root Cause

### 🔴 CRITICAL (Fix First) - 118 Errors

#### 1. **Database Schema/Type Mismatches** (65 TS2322 errors)
- **Files**: emailCampaignService.ts, complianceMarketplace.ts, byzantineRealtimeService.ts, etc.
- **Issue**: Drizzle ORM query results don't match expected types
- **Common Pattern**: `Type 'Date' is not assignable to type 'string | SQL<unknown>'`
- **Solution**: 
  - Update Drizzle schema definitions to match actual data types
  - Use proper type casting for Date fields
  - Ensure database column types align with TypeScript types

#### 2. **Missing Router Procedures** (56 TS2339 errors)
- **Files**: server/routers.ts, emailPreferences.ts, emailScheduling.ts, workflowTemplates.ts
- **Issue**: tRPC procedures referenced in components don't exist in routers
- **Common Pattern**: `Property 'X' does not exist on type 'router'`
- **Solution**:
  - Add missing procedure definitions to routers
  - Verify procedure names match between frontend and backend
  - Check for typos in procedure names

#### 3. **Missing Environment Variables** (7 TS2339 errors in sdk.ts)
- **Files**: server/_core/sdk.ts
- **Issue**: Environment variables not properly typed or exported
- **Solution**:
  - Add missing env vars to env.ts
  - Ensure all required env vars are declared in types

### 🟡 MEDIUM (Fix Second) - 112 Errors

#### 4. **Missing Parameter Type Annotations** (26 TS7006 + TS7031 errors)
- **Files**: emailCampaignRouter.ts, CASAProgressDashboard.tsx, Certificates.tsx
- **Issue**: Function parameters and destructured variables lack type annotations
- **Common Pattern**: `Parameter 'X' implicitly has an 'any' type`
- **Solution**:
  - Add explicit type annotations to all function parameters
  - Use destructuring with types: `({ input }: { input: MyType })`
  - Enable `noImplicitAny` in tsconfig

#### 5. **Function Overload Mismatches** (36 TS2769 errors)
- **Files**: emailCampaignService.ts, byzantineRealtimeService.ts, useNotificationWebSocket.ts
- **Issue**: Function calls don't match any available overload
- **Common Pattern**: `No overload matches this call`
- **Solution**:
  - Check function signature requirements
  - Verify argument types and count
  - Consult Drizzle/library documentation for correct usage

#### 6. **Dynamic Object Indexing** (28 TS7053 errors)
- **Files**: AISystems.tsx, and various components
- **Issue**: Accessing object properties with dynamic keys without proper typing
- **Common Pattern**: `Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'X'`
- **Solution**:
  - Use `Record<string, T>` for dynamic object types
  - Add proper index signatures to types
  - Use `as const` for literal types

### 🟢 LOW (Fix Third) - 27 Errors

#### 7. **Argument Type Mismatches** (12 TS2345 errors)
- **Issue**: Function arguments don't match parameter types
- **Solution**: Type-check arguments before passing

#### 8. **Argument Count Mismatches** (7 TS2554 errors)
- **Issue**: Wrong number of arguments passed to functions
- **Solution**: Check function signatures and adjust calls

#### 9. **Undefined Names** (7 TS2304 errors)
- **Issue**: Variables/types not imported or defined
- **Solution**: Add missing imports or define missing types

#### 10. **Other Issues** (12 errors)
- Type comparison issues, extra object properties, etc.

---

## Recommended Fix Order

### Phase 1: Critical (1-2 hours)
1. **emailCampaignRouter.ts** - Add parameter type annotations (12 TS7031)
2. **emailCampaignService.ts** - Fix database type mismatches (13 errors)
3. **server/routers.ts** - Add missing procedures (10 TS2339)
4. **CASAProgressDashboard.tsx** - Add parameter types (12 errors)

### Phase 2: High Priority (1-2 hours)
5. **server/_core/sdk.ts** - Fix environment variable types (7 errors)
6. **emailPreferences.ts** - Add missing procedures (6 TS2339)
7. **byzantineRealtimeService.ts** - Fix WebSocket type mismatches (6 errors)
8. **complianceMarketplace.ts** - Fix database types (6 TS2322)

### Phase 3: Medium Priority (1-2 hours)
9. **Certificates.tsx** - Fix certificate data types (6 errors)
10. **useNotificationWebSocket.ts** - Fix WebSocket event types (5 errors)
11. **AISystems.tsx** - Fix dynamic object indexing (5 TS7053)
12. **ComplianceRulesEngine.tsx** - Fix type assignments (5 TS2322)

### Phase 4: Low Priority (30 minutes)
13. Remaining files with 1-4 errors each

---

## Implementation Strategy

### For TS7031/TS7006 (Implicit Any - 26 errors)
```typescript
// ❌ Before
const procedure = (input) => { ... }

// ✅ After
const procedure = (input: MyInputType) => { ... }
```

### For TS2322 (Type Mismatch - 65 errors)
```typescript
// ❌ Before
const result = db.insert(table).values({ createdAt: new Date() })

// ✅ After
const result = db.insert(table).values({ 
  createdAt: new Date().toISOString() 
})
```

### For TS2339 (Missing Property - 56 errors)
```typescript
// ❌ Before (in router)
export const router = trpc.router({
  // Missing procedure
})

// ✅ After
export const router = trpc.router({
  getOverview: publicProcedure.query(async () => { ... })
})
```

### For TS7053 (Dynamic Indexing - 28 errors)
```typescript
// ❌ Before
const data: any = { ... }
const value = data[dynamicKey]

// ✅ After
const data: Record<string, unknown> = { ... }
const value = data[dynamicKey as keyof typeof data]
```

---

## Estimated Impact

- **Critical Phase 1**: ~50 errors fixed (19% reduction)
- **High Priority Phase 2**: ~35 errors fixed (36% cumulative)
- **Medium Priority Phase 3**: ~30 errors fixed (48% cumulative)
- **Low Priority Phase 4**: ~142 errors fixed (100% completion)

**Total Time Estimate**: 4-6 hours for complete resolution

---

## Prevention Strategies

1. **Enable strict mode in tsconfig.json**:
   - `"strict": true`
   - `"noImplicitAny": true`
   - `"strictNullChecks": true`

2. **Add pre-commit hooks** to catch TypeScript errors before commits

3. **Require type annotations** in code review guidelines

4. **Use TypeScript in IDE** for real-time error detection

5. **Document common patterns** for database operations and API calls
