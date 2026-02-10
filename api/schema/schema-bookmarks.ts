import { mysqlTable, int, varchar, timestamp, text, index } from "drizzle-orm/mysql-core";

/**
 * Course Bookmarks Schema
 * Allows users to bookmark specific sections within course modules for quick reference
 */
export const courseBookmarks = mysqlTable("course_bookmarks", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  courseId: int("course_id").notNull(),
  moduleId: int("module_id").notNull(),
  sectionId: varchar("section_id", { length: 100 }), // Optional: specific section within module
  sectionTitle: varchar("section_title", { length: 255 }), // Display title for the bookmark
  notes: text(), // Optional: user notes about the bookmark
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_bookmarks_user").on(table.userId),
  index("idx_bookmarks_course").on(table.courseId),
  index("idx_bookmarks_user_course").on(table.userId, table.courseId),
  index("idx_bookmarks_created").on(table.createdAt),
]);
