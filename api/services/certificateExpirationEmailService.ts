/**
 * Certificate Expiration Email Service
 * 
 * Handles sending automated reminder emails for expiring certificates
 * at 30, 14, and 7 days before expiration.
 */

import { Resend } from 'resend';
import { getDb } from '../db';
import { 
  courseCertificates, 
  courses, 
  users,
  certificateRenewalReminders 
} from '../../drizzle/schema';
import { eq, and, sql, isNotNull } from 'drizzle-orm';
import { emailPreferences } from '../../drizzle/schema-email-preferences';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'CSOAI <noreply@csoai.org>';
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'https://coai.manus.space';

export interface ExpirationEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

type ReminderType = '30_days' | '14_days' | '7_days' | 'expired';

/**
 * Get certificates expiring within a specific day range
 */
export async function getCertificatesExpiringInDays(daysFromNow: number): Promise<Array<{
  certificateId: number;
  certificateCode: string;
  userId: number;
  userEmail: string;
  userName: string;
  courseName: string;
  framework: string | null;
  expiresAt: string;
  daysUntilExpiry: number;
}>> {
  const db = await getDb();
  if (!db) return [];

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromNow);
  const targetDateStr = targetDate.toISOString().split('T')[0];
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  const certificates = await db
    .select({
      certificateId: courseCertificates.id,
      certificateCode: courseCertificates.certificateId,
      userId: courseCertificates.userId,
      userEmail: users.email,
      userName: users.name,
      courseName: courses.title,
      framework: courses.framework,
      expiresAt: courseCertificates.expiresAt,
    })
    .from(courseCertificates)
    .innerJoin(users, eq(courseCertificates.userId, users.id))
    .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
    .where(and(
      isNotNull(courseCertificates.expiresAt),
      sql`DATE(${courseCertificates.expiresAt}) >= ${targetDateStr}`,
      sql`DATE(${courseCertificates.expiresAt}) < ${nextDayStr}`,
      sql`${courseCertificates.status} != 'revoked'`
    ));

  return certificates.map(cert => ({
    ...cert,
    userEmail: cert.userEmail || '',
    userName: cert.userName || 'User',
    courseName: cert.courseName || 'Unknown Course',
    expiresAt: cert.expiresAt || '',
    daysUntilExpiry: daysFromNow,
  }));
}

/**
 * Check if a reminder has already been sent for a certificate
 */
export async function hasReminderBeenSent(
  certificateId: number, 
  reminderType: ReminderType
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [existing] = await db
    .select()
    .from(certificateRenewalReminders)
    .where(and(
      eq(certificateRenewalReminders.certificateId, certificateId),
      eq(certificateRenewalReminders.reminderType, reminderType)
    ))
    .limit(1);

  return !!existing;
}

/**
 * Record that a reminder was sent
 */
export async function recordReminderSent(
  certificateId: number,
  userId: number,
  reminderType: ReminderType,
  emailId?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(certificateRenewalReminders).values({
    certificateId,
    userId,
    reminderType,
    emailId: emailId || null,
  });

  const flagField = reminderType === '30_days' ? 'renewalReminderSent30' 
    : reminderType === '14_days' ? 'renewalReminderSent14' 
    : reminderType === '7_days' ? 'renewalReminderSent7' 
    : null;

  if (flagField) {
    await db
      .update(courseCertificates)
      .set({ [flagField]: 1 })
      .where(eq(courseCertificates.id, certificateId));
  }
}

/**
 * Send certificate expiration reminder email
 */
