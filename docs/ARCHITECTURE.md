# CSOAI Dashboard Architecture

**Version:** 1.0  
**Last Updated:** January 2026  
**Author:** CSOAI Development Team

---

## System Overview

The CSOAI Dashboard is a full-stack web application for AI safety compliance management, featuring real-time Byzantine Council voting, course management, and enterprise integrations.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React 19  │  │  Tailwind 4 │  │     shadcn/ui           │  │
│  │   + Wouter  │  │   + CSS     │  │   Components            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Express   │  │    tRPC     │  │     WebSocket           │  │
│  │   Server    │  │   Routers   │  │   (Real-time)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Email    │  │  Payment  │  │  Council  │  │  Compliance │  │
│  │  Service  │  │  Service  │  │  Service  │  │  Service    │  │
│  └───────────┘  └───────────┘  └───────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Drizzle   │  │ PostgreSQL  │  │     S3 Storage          │  │
│  │    ORM     │  │  Database   │  │   (Files/Assets)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Component library |
| Wouter | Client-side routing |
| Framer Motion | Animations |
| TanStack Query | Data fetching |
| Recharts | Data visualization |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | HTTP server |
| tRPC | Type-safe API |
| Drizzle ORM | Database access |
| WebSocket | Real-time communication |
| Zod | Schema validation |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary database |
| S3 | File storage |
| Resend | Email delivery |
| Stripe | Payment processing |
| Sentry | Error tracking |

---

## Directory Structure

```
coai-dashboard/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utility functions
│       ├── pages/         # Page components
│       ├── App.tsx        # Root component
│       └── main.tsx       # Entry point
│
├── server/                 # Backend application
│   ├── api/               # API endpoints
│   ├── routers/           # tRPC routers
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── __tests__/         # Test files
│   ├── db.ts              # Database connection
│   └── index.ts           # Server entry point
│
├── shared/                 # Shared code
│   ├── types.ts           # Shared TypeScript types
│   └── const.ts           # Shared constants
│
├── drizzle/               # Database
│   ├── schema.ts          # Database schema
│   └── migrations/        # Migration files
│
├── docs/                   # Documentation
└── tests/                  # E2E tests
```

---

## Core Modules

### 1. Authentication Module

Handles user authentication and authorization using JWT tokens and OAuth.

```typescript
// Authentication flow
User → Login → JWT Token → Protected Routes
                    ↓
              Refresh Token → New JWT Token
```

**Key Files:**
- `server/auth.ts` - Authentication logic
- `client/src/contexts/AuthContext.tsx` - Auth state management

### 2. Byzantine Council Module

Implements the 33-agent voting system with Byzantine fault tolerance.

```typescript
// Voting flow
Report Submission → Session Creation → Agent Voting → Consensus
                                            ↓
                    WebSocket Broadcast ← Real-time Updates
```

**Key Files:**
- `server/routers/byzantineRealtime.ts` - Voting logic
- `client/src/pages/ByzantineConsensus.tsx` - UI

### 3. Compliance Module

Manages compliance assessments across multiple frameworks.

**Supported Frameworks:**
- EU AI Act
- NIST AI RMF
- ISO/IEC 42001
- UK AI Regulation
- Canada AIDA
- Australia AI Ethics
- China TC260

**Key Files:**
- `server/routers/compliance.ts` - Compliance logic
- `client/src/pages/Compliance.tsx` - UI

### 4. Course Management Module

Handles course enrollment, progress tracking, and certification.

```typescript
// Course flow
Enrollment → Lessons → Quiz → Exam → Certification
                ↓
        Progress Tracking
```

**Key Files:**
- `server/routers/courses.ts` - Course logic
- `client/src/pages/Courses.tsx` - Course catalog
- `client/src/pages/MyCourses.tsx` - User courses

### 5. Payment Module

Integrates Stripe for certification fees and donations.

**Key Files:**
- `server/routers/stripe.ts` - Payment logic
- `server/api/stripe/webhook.ts` - Webhook handler

---

## Database Schema

### Core Tables

