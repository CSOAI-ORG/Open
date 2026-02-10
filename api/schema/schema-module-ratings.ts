import { mysqlTable, int, varchar, text, timestamp, index, tinyint } from "drizzle-orm/mysql-core"

export const moduleRatings = mysqlTable("module_ratings", {
  id: int().autoincrement().notNull().primaryKey(),
  moduleId: varchar({ length: 100 }).notNull(), // e.g., "ai-safety-foundations"
  userId: int().notNull(),
  rating: tinyint().notNull(), // 1-5 stars
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_moduleId").on(table.moduleId),
  index("idx_userId").on(table.userId),
  index("idx_moduleId_userId").on(table.moduleId, table.userId),
]);

export const moduleFeedback = mysqlTable("module_feedback", {
  id: int().autoincrement().notNull().primaryKey(),
  moduleId: varchar({ length: 100 }).notNull(),
  userId: int().notNull(),
  feedback: text().notNull(),
  helpful: int().default(0).notNull(), // 0 = neutral, 1 = helpful, -1 = not helpful
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_moduleId").on(table.moduleId),
  index("idx_userId").on(table.userId),
  index("idx_moduleId_userId").on(table.moduleId, table.userId),
  index("idx_createdAt").on(table.createdAt),
]);
