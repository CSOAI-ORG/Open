# Phase 3 Implementation Guide: Step-by-Step Fixes

## Quick Reference: Error Categories & Fixes

### 1. Schema Import Errors (15+ errors)

**Error Pattern:**
```
error TS2724: '"../../drizzle/schema"' has no exported member named 'User'. Did you mean 'users'?
```

**Files to Fix:**
- `server/_core/context.ts` (line 2)
- `server/_core/sdk.ts` (line 7)
- `server/routers/*.ts` (multiple files)
- `server/__tests__/*.ts` (test files)

**Fix Template:**

**Before:**
```typescript
import { User } from "../../drizzle/schema";

interface UserContext {
  user: User;
}
```

**After:**
```typescript
import { users } from "../../drizzle/schema";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

interface UserContext {
  user: User;
}
```

**Action Items:**
1. Search for `import.*User.*from.*schema` across codebase
2. Replace with `import { users } from "../../drizzle/schema"`
3. Add type alias: `type User = InferSelectModel<typeof users>`
4. Update all references from `User` to `users` in queries
5. Verify no compilation errors

---

### 2. Boolean/Number Type Mismatches (12+ errors)

**Error Pattern:**
```
error TS2322: Type 'number' is not assignable to type 'boolean'.
```

**File: `server/api/enterprise.ts` (line 252)**

**Before:**
```typescript
const data = {
  isActive: 1,  // Wrong: number
  isPinned: 0,
  isLocked: 1
};
```

**After:**
```typescript
const data = {
  isActive: true,   // Correct: boolean
  isPinned: false,
  isLocked: true
};
```

**Bulk Fix Command:**
```bash
# Find all instances
grep -r "isActive: [01]" server/ client/

# Replace in files (example)
sed -i 's/isActive: 1/isActive: true/g' server/api/enterprise.ts
sed -i 's/isActive: 0/isActive: false/g' server/api/enterprise.ts
```

**Files to Check:**
- `server/api/enterprise.ts`
- `server/services/userProvisioning.ts`
- `server/routers/workflowBuilder.ts`
- `server/services/rulesEngine.ts`
- All test files with mock data

---

### 3. Database Query Type Issues (18+ errors)

**Error Pattern:**
```
error TS2322: Type 'MySql2Database<...>' is not assignable to type '... | null'
error TS2769: No overload matches this call
```

**File: `server/db.ts` (line 101)**

**Before:**
```typescript
let _db: (MySql2Database<Record<string, unknown>> & { $client: Pool; }) | null = null;

export async function getDb() {
  if (!_db) {
    const pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    _db = drizzle(pool, { schema });
  }
  return _db;
}
```

**After:**
```typescript
let _db: Awaited<ReturnType<typeof drizzle>> | null = null;

export async function getDb() {
  if (!_db) {
    const pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    _db = drizzle(pool, { schema });
  }
  return _db;
}
```

**File: `server/courses.ts` (line 491)**

**Before:**
```typescript
// Query with null comparison issue
const result = eq(courses.id, courseId);  // courseId might be null
```

**After:**
```typescript
// Add null check
if (courseId === null || courseId === undefined) {
  throw new Error("Course ID is required");
}
const result = eq(courses.id, courseId);
```

---

### 4. React Component Type Errors (52 errors)

**Error Pattern:**
```
error TS7006: Parameter 'e' implicitly has an 'any' type
error TS2322: Type 'string' is not assignable to type 'number'
```

**File: `client/src/components/AdvancedNotificationCenter.tsx`**

**Before:**
```typescript
export function AdvancedNotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {  // Missing type
    setFilter(e.target.value);
  };

  const handleMarkAsRead = (id) => {  // Missing type
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: 1 } : n  // Wrong: 1 instead of true
    ));
  };

  return (
    <div>
      <input onChange={handleFilterChange} />
    </div>
  );
}
```

**After:**
```typescript
import React, { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function AdvancedNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n  // Correct: boolean
    ));
  };

  return (
    <div>
      <input 
        onChange={handleFilterChange}
        value={filter}
        placeholder="Filter notifications..."
      />
    </div>
  );
}
```

**Common React Type Patterns:**