```sql
-- Users
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  role VARCHAR DEFAULT 'user',
  subscription_tier VARCHAR,
  created_at TIMESTAMP
)

-- Course Enrollments
course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  course_id VARCHAR,
  status VARCHAR,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP
)

-- Byzantine Council Sessions
byzantine_council_sessions (
  id SERIAL PRIMARY KEY,
  report_id INTEGER,
  status VARCHAR,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
)

-- Council Votes
byzantine_council_votes (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES byzantine_council_sessions,
  agent_id INTEGER,
  decision VARCHAR,
  confidence DECIMAL,
  reasoning TEXT,
  created_at TIMESTAMP
)

-- Compliance Reports
compliance_reports (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER,
  framework VARCHAR,
  status VARCHAR,
  score INTEGER,
  created_at TIMESTAMP
)

-- Certifications
certifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  course_id VARCHAR,
  certificate_number VARCHAR UNIQUE,
  issued_at TIMESTAMP,
  expires_at TIMESTAMP
)
```

---

## API Design

### tRPC Routers

```typescript
// Router structure
appRouter = {
  users: userRouter,
  courses: courseRouter,
  compliance: complianceRouter,
  byzantineRealtime: byzantineRouter,
  certificates: certificateRouter,
  notifications: notificationRouter,
  stripe: stripeRouter,
}
```

### REST Endpoints

```
GET  /api/health           - Health check
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
GET  /api/verify/:id       - Certificate verification
POST /api/stripe/webhook   - Stripe webhooks
```

### WebSocket Events

```typescript
// Client → Server
{ type: 'subscribe', sessionId: string }
{ type: 'unsubscribe', sessionId: string }

// Server → Client
{ type: 'vote', vote: VoteData }
{ type: 'session_complete', result: SessionResult }
{ type: 'notification', notification: NotificationData }
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Server validates and generates JWT
3. JWT stored in httpOnly cookie
4. Each request includes JWT
5. Server validates JWT on protected routes
```

### Authorization Levels

| Role | Permissions |
|------|-------------|
| user | View courses, enroll, take exams |
| admin | All user + manage content |
| enterprise | All admin + API access |
| superadmin | Full system access |

### Security Measures

- **HTTPS** - All traffic encrypted
- **JWT** - Stateless authentication
- **CORS** - Restricted origins
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Zod schemas
- **SQL Injection** - Parameterized queries
- **XSS Protection** - Content sanitization
- **CSRF Tokens** - Form protection

---

## Performance Considerations

### Caching Strategy

```typescript
// Query caching
queryCache.wrap(key, fetchFn, ttl)

// Cache invalidation
invalidateUserCaches(userId)
invalidateComplianceCaches(reportId)
```

### Database Optimization

- Connection pooling (max 20 connections)
- Indexed columns for frequent queries
- Pagination for large datasets
- Query result caching

### Frontend Optimization

- Code splitting by route
- Lazy loading of components
- Image optimization
- Bundle size monitoring

---

## Monitoring & Observability

### Logging

```typescript
// Structured logging
logger.info('User enrolled', {
  userId: 123,
  courseId: 'eu-ai-act',
  timestamp: new Date()
});
```

### Error Tracking

```typescript
// Sentry integration
Sentry.captureException(error, {
  extra: { userId, action }
});
```

### Metrics

- Request latency
- Error rates
- Database query times
- WebSocket connections
- Active users

---

## Deployment Architecture

### Production Setup

```
                    ┌─────────────┐
                    │   Cloudflare │
                    │     CDN      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │
                    │   (Proxy)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
       │   Node.js   │ │   Node.js   │ │   Node.js   │
       │  Instance 1 │ │  Instance 2 │ │  Instance 3 │
       └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │ PostgreSQL  │
                    │  (Primary)  │
                    └─────────────┘
```

---

## Future Considerations

1. **Microservices** - Split into separate services as scale increases
2. **GraphQL** - Consider for complex data requirements
3. **Redis** - Add for session storage and caching
4. **Kubernetes** - Container orchestration for scaling
5. **Event Sourcing** - For audit trail requirements

---

## References

- [React Documentation](https://react.dev)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
