/**
 * Script to add the 7th module to courses that only have 6 modules
 * The 7th module will be a "Certification Exam Preparation" module
 */

import { getDb } from '../server/db';
import { courses } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

interface Module {
  title: string;
  durationMinutes: number;
}

// 7th module for each course
const seventhModules: Record<number, Module> = {
  100001: { title: "Certification Exam Preparation", durationMinutes: 60 },
  100002: { title: "Certification Exam Preparation", durationMinutes: 60 },
  100003: { title: "Certification Exam Preparation", durationMinutes: 60 },
  100004: { title: "Certification Exam Preparation", durationMinutes: 60 },
  100005: { title: "Certification Exam Preparation", durationMinutes: 60 },
  100007: { title: "Certification Exam Preparation", durationMinutes: 60 },
};

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  // Get all courses that need the 7th module
  const courseIds = Object.keys(seventhModules).map(Number);
  
  for (const courseId of courseIds) {
    // Get current course data
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    
    if (!course) {
      console.log(`Course ${courseId} not found`);
      continue;
    }

    const currentModules = (course.modules as Module[]) || [];
    
    // Check if already has 7 modules
    if (currentModules.length >= 7) {
      console.log(`Course ${courseId} (${course.title}) already has ${currentModules.length} modules`);
      continue;
    }

    // Add the 7th module
    const newModules = [...currentModules, seventhModules[courseId]];
    
    await db.update(courses)
      .set({ modules: newModules })
      .where(eq(courses.id, courseId));
    
    console.log(`Added 7th module to course ${courseId} (${course.title})`);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
