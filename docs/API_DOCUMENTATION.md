# COAI Dashboard API Documentation

**Version:** 2.0.0  
**Last Updated:** January 6, 2025  
**Author:** Manus AI

---

## Overview

The COAI Dashboard provides a comprehensive REST and tRPC API for AI compliance management, Byzantine Council voting, and enterprise integrations. This documentation covers authentication, available endpoints, rate limiting, and best practices for integration.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URLs](#base-urls)
3. [Rate Limiting](#rate-limiting)
4. [API Endpoints](#api-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Error Handling](#error-handling)
7. [SDK Examples](#sdk-examples)
8. [Webhooks](#webhooks)

---

## Authentication

The COAI API uses JWT (JSON Web Token) authentication. All API requests must include a valid access token in the Authorization header.

### Obtaining Access Tokens

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Using Access Tokens

Include the token in all subsequent requests:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh

Tokens expire after 24 hours. Refresh before expiration:

```bash
POST /api/auth/refresh
Authorization: Bearer <current-token>
```

---

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Production | `https://coai-dash-k34vnbtb.manus.space/api` |
| Development | `http://localhost:3000/api` |

---

## Rate Limiting

API requests are rate-limited to ensure fair usage and system stability.

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |
| Enterprise | 1,000 | Unlimited |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704556800
```

---

## API Endpoints

### Compliance Reports

#### Create Compliance Report

```bash
POST /api/trpc/complianceReports.create
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Q1 2024 AI Ethics Compliance Report",
  "framework": "EU AI Act",
  "organizationId": 1,
  "content": {
    "sections": [...],
    "attachments": [...]
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "id": 123,
      "title": "Q1 2024 AI Ethics Compliance Report",
      "status": "pending_review",
      "createdAt": "2024-01-06T10:00:00Z"
    }
  }
}
```

#### Get Report Status

```bash
GET /api/trpc/complianceReports.getById?input={"id":123}
Authorization: Bearer <token>
```

#### List Reports

```bash
GET /api/trpc/complianceReports.list?input={"limit":20,"offset":0,"status":"all"}
Authorization: Bearer <token>
```

### Byzantine Council

#### Start Voting Session

```bash
POST /api/trpc/byzantineRealtime.startSession
Content-Type: application/json
Authorization: Bearer <token>

{
  "reportId": 123,
  "urgency": "normal"
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "sessionId": "CS-2024-001",
      "status": "voting_in_progress",
      "totalAgents": 33,
      "votesRequired": 22,
      "estimatedCompletion": "2024-01-06T10:00:30Z"
    }
  }
}
```

#### Get Session Status

```bash
GET /api/trpc/byzantineRealtime.getSessionStatus?input={"sessionId":"CS-2024-001"}
Authorization: Bearer <token>
```

#### Get Voting Results

```bash
GET /api/trpc/byzantineRealtime.getResults?input={"sessionId":"CS-2024-001"}
Authorization: Bearer <token>
```

### PDCA Cycles

#### Create PDCA Cycle

```bash
POST /api/trpc/pdcaCycles.create
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Bias Mitigation Implementation",
  "framework": "NIST AI RMF",
  "plan": {
    "objectives": [...],
    "timeline": "2024-Q1"
  }
}
```

#### Update Cycle Phase

```bash
POST /api/trpc/pdcaCycles.updatePhase
Content-Type: application/json
Authorization: Bearer <token>

{
  "cycleId": 456,
  "phase": "do",
  "progress": 75,
  "notes": "Implementation 75% complete"
}
```

### Certificates

#### Generate Certificate

```bash
POST /api/trpc/certificates.generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "reportId": 123,
  "type": "compliance_certification"
}
```

#### Verify Certificate

```bash
GET /api/trpc/certificates.verify?input={"certificateNumber":"COAI-2024-001234"}
```

This endpoint is public and does not require authentication.

### Users & Organizations

#### Get User Profile

```bash
GET /api/trpc/users.getProfile
Authorization: Bearer <token>
```

#### Update Organization

```bash
POST /api/trpc/organizations.update
Content-Type: application/json
Authorization: Bearer <token>

