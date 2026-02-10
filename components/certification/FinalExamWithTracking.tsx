/**
 * Final Exam Component with Attempt Tracking
 * 
 * A comprehensive exam that combines questions from all course modules.
 * Tracks attempts in the database and enforces retry limits.
 */

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award,
  Clock,
  AlertTriangle,
  Timer,
  History,
  Lock
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { formatDistanceToNow } from 'date-fns';
import type { QuizQuestion, QuizAttempt, QuizResult } from '@/types/quiz';
import { ExamHistory } from './ExamHistory';

const QUESTIONS_PER_MODULE = 2;

interface FinalExamWithTrackingProps {
  courseId: number;
  courseName: string;
  moduleQuizzes: QuizQuestion[][];
  onComplete: (result: QuizResult & { examScore: number; attemptId?: number }) => void;
  onCancel?: () => void;
}

export function FinalExamWithTracking({ 
  courseId, 
  courseName, 
  moduleQuizzes, 
  onComplete,
  onCancel 
}: FinalExamWithTrackingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [examComplete, setExamComplete] = useState(false);
  const [result, setResult] = useState<(QuizResult & { examScore: number; attemptId?: number }) | null>(null);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch attempt data
  const { 
    data: attemptData, 
    isLoading: isLoadingAttempts,
    refetch: refetchAttempts 
  } = trpc.examAttempts.getUserAttempts.useQuery({ courseId });

  // Submit attempt mutation
  const submitAttemptMutation = trpc.examAttempts.submitAttempt.useMutation({
    onSuccess: (data) => {
      refetchAttempts();
    },
  });

  const passingScore = attemptData?.passingScore ?? 70;

  // Generate final exam questions by selecting random questions from each module
  const examQuestions = useMemo(() => {
    const questions: QuizQuestion[] = [];
    
    moduleQuizzes.forEach((moduleQuiz, moduleIndex) => {
      if (moduleQuiz && moduleQuiz.length > 0) {
        const shuffled = [...moduleQuiz].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_MODULE, shuffled.length));
        
        selected.forEach(q => {
          questions.push({
            ...q,
            id: `m${moduleIndex}-${q.id}`,
          });
        });
      }
    });
    
    return questions.sort(() => Math.random() - 0.5);
  }, [moduleQuizzes]);

  const currentQuestion = examQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / examQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
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

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      const allAttempts = [...attempts, {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer!,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      }];
      
      const score = allAttempts.filter(a => a.isCorrect).length;
      const percentage = Math.round((score / examQuestions.length) * 100);
      const passed = percentage >= passingScore;
      const timeSpentSeconds = Math.round((Date.now() - (examStartTime || Date.now())) / 1000);

      // Submit to backend
      try {
        const submitResult = await submitAttemptMutation.mutateAsync({
          courseId,
          score,
          totalQuestions: examQuestions.length,
          correctAnswers: score,
          percentageScore: percentage,
          passed,
          startedAt: new Date(examStartTime || Date.now()).toISOString(),
          timeSpentSeconds,
          answers: allAttempts.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect: a.isCorrect,
          })),
        });

        const finalResult = {
          score,
          totalQuestions: examQuestions.length,
          percentage,
          passed,
          attempts: allAttempts,
          examScore: percentage,
          timeTaken: Math.round(timeSpentSeconds / 60),
          attemptId: submitResult.attemptId,
        };

        setResult(finalResult);
        setExamComplete(true);
        onComplete(finalResult);
      } catch (error) {
        console.error('Failed to submit exam attempt:', error);
        // Still show result even if submission fails
        const finalResult = {
          score,
          totalQuestions: examQuestions.length,
          percentage,
          passed,
          attempts: allAttempts,
          examScore: percentage,
          timeTaken: Math.round(timeSpentSeconds / 60),
        };
        setResult(finalResult);
        setExamComplete(true);
        onComplete(finalResult);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleStartExam = () => {
    setExamStartTime(Date.now());
    setExamStarted(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAttempts([]);
    setExamComplete(false);
    setResult(null);
    setExamStartTime(Date.now());
  };

  // Loading state
  if (isLoadingAttempts) {
    return (
      <Card className="p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  // Already passed
  if (attemptData?.hasPassed) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-12 h-12 text-white" />
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">Exam Already Passed!</h3>
            <p className="text-muted-foreground mt-2">
              You have already passed this exam and earned your certificate.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            View Exam History
          </Button>
          {showHistory && (
            <div className="mt-6">
              <ExamHistory courseId={courseId} courseName={courseName} />
            </div>
          )}
        </div>
      </Card>
    );
  }

  // No attempts remaining
  if (attemptData && attemptData.attemptsRemaining === 0) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-600">Maximum Attempts Reached</h3>
            <p className="text-muted-foreground mt-2">
              You have used all {attemptData.maxAttempts} attempts for this exam.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please contact support if you need additional attempts.
            </p>
          </div>
          <ExamHistory courseId={courseId} courseName={courseName} />
        </div>
      </Card>
    );
  }

  // Cooldown active
  if (attemptData && !attemptData.canRetake && attemptData.cooldownEndsAt) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
            <Timer className="w-10 h-10 text-amber-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-600">Cooldown Period</h3>
            <p className="text-muted-foreground mt-2">
              You can retake the exam {formatDistanceToNow(new Date(attemptData.cooldownEndsAt), { addSuffix: true })}
            </p>
          </div>
          <ExamHistory courseId={courseId} courseName={courseName} />
        </div>
      </Card>
    );
  }

  // Exam complete screen
  if (examComplete && result) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          {result.passed ? (
            <>
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600">Congratulations!</h3>
                <p className="text-lg text-muted-foreground mt-2">
                  You passed the final exam with <span className="font-bold text-green-600">{result.percentage}%</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You are now eligible to receive your certificate!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-600">Exam Not Passed</h3>
                <p className="text-lg text-muted-foreground mt-2">
                  You scored <span className="font-bold text-red-600">{result.percentage}%</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You need at least {passingScore}% to pass and receive your certificate.
                </p>
              </div>
            </>
          )}

          <div className="bg-muted p-6 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Score</span>
              <span className="font-bold">{result.score} / {result.totalQuestions} correct</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Percentage</span>
              <Badge variant={result.passed ? "default" : "destructive"}>
                {result.percentage}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Time Taken</span>
              <span className="font-medium">{result.timeTaken || 0} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Passing Score</span>
              <span className="font-medium">{passingScore}%</span>
            </div>
            {attemptData && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Attempts Remaining</span>
                <span className="font-medium">{attemptData.attemptsRemaining - 1}</span>
              </div>
            )}
          </div>

          {!result.passed && attemptData && attemptData.attemptsRemaining > 1 && (
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Retry Exam
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Review Course Material
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Exam intro screen (before starting)
  if (!examStarted) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">Final Certification Exam</h2>
            <p className="text-muted-foreground mt-2">{courseName}</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">Important Information</p>
                <ul className="mt-2 space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• This exam covers all {moduleQuizzes.length} modules</li>
                  <li>• Total questions: {examQuestions.length}</li>
                  <li>• Passing score: {passingScore}%</li>
                  <li>• Attempts remaining: {attemptData?.attemptsRemaining ?? 3}</li>
                  <li>• Maximum attempts: {attemptData?.maxAttempts ?? 3}</li>
                </ul>
              </div>
            </div>
          </div>

          {attemptData && attemptData.totalAttempts > 0 && (
            <div className="text-sm text-muted-foreground">
              You have made {attemptData.totalAttempts} attempt{attemptData.totalAttempts !== 1 ? 's' : ''} so far.
              <Button 
                variant="link" 
                className="px-1" 
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide' : 'View'} history
              </Button>
            </div>
          )}

          {showHistory && (
            <ExamHistory courseId={courseId} courseName={courseName} />
          )}

          <div className="flex gap-3 justify-center">
            <Button size="lg" onClick={handleStartExam}>
              {attemptData && attemptData.totalAttempts > 0 ? 'Retake Exam' : 'Start Exam'}
            </Button>
            {onCancel && (
              <Button variant="outline" size="lg" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Question screen
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2">Final Exam</Badge>
            <h3 className="text-lg font-semibold">{courseName}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {Math.round((Date.now() - (examStartTime || Date.now())) / 1000 / 60)} min
              </span>
            </div>
            {attemptData && (
              <div className="text-xs text-muted-foreground mt-1">
                Attempt {attemptData.totalAttempts + 1} of {attemptData.maxAttempts}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {examQuestions.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question */}
        <div className="pt-4">
          <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              
              let optionClass = 'border-border hover:border-primary/50 hover:bg-muted/50';
              if (showFeedback) {
                if (isCorrect) {
                  optionClass = 'border-green-500 bg-green-50 dark:bg-green-950/30';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-red-500 bg-red-50 dark:bg-red-950/30';
                }
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary/5';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showFeedback && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                      showFeedback && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                      isSelected ? 'border-primary bg-primary text-primary-foreground' :
                      'border-muted-foreground/30'
                    }`}>
                      {showFeedback && isCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : showFeedback && isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && currentQuestion.explanation && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === currentQuestion.correctAnswer 
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' 
              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
          }`}>
            <p className="text-sm">
              <span className="font-medium">Explanation: </span>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {!showFeedback ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {isLastQuestion ? 'Finish Exam' : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
