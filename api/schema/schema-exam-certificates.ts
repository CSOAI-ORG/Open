 * Schema for Exam Attempts and Certificate Enhancements
 */

import { mysqlTable, int, timestamp, varchar, text, decimal, tinyint, json, index, mysqlEnum } from "drizzle-orm/mysql-core";

export const finalExamAttempts = mysqlTable("final_exam_attempts", {
  id: int().autoincrement().notNull().primaryKey(),
  userId: int("user_id").notNull(),
  courseId: int("course_id").notNull(),
  attemptNumber: int("attempt_number").default(1).notNull(),
  score: int().notNull(),
  totalQuestions: int("total_questions").notNull(),
  correctAnswers: int("correct_answers").notNull(),
  percentageScore: decimal("percentage_score", { precision: 5, scale: 2 }).notNull(),
  passed: tinyint().default(0).notNull(),
  startedAt: timestamp("started_at", { mode: 'string' }).notNull(),
  completedAt: timestamp("completed_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  timeSpentSeconds: int("time_spent_seconds").default(0).notNull(),
  answers: json().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
  index("idx_final_exam_userId").on(table.userId),
  index("idx_final_exam_courseId").on(table.courseId),
  index("idx_final_exam_userId_courseId").on(table.userId, table.courseId),
  index("idx_final_exam_passed").on(table.passed),
]);

export const examAttemptLimits = mysqlTable("exam_attempt_limits", {
  id: int().autoincrement().notNull().primaryKey(),
  courseId: int("course_id").notNull(),
  maxAttempts: int("max_attempts").default(3).notNull(),
  cooldownHours: int("cooldown_hours").default(24).notNull(),
  passingScore: int("passing_score").default(70).notNull(),
  isActive: tinyint("is_active").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_exam_limits_courseId").on(table.courseId),
]);

export const certificateValidityConfig = mysqlTable("certificate_validity_config", {
  id: int().autoincrement().notNull().primaryKey(),
  courseId: int("course_id"),
  framework: varchar({ length: 100 }),
  validityPeriodDays: int("validity_period_days").default(730).notNull(),
  renewalReminderDays: varchar("renewal_reminder_days", { length: 100 }).default('30,14,7').notNull(),
  requiresRecertification: tinyint("requires_recertification").default(1).notNull(),
  recertificationDiscountPercent: int("recertification_discount_percent").default(50).notNull(),
  isActive: tinyint("is_active").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_cert_validity_courseId").on(table.courseId),
  index("idx_cert_validity_framework").on(table.framework),
]);

export const certificateRenewalReminders = mysqlTable("certificate_renewal_reminders", {
  id: int().autoincrement().notNull().primaryKey(),
  certificateId: int("certificate_id").notNull(),
  userId: int("user_id").notNull(),
  reminderType: mysqlEnum("reminder_type", ['30_days', '14_days', '7_days', 'expired']).notNull(),
  sentAt: timestamp("sent_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  emailId: varchar("email_id", { length: 255 }),
  opened: tinyint().default(0).notNull(),
  clicked: tinyint().default(0).notNull(),
},
(table) => [
  index("idx_renewal_certificateId").on(table.certificateId),
  index("idx_renewal_userId").on(table.userId),
  index("idx_renewal_type").on(table.reminderType),
]);

export const userCertificateGallerySettings = mysqlTable("user_certificate_gallery_settings", {
  id: int().autoincrement().notNull().primaryKey(),
  userId: int("user_id").notNull(),
  isPublic: tinyint("is_public").default(1).notNull(),
  publicSlug: varchar("public_slug", { length: 100 }),
  displayName: varchar("display_name", { length: 255 }),
  bio: text(),
  linkedInUrl: varchar("linkedin_url", { length: 500 }),
  showExamScores: tinyint("show_exam_scores").default(0).notNull(),
  showCompletionDates: tinyint("show_completion_dates").default(1).notNull(),
  showExpirationDates: tinyint("show_expiration_dates").default(1).notNull(),
  theme: mysqlEnum(['default', 'professional', 'minimal', 'dark']).default('default').notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_gallery_userId").on(table.userId),
  index("idx_gallery_publicSlug").on(table.publicSlug),
]);

export const certificateRecertifications = mysqlTable("certificate_recertifications", {
  id: int().autoincrement().notNull().primaryKey(),