{
  "id": 1,
  "name": "TechCorp Inc.",
  "settings": {
    "notificationPreferences": {...}
  }
}
```

---

## WebSocket Events

Connect to the WebSocket server for real-time updates:

```javascript
const ws = new WebSocket('wss://coai-dash-k34vnbtb.manus.space/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-jwt-token'
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

### Event Types

| Event Type | Description |
|------------|-------------|
| `voting_session_started` | New Byzantine Council voting session initiated |
| `vote_received` | Individual agent vote recorded |
| `consensus_reached` | Voting session completed with consensus |
| `compliance_update` | Report status changed |
| `notification` | User notification |

### Event Payload Example

```json
{
  "type": "vote_received",
  "data": {
    "sessionId": "CS-2024-001",
    "agentId": 5,
    "agentName": "Agent Alpha",
    "decision": "approve",
    "confidence": 0.95,
    "reasoning": "Strong data governance practices observed"
  },
  "timestamp": 1704556800000
}
```

---

## Error Handling

The API uses standard HTTP status codes and returns detailed error information.

### Error Response Format

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {
      "field": "authorization",
      "hint": "Please refresh your access token"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Retry Strategy

For transient errors (5xx, network issues), implement exponential backoff:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status < 500) throw new Error('Client error');
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

---

## SDK Examples

### Python

```python
import requests

class COAIClient:
    def __init__(self, api_key: str, base_url: str = "https://coai-dash-k34vnbtb.manus.space/api"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
    
    def create_report(self, title: str, framework: str, content: dict) -> dict:
        response = self.session.post(
            f"{self.base_url}/trpc/complianceReports.create",
            json={"title": title, "framework": framework, "content": content}
        )
        response.raise_for_status()
        return response.json()
    
    def get_report_status(self, report_id: int) -> dict:
        response = self.session.get(
            f"{self.base_url}/trpc/complianceReports.getById",
            params={"input": json.dumps({"id": report_id})}
        )
        response.raise_for_status()
        return response.json()
    
    def start_voting_session(self, report_id: int) -> dict:
        response = self.session.post(
            f"{self.base_url}/trpc/byzantineRealtime.startSession",
            json={"reportId": report_id}
        )
        response.raise_for_status()
        return response.json()

# Usage
client = COAIClient("your-api-key")
report = client.create_report(
    title="Q1 Compliance Report",
    framework="EU AI Act",
    content={"sections": [...]}
)
print(f"Report created: {report['result']['data']['id']}")
```

### JavaScript/TypeScript

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/routers';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://coai-dash-k34vnbtb.manus.space/api/trpc',
      headers: () => ({
        Authorization: `Bearer ${getToken()}`,
      }),
    }),
  ],
});

// Create a compliance report
const report = await client.complianceReports.create.mutate({
  title: 'Q1 Compliance Report',
  framework: 'EU AI Act',
  content: { sections: [...] },
});

// Start Byzantine Council voting
const session = await client.byzantineRealtime.startSession.mutate({
  reportId: report.id,
});

// Subscribe to real-time updates
const ws = new WebSocket('wss://coai-dash-k34vnbtb.manus.space/ws');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  if (update.type === 'vote_received') {
    console.log(`Agent ${update.data.agentName} voted: ${update.data.decision}`);
  }
};
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type COAIClient struct {
    APIKey  string
    BaseURL string
    Client  *http.Client
}

func NewCOAIClient(apiKey string) *COAIClient {
    return &COAIClient{
        APIKey:  apiKey,
        BaseURL: "https://coai-dash-k34vnbtb.manus.space/api",
        Client:  &http.Client{},
    }
}

func (c *COAIClient) CreateReport(title, framework string, content map[string]interface{}) (map[string]interface{}, error) {
    payload := map[string]interface{}{
        "title":     title,
        "framework": framework,
        "content":   content,
    }
    
    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", c.BaseURL+"/trpc/complianceReports.create", bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer "+c.APIKey)
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := c.Client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    return result, nil
}

func main() {
    client := NewCOAIClient("your-api-key")
    report, _ := client.CreateReport("Q1 Report", "EU AI Act", map[string]interface{}{})
    fmt.Printf("Report created: %v\n", report)
}
```

---

## Webhooks

Configure webhooks to receive real-time notifications about events in your COAI Dashboard.

### Webhook Configuration

```bash
POST /api/trpc/webhooks.create
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://your-server.com/webhooks/coai",
  "events": ["report.created", "voting.completed", "certificate.issued"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "id": "evt_123456",
  "type": "voting.completed",
  "data": {
    "sessionId": "CS-2024-001",
    "reportId": 123,
    "decision": "approved",
    "consensusPercentage": 84.8
  },
  "timestamp": "2024-01-06T10:00:30Z"
}
```

### Verifying Webhook Signatures

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

### Webhook Events

| Event | Description |
|-------|-------------|
| `report.created` | New compliance report submitted |
| `report.updated` | Report status changed |
| `voting.started` | Byzantine Council session initiated |
| `voting.completed` | Voting session concluded |
| `certificate.issued` | Compliance certificate generated |
| `user.created` | New user registered |

---

## Support

For API support and questions:

- **Documentation:** https://docs.councilof.ai
- **Email:** api-support@councilof.ai
- **Status Page:** https://status.councilof.ai

---

*This documentation is automatically generated and may be updated without notice. Always refer to the latest version.*
