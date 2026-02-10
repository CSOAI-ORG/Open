import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, index, boolean, json } from "drizzle-orm/mysql-core";

// ============================================
// NOTIFICATION SYSTEM
// ============================================

export const notifications = mysqlTable("notifications", {
  id: int().autoincrement().notNull().primaryKey(),
  userId: int().notNull(),
  type: mysqlEnum(['info', 'success', 'warning', 'error', 'alert']).default('info').notNull(),
  category: mysqlEnum(['system', 'report', 'compliance', 'council', 'user', 'marketing']).default('system').notNull(),
  title: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  description: text(),
  actionUrl: varchar({ length: 500 }), // Link to related resource
  actionLabel: varchar({ length: 100 }), // Text for action button
  icon: varchar({ length: 100 }), // Icon identifier
  metadata: json().$type<Record<string, any>>(), // Additional data (reportId, councilId, etc.)
  isRead: boolean().default(false).notNull(),
  isPinned: boolean().default(false).notNull(),
  readAt: timestamp({ mode: 'string' }),
  expiresAt: timestamp({ mode: 'string' }), // Auto-delete old notifications
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_userId").on(table.userId),
  index("idx_isRead").on(table.isRead),
  index("idx_category").on(table.category),
  index("idx_createdAt").on(table.createdAt),
  index("idx_userId_isRead").on(table.userId, table.isRead),
]);

export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int().autoincrement().notNull().primaryKey(),
  userId: int().notNull(),
  // Notification type preferences
  systemNotifications: boolean().default(true).notNull(),
  reportUpdates: boolean().default(true).notNull(),
  complianceAlerts: boolean().default(true).notNull(),
  councilDecisions: boolean().default(true).notNull(),
  userMentions: boolean().default(true).notNull(),
  marketingEmails: boolean().default(false).notNull(),
  // Delivery preferences
  emailNotifications: boolean().default(true).notNull(),
  inAppNotifications: boolean().default(true).notNull(),
  pushNotifications: boolean().default(false).notNull(),
  // Frequency preferences
  notificationFrequency: mysqlEnum(['instant', 'daily', 'weekly', 'never']).default('instant').notNull(),
  quietHoursEnabled: boolean().default(false).notNull(),
  quietHoursStart: varchar({ length: 5 }), // HH:MM format
  quietHoursEnd: varchar({ length: 5 }), // HH:MM format
  // Unsubscribe
  unsubscribedAt: timestamp({ mode: 'string' }),
  unsubscribeReason: text(),
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_userId").on(table.userId),
]);

export const notificationTemplates = mysqlTable("notification_templates", {
  id: int().autoincrement().notNull().primaryKey(),
  templateKey: varchar({ length: 100 }).notNull(), // e.g., "report_submitted", "council_decision"
  name: varchar({ length: 255 }).notNull(),
  category: mysqlEnum(['system', 'report', 'compliance', 'council', 'user', 'marketing']).notNull(),
  type: mysqlEnum(['info', 'success', 'warning', 'error', 'alert']).notNull(),
  title: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  description: text(),
  actionLabel: varchar({ length: 100 }),
  icon: varchar({ length: 100 }),
  variables: json().$type<string[]>().notNull(), // Template variables like {{reportId}}, {{userName}}
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
  index("idx_templateKey").on(table.templateKey),
  index("idx_category").on(table.category),
]);

export const notificationLogs = mysqlTable("notification_logs", {
  id: int().autoincrement().notNull().primaryKey(),
  notificationId: int().notNull(),
  userId: int().notNull(),
  status: mysqlEnum(['created', 'sent', 'delivered', 'read', 'failed']).default('created').notNull(),
  channel: mysqlEnum(['in_app', 'email', 'push']).notNull(),
  externalId: varchar({ length: 255 }), // For tracking in external systems
  errorMessage: text(),
  sentAt: timestamp({ mode: 'string' }),
  deliveredAt: timestamp({ mode: 'string' }),
  readAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
  index("idx_notificationId").on(table.notificationId),
  index("idx_userId").on(table.userId),
  index("idx_status").on(table.status),
  index("idx_channel").on(table.channel),
]);

// ============================================
// TYPE EXPORTS
// ============================================

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = typeof notificationTemplates.$inferInsert;

export type NotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationLog = typeof notificationLogs.$inferInsert;
