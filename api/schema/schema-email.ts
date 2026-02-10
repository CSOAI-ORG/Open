import { mysqlTable, varchar, text, timestamp, boolean, int, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/**
 * Email Subscriber tracking
 */
export const emailSubscribers = mysqlTable(
  'email_subscribers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    subscriptionStatus: varchar('subscription_status', { length: 50 }).default('active'), // active, unsubscribed, bounced
    signupDate: timestamp('signup_date').defaultNow(),
    unsubscribeDate: timestamp('unsubscribe_date'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    statusIdx: index('status_idx').on(table.subscriptionStatus),
    signupDateIdx: index('signup_date_idx').on(table.signupDate),
  })
);

/**
 * Email sending history and tracking
 */
export const emailHistory = mysqlTable(
  'email_history',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    subscriberId: varchar('subscriber_id', { length: 36 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    templateId: varchar('template_id', { length: 100 }).notNull(),
    subject: varchar('subject', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).default('sent'), // sent, failed, bounced, opened, clicked
    messageId: varchar('message_id', { length: 255 }),
    sentAt: timestamp('sent_at').defaultNow(),
    openedAt: timestamp('opened_at'),
    clickedAt: timestamp('clicked_at'),
    error: text('error'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    subscriberIdx: index('subscriber_idx').on(table.subscriberId),
    emailIdx: index('email_idx').on(table.email),
    templateIdx: index('template_idx').on(table.templateId),
    statusIdx: index('status_idx').on(table.status),
    sentAtIdx: index('sent_at_idx').on(table.sentAt),
  })
);

/**
 * Email campaign tracking
 */
export const emailCampaigns = mysqlTable(
  'email_campaigns',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    templateId: varchar('template_id', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).default('draft'), // draft, scheduled, sent, paused
    totalRecipients: int('total_recipients').default(0),
    sentCount: int('sent_count').default(0),
    failedCount: int('failed_count').default(0),
    openCount: int('open_count').default(0),
    clickCount: int('click_count').default(0),
    scheduleTime: timestamp('schedule_time'),
    sentAt: timestamp('sent_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index('status_idx').on(table.status),
    templateIdx: index('template_idx').on(table.templateId),
    scheduleTimeIdx: index('schedule_time_idx').on(table.scheduleTime),
  })
);

/**
 * CASA course enrollment tracking
 */
export const casaEnrollments = mysqlTable(
  'casa_enrollments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    subscriberId: varchar('subscriber_id', { length: 36 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    enrollmentDate: timestamp('enrollment_date').defaultNow(),
    completedModules: varchar('completed_modules', { length: 500 }).default('[]'), // JSON array of module IDs
    currentModule: varchar('current_module', { length: 100 }),
    overallProgress: int('overall_progress').default(0), // 0-100
    certificateEarned: boolean('certificate_earned').default(false),
    certificateId: varchar('certificate_id', { length: 100 }),
    certificateDate: timestamp('certificate_date'),
    lastActivityDate: timestamp('last_activity_date').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    subscriberIdx: index('subscriber_idx').on(table.subscriberId),
    emailIdx: index('email_idx').on(table.email),
    certificateIdx: index('certificate_idx').on(table.certificateEarned),
    progressIdx: index('progress_idx').on(table.overallProgress),
  })
);

/**
 * Email preferences
 */
export const emailPreferences = mysqlTable(
  'email_preferences',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    subscriberId: varchar('subscriber_id', { length: 36 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull(),
    receiveNurtureEmails: boolean('receive_nurture_emails').default(true),
    receiveWeeklyDigest: boolean('receive_weekly_digest').default(true),
    receiveProductUpdates: boolean('receive_product_updates').default(true),
    receivePromotions: boolean('receive_promotions').default(false),
    receiveEventInvitations: boolean('receive_event_invitations').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    subscriberIdx: index('subscriber_idx').on(table.subscriberId),
  })
);

/**
 * Relations
 */
export const emailSubscribersRelations = relations(emailSubscribers, ({ many }) => ({
  emailHistory: many(emailHistory),
  casaEnrollment: many(casaEnrollments),
  emailPreferences: many(emailPreferences),
}));

export const emailHistoryRelations = relations(emailHistory, ({ one }) => ({
  subscriber: one(emailSubscribers, {
    fields: [emailHistory.subscriberId],
    references: [emailSubscribers.id],
  }),
}));

export const casaEnrollmentsRelations = relations(casaEnrollments, ({ one }) => ({
  subscriber: one(emailSubscribers, {
    fields: [casaEnrollments.subscriberId],
    references: [emailSubscribers.id],
  }),
}));

export const emailPreferencesRelations = relations(emailPreferences, ({ one }) => ({
  subscriber: one(emailSubscribers, {
    fields: [emailPreferences.subscriberId],
    references: [emailSubscribers.id],
  }),
}));
