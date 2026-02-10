 * Email Campaign Schema
 * Tables for managing bulk email campaigns with tracking and analytics
 */

import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, json, index } from "drizzle-orm/mysql-core";

// Email Campaigns table
export const emailCampaigns = mysqlTable("email_campaigns", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  subject: varchar({ length: 500 }).notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  fromName: varchar("from_name", { length: 255 }).default('CSOAI Team'),
  fromEmail: varchar("from_email", { length: 255 }).default('hello@csoai.org'),
  replyTo: varchar("reply_to", { length: 255 }),
  status: mysqlEnum(['draft', 'scheduled', 'sending', 'paused', 'completed', 'failed']).default('draft').notNull(),
  scheduledAt: timestamp("scheduled_at", { mode: 'string' }),
  startedAt: timestamp("started_at", { mode: 'string' }),
  completedAt: timestamp("completed_at", { mode: 'string' }),
  totalSent: int("total_sent").default(0),
  totalErrors: int("total_errors").default(0),
  tags: json(),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => [
  index("idx_campaign_status").on(table.status),
  index("idx_campaign_scheduled").on(table.scheduledAt),
]);

// Email Campaign Recipients table
export const emailCampaignRecipients = mysqlTable("email_campaign_recipients", {
  id: int().autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull(),
  email: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  metadata: json(),
  status: mysqlEnum(['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed']).default('pending').notNull(),
  messageId: varchar("message_id", { length: 255 }),
  sentAt: timestamp("sent_at", { mode: 'string' }),
  openedAt: timestamp("opened_at", { mode: 'string' }),
  clickedAt: timestamp("clicked_at", { mode: 'string' }),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => [
  index("idx_recipient_campaign").on(table.campaignId),
  index("idx_recipient_email").on(table.email),
  index("idx_recipient_status").on(table.status),
]);

// Email Unsubscribes table
export const emailUnsubscribes = mysqlTable("email_unsubscribes", {
  id: int().autoincrement().primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  reason: varchar({ length: 255 }),
  unsubscribedAt: timestamp("unsubscribed_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => [
  index("idx_unsubscribe_email").on(table.email),
]);