```typescript
// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};

// Refs
const inputRef = useRef<HTMLInputElement>(null);

// State with types
const [count, setCount] = useState<number>(0);
const [items, setItems] = useState<Item[]>([]);

// Props interface
interface ComponentProps {
  title: string;
  count?: number;
  onClose: () => void;
}
```

---

### 5. Array/Object Indexing Issues (38 errors)

**Error Pattern:**
```
error TS2551: Property 'variantBOpenRate' does not exist on type
```

**File: `server/routers/abTesting.ts`**

**Before:**
```typescript
// Test data doesn't match schema
const testData = {
  variantASent: 100,      // Should be 'variantAsent' (lowercase 's')
  variantBOpenRate: 45,   // Should be 'variantBopenRate'
};

// Dynamic access without type guard
const value = data[key];  // Type 'any'
```

**After:**
```typescript
// Match schema exactly
const testData = {
  variantAsent: 100,      // Correct: matches schema
  variantBopenRate: 45,   // Correct: matches schema
};

// Safe dynamic access with type guard
const getValue = <T extends Record<string, any>>(obj: T, key: keyof T): T[keyof T] => {
  return obj[key];
};

const value = getValue(testData, 'variantAsent');  // Type-safe
```

**Type Guard Pattern:**
```typescript
// Before: Unsafe
const value = obj[userInput];

// After: Safe
const value = obj[userInput as keyof typeof obj];

// Or with explicit type guard
function isValidKey(key: string, obj: object): key is keyof typeof obj {
  return key in obj;
}

if (isValidKey(userInput, obj)) {
  const value = obj[userInput];
}
```

---

### 6. Null/Undefined Handling (18+ errors)

**Error Pattern:**
```
error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string'
```

**Before:**
```typescript
// Null passed without checking
const result = new Date(dateString);  // dateString might be null

// Comparison without null check
if (value === someNull) {
  // ...
}
```

**After:**
```typescript
// Add null check
const result = dateString ? new Date(dateString) : null;

// Or with type guard
if (dateString !== null && dateString !== undefined) {
  const result = new Date(dateString);
}

// Use optional chaining
const value = obj?.property?.nested;

// Use nullish coalescing
const value = dateString ?? new Date();
```

---

### 7. Function Parameter Mismatches (15+ errors)

**Error Pattern:**
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
```

**Before:**
```typescript
// Function expects number
const handler = (value: number) => {
  return value * 2;
};

// Called with string
const result = handler("10");  // Error
```

**After:**
```typescript
// Option 1: Accept multiple types
const handler = (value: string | number) => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return num * 2;
};

// Option 2: Create overloads
function handler(value: number): number;
function handler(value: string): number;
function handler(value: string | number): number {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return num * 2;
}

// Option 3: Use generics
const handler = <T extends string | number>(value: T): number => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return num * 2;
};
```

---

## Execution Order

**Priority 1 (Critical - Do First):**
1. Fix schema imports (context.ts, sdk.ts)
2. Fix database initialization (db.ts)
3. Fix boolean/number mismatches

**Priority 2 (High - Do Second):**
4. Fix React component types
5. Fix database query types
6. Fix null/undefined handling

**Priority 3 (Medium - Do Third):**
7. Fix array/object indexing
8. Fix function parameter mismatches
9. Fix remaining miscellaneous errors

---

## Verification Commands

```bash
# Check specific file
npx tsc --noEmit server/_core/context.ts

# Check error count
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l

# Get errors by category
npx tsc --noEmit 2>&1 | grep "error TS2322"  # Type mismatches
npx tsc --noEmit 2>&1 | grep "error TS2724"  # Missing exports
npx tsc --noEmit 2>&1 | grep "error TS7006"  # Implicit any

# Run tests
pnpm test

# Check specific test file
pnpm test -- server/__tests__/workflow-advanced-features.test.ts
```

---

## Success Metrics

- [ ] Schema import errors: 0 (from 15+)
- [ ] Boolean/number mismatches: 0 (from 12+)
- [ ] Database query type errors: 0 (from 18+)
- [ ] React component type errors: <10 (from 52)
- [ ] Array/object indexing errors: <5 (from 38)
- [ ] Null/undefined errors: 0 (from 18+)
- [ ] Function parameter errors: 0 (from 15+)
- [ ] **Total errors: <50 (from 231)**

---

**Implementation Guide Version:** 1.0
**Last Updated:** January 21, 2026
**Status:** Ready for Implementation
