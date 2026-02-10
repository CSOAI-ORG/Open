# Sentry Gmail Alerts Configuration Guide

## Overview

This guide explains how to configure Gmail email notifications for critical Sentry errors in the COAI Dashboard.

## Current Sentry Configuration

The backend Sentry integration is already configured in `server/_core/index.ts` with:

### Error Categories & Priorities

| Priority | Categories | Alert Behavior |
|----------|------------|----------------|
| **CRITICAL** | database, stripe, payment, authentication_system | Immediate alerts |
| **HIGH** | api_error, validation, rate_limit | Alert within hours |
| **MEDIUM** | user_error, configuration, unknown | Daily review |
| **LOW** | user_action, network, expected | Filtered (not sent to Sentry) |

### Error Tags

Each error sent to Sentry includes:
- `error_category`: The category of the error
- `error_priority`: critical, high, medium, or low
- `should_alert`: true or false

## Setting Up Gmail Alerts in Sentry

### Step 1: Access Sentry Dashboard

1. Go to [sentry.io](https://sentry.io) and log in
2. Navigate to your COAI Dashboard project

### Step 2: Configure Alert Rules

1. Go to **Alerts** → **Alert Rules**
2. Click **Create Alert Rule**

### Step 3: Create CRITICAL Priority Alert

**Alert Name:** CRITICAL - Immediate Gmail Notification

**Conditions:**
- When: An event is seen
- Filter: `tags.error_priority:critical`

**Actions:**
- Send email to: [your-email@gmail.com]
- Frequency: Every time

**Trigger:** Immediately

### Step 4: Create HIGH Priority Alert

**Alert Name:** HIGH - Hourly Gmail Digest

**Conditions:**
- When: An event is seen
- Filter: `tags.error_priority:high`

**Actions:**
- Send email to: [your-email@gmail.com]
- Frequency: Once per hour

### Step 5: Configure Email Settings

1. Go to **Settings** → **Notifications**
2. Add your Gmail address to the notification list
3. Verify the email address

## Alert Rule Examples

### Critical Database Errors
```
Filter: tags.error_category:database
Action: Send email immediately
```

### Payment/Stripe Errors
```
Filter: tags.error_category:payment OR tags.error_category:stripe
Action: Send email immediately
```

### API Rate Limiting
```
Filter: tags.error_category:rate_limit
Action: Send email every 15 minutes (to avoid spam)
```

## Testing Alerts

To test that alerts are working:

1. Trigger a test error in the application
2. Check Sentry dashboard for the error
3. Verify email notification was received

## Filtered Errors (Not Sent to Sentry)

The following errors are intentionally filtered to reduce noise:

- Connection reset errors (ECONNRESET)
- Unauthenticated access attempts ("Please login")
- Permission denied errors
- Payment plan not available errors
- TRPC UNAUTHORIZED/FORBIDDEN errors
- Network timeout errors (ETIMEDOUT, ECONNREFUSED)
- Safari polyfill errors

## Performance Monitoring

- **Production**: 10% trace sampling rate
- **Development**: 100% trace sampling rate

## Environment Variables

Ensure these are set:
- `SENTRY_DSN`: Your Sentry project DSN
- `VITE_SENTRY_DSN`: Frontend Sentry DSN
- `NODE_ENV`: production or development

## Troubleshooting

### Not Receiving Emails

1. Check spam folder
2. Verify email is added in Sentry notifications
3. Check alert rule is enabled
4. Verify error matches filter conditions

### Too Many Emails

1. Adjust alert frequency
2. Add more specific filters
3. Review error categories

### Missing Errors

1. Check if error is in filtered list
2. Verify SENTRY_DSN is correct
3. Check beforeSend filter logic
