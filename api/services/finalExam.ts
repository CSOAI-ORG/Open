/**
 * Final Exam Question Generator
 * 
 * Generates final exam questions by combining questions from all course modules.
 */

import type { QuizQuestion } from '@/types/quiz';
import { getModuleQuiz } from './index';

/**
 * Get all quiz questions for a course's final exam
 * @param courseId - The course ID
 * @param moduleCount - Number of modules in the course
 * @returns Array of arrays, each containing questions for one module
 */
export function getFinalExamQuestions(
  courseId: number,
  moduleCount: number
): QuizQuestion[][] {
  const moduleQuizzes: QuizQuestion[][] = [];
  
  for (let i = 0; i < moduleCount; i++) {
    const quiz = getModuleQuiz(courseId, i);
    if (quiz && quiz.length > 0) {
      moduleQuizzes.push(quiz);
    }
  }
  
  return moduleQuizzes;
}

/**
 * Check if a course has enough questions for a final exam
 * @param courseId - The course ID
 * @param moduleCount - Number of modules in the course
 * @param minQuestionsPerModule - Minimum questions needed per module (default: 2)
 * @returns True if enough questions exist
 */
export function hasFinalExamQuestions(
  courseId: number,
  moduleCount: number,
  minQuestionsPerModule: number = 2
): boolean {
  let modulesWithEnoughQuestions = 0;
  
  for (let i = 0; i < moduleCount; i++) {
    const quiz = getModuleQuiz(courseId, i);
    if (quiz && quiz.length >= minQuestionsPerModule) {
      modulesWithEnoughQuestions++;
    }
  }
  
  // Need at least half the modules to have enough questions
  return modulesWithEnoughQuestions >= Math.ceil(moduleCount / 2);
}
