 * Final Exam Component
 * 
 * A comprehensive exam that combines questions from all course modules.
 * Users must pass with 70% to receive their certificate.
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award,
  Clock,
  AlertTriangle
} from 'lucide-react';
import type { QuizQuestion, QuizAttempt, QuizResult } from '@/types/quiz';

const FINAL_EXAM_PASSING_SCORE = 70;
const QUESTIONS_PER_MODULE = 2;

interface FinalExamProps {
  courseId: number;
  courseName: string;
  moduleQuizzes: QuizQuestion[][]; // Array of quiz questions for each module
  onComplete: (result: QuizResult & { examScore: number }) => void;
  onCancel?: () => void;
}

export function FinalExam({ 
  courseId, 
  courseName, 
  moduleQuizzes, 
  onComplete,
  onCancel 
}: FinalExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [examComplete, setExamComplete] = useState(false);
  const [result, setResult] = useState<(QuizResult & { examScore: number }) | null>(null);
  const [examStartTime] = useState(Date.now());
  const [examStarted, setExamStarted] = useState(false);

  // Generate final exam questions by selecting random questions from each module
  const examQuestions = useMemo(() => {
    const questions: QuizQuestion[] = [];
    
    moduleQuizzes.forEach((moduleQuiz, moduleIndex) => {
      if (moduleQuiz && moduleQuiz.length > 0) {
        // Shuffle and pick QUESTIONS_PER_MODULE questions from each module
        const shuffled = [...moduleQuiz].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_MODULE, shuffled.length));
        
        // Add module reference to each question
        selected.forEach(q => {
          questions.push({
            ...q,
            id: String(`m${moduleIndex}-${q.id}`), // Unique ID with module prefix
          });
        });
      }
    });
    
    // Shuffle all questions for the final exam
    return questions.sort(() => Math.random() - 0.5);
  }, [moduleQuizzes]);

  const currentQuestion = examQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / examQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number): void => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = (): void => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    };

    setAttempts([...attempts, attempt]);
    setShowFeedback(true);
  };

  const handleNextQuestion = (): void => {
    if (isLastQuestion) {
      // Calculate final score
      const allAttempts = [...attempts, {