export async function sendExpirationReminderEmail(
  to: string,
  userName: string,
  certificateCode: string,
  courseName: string,
  framework: string | null,
  expiresAt: string,
  daysUntilExpiry: number
): Promise<ExpirationEmailResult> {
  try {
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const urgencyColor = daysUntilExpiry <= 7 ? '#dc2626' : daysUntilExpiry <= 14 ? '#f59e0b' : '#3b82f6';
    const urgencyText = daysUntilExpiry <= 7 ? 'URGENT' : daysUntilExpiry <= 14 ? 'IMPORTANT' : 'REMINDER';
    const urgencyEmoji = daysUntilExpiry <= 7 ? '🚨' : daysUntilExpiry <= 14 ? '⚠️' : '📅';

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${urgencyEmoji} ${urgencyText}: Your ${courseName} Certificate Expires in ${daysUntilExpiry} Days`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <div style="background: linear-gradient(135deg, ${urgencyColor} 0%, ${daysUntilExpiry <= 7 ? '#b91c1c' : daysUntilExpiry <= 14 ? '#d97706' : '#2563eb'} 100%); color: white; padding: 40px 30px; text-align: center;">
      <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 15px;">${urgencyText}</div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Certificate Expiring Soon</h1>
      <div style="font-size: 64px; font-weight: 800; margin: 15px 0;">${daysUntilExpiry}</div>
      <p style="margin: 0; font-size: 18px; opacity: 0.95;">days remaining</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: ${urgencyColor}; font-size: 22px; margin-top: 0;">Hi ${userName},</h2>
      
      <p>Your CSOAI certification is expiring soon. To maintain your credentials and continue demonstrating your AI safety expertise, we recommend renewing your certificate before it expires.</p>
      
      <div style="background: #f8f9fa; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">📜 Certificate Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Certificate ID:</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right; font-family: monospace;">${certificateCode}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Course:</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right;">${courseName}</td>
          </tr>
          ${framework ? `<tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Framework:</td><td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right;">${framework}</td></tr>` : ''}
        </table>
      </div>
      
      <div style="background: ${daysUntilExpiry <= 7 ? '#fef2f2' : daysUntilExpiry <= 14 ? '#fffbeb' : '#eff6ff'}; border: 2px solid ${urgencyColor}; border-radius: 8px; padding: 15px 20px; margin: 20px 0; text-align: center;">
        <strong style="color: ${urgencyColor}; font-size: 18px;">⏰ Expires: ${expirationDate}</strong>
      </div>
      
      <div style="background: #f0fdf4; border-radius: 8px; padding: 20px 25px; margin: 25px 0;">
        <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 16px;">✅ Why Renew?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #374151;">
          <li style="margin: 8px 0;">Maintain your verified AI Safety Analyst status</li>
          <li style="margin: 8px 0;">Keep your certificate valid for employers and clients</li>
          <li style="margin: 8px 0;">Stay current with the latest AI governance frameworks</li>
          <li style="margin: 8px 0;">Continue earning as a certified analyst ($45-150/hour)</li>
          <li style="margin: 8px 0;">Recertification discount available (50% off)</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${FRONTEND_URL}/dashboard/certificates" style="display: inline-block; background: ${urgencyColor}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0;">Renew Certificate Now →</a>
      </div>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        <strong>Note:</strong> After expiration, you'll need to retake the certification exam to restore your credentials.
      </p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb;">
      <p><strong>CSOAI - Council of AIs</strong></p>
      <p>AI Safety & Governance Platform</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This email was sent to ${to} because you have a certificate expiring soon.<br>
        <a href="${FRONTEND_URL}/settings/notifications" style="color: #10b981;">Manage email preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      console.error('[CertExpiration] Error sending reminder email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('[CertExpiration] Error sending reminder email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send reminder email' };
  }
}

/**
 * Check if user has opted out of expiration reminder emails
 */
export async function hasUserOptedOutOfReminders(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [prefs] = await db
    .select({ expirationRemindersEnabled: emailPreferences.expirationRemindersEnabled })
    .from(emailPreferences)
    .where(eq(emailPreferences.userId, userId))
    .limit(1);

  // If no preferences exist, default to opted-in (return false = not opted out)
  if (!prefs) return false;
  
  // Return true if user has disabled expiration reminders
  return prefs.expirationRemindersEnabled === 0;
}

/**
 * Process all certificates expiring at a specific day threshold
 */
export async function processExpirationReminders(daysFromNow: number): Promise<{
  processed: number;
  sent: number;
  skipped: number;
  skippedOptOut: number;
  errors: number;
}> {
  const reminderType: ReminderType = daysFromNow === 30 ? '30_days' 
    : daysFromNow === 14 ? '14_days' 
    : daysFromNow === 7 ? '7_days' 
    : '30_days';

  const certificates = await getCertificatesExpiringInDays(daysFromNow);
  
  let sent = 0;
  let skipped = 0;
  let skippedOptOut = 0;
  let errors = 0;

  for (const cert of certificates) {
    // Check if user has opted out of expiration reminders
    const optedOut = await hasUserOptedOutOfReminders(cert.userId);
    if (optedOut) {
      skippedOptOut++;
      continue;
    }

    const alreadySent = await hasReminderBeenSent(cert.certificateId, reminderType);
    if (alreadySent || !cert.userEmail) {
      skipped++;
      continue;
    }

    const result = await sendExpirationReminderEmail(
      cert.userEmail,
      cert.userName,
      cert.certificateCode,
      cert.courseName,
      cert.framework,
      cert.expiresAt,
      daysFromNow
    );

    if (result.success) {
      await recordReminderSent(cert.certificateId, cert.userId, reminderType, result.messageId);
      sent++;
    } else {
      errors++;
    }
  }

  console.log(`[CertExpiration] Processed ${daysFromNow}-day reminders: ${sent} sent, ${skipped} skipped (already sent), ${skippedOptOut} skipped (opted out), ${errors} errors`);
  return { processed: certificates.length, sent, skipped, skippedOptOut, errors };
}

/**
 * Run all expiration reminder checks (30, 14, 7 days)
 */
export async function runDailyExpirationCheck(): Promise<{
  thirtyDay: { processed: number; sent: number; skipped: number; skippedOptOut: number; errors: number };
  fourteenDay: { processed: number; sent: number; skipped: number; skippedOptOut: number; errors: number };
  sevenDay: { processed: number; sent: number; skipped: number; skippedOptOut: number; errors: number };
}> {
  console.log('[CertExpiration] Starting daily expiration check...');
  const thirtyDay = await processExpirationReminders(30);
  const fourteenDay = await processExpirationReminders(14);
  const sevenDay = await processExpirationReminders(7);
  console.log('[CertExpiration] Daily expiration check complete');
  return { thirtyDay, fourteenDay, sevenDay };
}
