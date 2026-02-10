/**
 * Certificate Verification Router
 * 
 * Provides a public API endpoint for third parties to verify
 * certificate authenticity using the certificate ID.
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { courseCertificates, courses, users } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

// Rate limiting map (in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  record.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(ip);
  }
}, 60 * 1000);

export interface CertificateVerificationResult {
  valid: boolean;
  status: 'valid' | 'expired' | 'revoked' | 'not_found' | 'expiring_soon';
  certificate?: {
    certificateId: string;
    holderName: string;
    courseName: string;
    framework: string | null;
    issuedAt: string;
    expiresAt: string | null;
    certificationLevel: string | null;
  };
  message: string;
  verifiedAt: string;
}

export const certificateVerificationRouter = router({
  /**
   * Public endpoint to verify a certificate by its ID
   */
  verify: publicProcedure
    .input(z.object({ certificateId: z.string().min(1).max(100) }))
    .query(async ({ input, ctx }): Promise<CertificateVerificationResult> => {
      const clientIp = (ctx.req?.headers?.['x-forwarded-for'] as string) || 
                       ctx.req?.socket?.remoteAddress || 'unknown';
      
      if (!checkRateLimit(clientIp)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const db = await getDb();
      if (!db) {
        return {
          valid: false,
          status: 'not_found',
          message: 'Service temporarily unavailable',
          verifiedAt: new Date().toISOString(),
        };
      }

      const [certificate] = await db
        .select({
          id: courseCertificates.id,
          certificateId: courseCertificates.certificateId,
          userId: courseCertificates.userId,
          courseId: courseCertificates.courseId,
          issuedAt: courseCertificates.issuedAt,
          expiresAt: courseCertificates.expiresAt,
          status: courseCertificates.status,
          userName: users.name,
          courseName: courses.title,
          framework: courses.framework,
        })
        .from(courseCertificates)
        .innerJoin(users, eq(courseCertificates.userId, users.id))
        .leftJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(eq(courseCertificates.certificateId, input.certificateId))
        .limit(1);

      if (!certificate) {
        return {
          valid: false,
          status: 'not_found',
          message: 'Certificate not found. Please verify the certificate ID is correct.',
          verifiedAt: new Date().toISOString(),
        };
      }

      const now = new Date();
      const expiresAt = certificate.expiresAt ? new Date(certificate.expiresAt) : null;
      const isExpired = expiresAt && expiresAt < now;
      const isExpiringSoon = expiresAt && !isExpired && 
        (expiresAt.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000;

      if (certificate.status === 'revoked') {
        return {
          valid: false,
          status: 'revoked',
          message: 'This certificate has been revoked and is no longer valid.',
          verifiedAt: new Date().toISOString(),
        };
      }

      if (isExpired || certificate.status === 'expired') {
        return {
          valid: false,
          status: 'expired',
          certificate: {
            certificateId: certificate.certificateId,
            holderName: certificate.userName || 'Unknown',
            courseName: certificate.courseName || 'Unknown Course',
            framework: certificate.framework,
            issuedAt: certificate.issuedAt,
            expiresAt: certificate.expiresAt,
            certificationLevel: 'Foundation',
          },
          message: 'This certificate has expired. The holder may need to recertify.',
          verifiedAt: new Date().toISOString(),
        };
      }

      return {
        valid: true,
        status: isExpiringSoon ? 'expiring_soon' : 'valid',
        certificate: {
          certificateId: certificate.certificateId,
          holderName: certificate.userName || 'Unknown',
          courseName: certificate.courseName || 'Unknown Course',
          framework: certificate.framework,
          issuedAt: certificate.issuedAt,
          expiresAt: certificate.expiresAt,
          certificationLevel: 'Foundation',
        },
        message: isExpiringSoon 
          ? 'Certificate is valid but will expire soon.' 
          : 'Certificate is valid and verified.',
        verifiedAt: new Date().toISOString(),
      };
    }),

  /**
   * Get verification statistics
   */
  getVerificationStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const [totalCerts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates);

    const [validCerts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(eq(courseCertificates.status, 'valid'));

    const [expiredCerts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(eq(courseCertificates.status, 'expired'));

    const [revokedCerts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseCertificates)
      .where(eq(courseCertificates.status, 'revoked'));

    return {
      totalCertificates: totalCerts?.count || 0,
      validCertificates: validCerts?.count || 0,
      expiredCertificates: expiredCerts?.count || 0,
      revokedCertificates: revokedCerts?.count || 0,
      lastUpdated: new Date().toISOString(),
    };
  }),
});
