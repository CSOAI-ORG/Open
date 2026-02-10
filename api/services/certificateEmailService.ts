/**
 * Certificate Email Service
 * 
 * Handles sending course completion certificates via email with PDF attachments.
 */

import { sendEmail } from '../emailService';

export interface CertificateEmailData {
  userEmail: string;
  userName: string;
  courseName: string;
  framework: string;
  certificateId: string;
  completionDate: Date;
  finalExamScore?: number;
  pdfBuffer: Buffer;
  verificationUrl: string;
}

/**
 * Send course completion certificate via email with PDF attachment
 */
export async function sendCertificateEmail(data: CertificateEmailData) {
  const {
    userEmail,
    userName,
    courseName,
    framework,
    certificateId,
    completionDate,
    finalExamScore,
    pdfBuffer,
    verificationUrl,
  } = data;

  const formattedDate = completionDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subject = `🎓 Your ${courseName} Certificate is Ready!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
        <div style="font-size: 60px; margin-bottom: 15px;">🎓</div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Certificate Awarded!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Congratulations on your achievement</p>
      </div>
      
      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px; margin: 0;">
        <p style="font-size: 18px; color: #374151; margin-bottom: 25px;">
          Dear ${userName},
        </p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
          We are thrilled to inform you that you have successfully completed the 
          <strong style="color: #059669;">${courseName}</strong> certification program! 🎉
        </p>
        
        <!-- Certificate Details Card -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 20px 0; color: #166534; font-size: 18px;">
            📜 Certificate Details
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Certificate ID:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right; font-family: monospace; font-size: 13px;">
                ${certificateId}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Course:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                ${courseName}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Framework:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                ${framework}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Completion Date:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                ${formattedDate}
              </td>
            </tr>
            ${finalExamScore ? `
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Final Exam Score:</td>
              <td style="padding: 10px 0; color: #059669; font-weight: 700; text-align: right; font-size: 18px;">
                ${finalExamScore}%
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <!-- PDF Attachment Notice -->
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>📎 Your certificate PDF is attached to this email.</strong><br>
            <span style="font-size: 13px;">Save it to your device or print it for your records.</span>
          </p>
        </div>
        
        <!-- Verification Link -->
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
            Employers and peers can verify your certificate at:
          </p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Verify Certificate
          </a>
        </div>
        
        <!-- Share Section -->
        <div style="background: #f0f9ff; border-radius: 12px; padding: 25px; margin-top: 30px; text-align: center;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1; font-size: 16px;">
            🌟 Share Your Achievement
          </h3>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
            Let your professional network know about your new certification!
          </p>
          <div style="display: inline-block;">
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}" 
               style="display: inline-block; background: #0A66C2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 0 5px;">
              Share on LinkedIn
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just earned my ${courseName} certification from CSOAI! 🎓 #AIGovernance #CSOAI`)}&url=${encodeURIComponent(verificationUrl)}" 
               style="display: inline-block; background: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 0 5px;">
              Share on X
            </a>
          </div>
        </div>
        
        <!-- Footer Message -->
        <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            Thank you for choosing CSOAI for your AI governance education. We're proud of your achievement and look forward to supporting your continued professional development.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Best regards,<br>
            <strong style="color: #111827;">The CSOAI Team</strong>
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #1f2937; color: #9ca3af; padding: 25px 30px; text-align: center; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">
          CSOAI - Council of AIs | AI Safety & Governance Platform
        </p>
        <p style="margin: 0;">
          © ${new Date().getFullYear()} CSOAI. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Congratulations, ${userName}!

You have successfully completed the ${courseName} certification program!

Certificate Details:
- Certificate ID: ${certificateId}
- Course: ${courseName}
- Framework: ${framework}
- Completion Date: ${formattedDate}
${finalExamScore ? `- Final Exam Score: ${finalExamScore}%` : ''}

Your certificate PDF is attached to this email.

Verify your certificate: ${verificationUrl}

Share your achievement on LinkedIn or Twitter to let your professional network know about your new certification!

Thank you for choosing CSOAI for your AI governance education.

Best regards,
The CSOAI Team
  `.trim();

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text,
    attachments: [
      {
        filename: `CSOAI-Certificate-${courseName.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
