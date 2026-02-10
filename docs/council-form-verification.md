# Council Application Form Verification

## Implementation Status: ✅ COMPLETE

### Form Location
- URL: /watchdog-signup#council-application
- Section: "Join the Byzantine Council" (Advanced Opportunity)

### Form Fields Verified
1. **Personal Information**
   - Full Name * (required)
   - Email Address * (required)
   - Organization (optional)
   - Job Title (optional)
   - Country (optional)
   - LinkedIn Profile URL (optional)

2. **Professional Background**
   - Experience Level (dropdown: Entry/Mid/Senior/Expert)
   - Areas of Expertise * (required, multi-select checkboxes):
     - EU AI Act Compliance
     - NIST AI Risk Management Framework
     - ISO/IEC 42001 AI Management
     - GDPR & Data Privacy
     - Algorithmic Bias Detection
     - AI Safety Testing & Red Teaming
     - AI Ethics & Governance
     - Technical AI Auditing
   - Relevant Certifications (optional)
   - Previous AI Audit Experience (optional)

3. **Motivation & Availability**
   - Why do you want to join the Council? * (required, min 100 chars)
   - Hours Available Per Week (dropdown)
   - How did you hear about us? (dropdown)
   - Terms and conditions checkbox * (required)

### Backend Implementation
- Router: councilApplicationsRouter in server/routers.ts
- Database table: council_applications
- Endpoints:
  - submit: Public mutation for form submission
  - getCount: Public query for application count
  - list: Protected (admin) query for listing applications
  - updateStatus: Protected (admin) mutation for status updates

### Form Features
- Email duplicate check
- Owner notification on new applications
- Form validation with Zod schema
- Success/error toast notifications

## Test Users Created: ✅ COMPLETE
- 20 test users created in database for WebSocket load testing
- Format: wstest_user_1@test.local through wstest_user_20@test.local
- All users have role: "user" and are verified

## DNS Configuration
- Cloudflare MCP doesn't have DNS management tools
- DNS records for Resend email verification need to be configured manually in Manus domain settings
