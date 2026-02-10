import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { QuizQuestion, QuizAttempt, QuizResult } from '@/types/quiz';
import { PASSING_SCORE } from '@/types/quiz';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
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

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final score
      const allAttempts = [...attempts, {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer!,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      }];
      
      const score = allAttempts.filter(a => a.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= PASSING_SCORE;

      const finalResult: QuizResult = {
        score,
        totalQuestions: questions.length,
        percentage,
        passed,
        attempts: allAttempts,
      };

      setResult(finalResult);
      setQuizComplete(true);
      onComplete(finalResult);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAttempts([]);
    setQuizComplete(false);
    setResult(null);
  };

  if (quizComplete && result) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          {result.passed ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
                <p className="text-muted-foreground mt-2">
                  You passed the quiz with a score of {result.percentage}%
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>