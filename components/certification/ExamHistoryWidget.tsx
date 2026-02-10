/**
 * ExamHistoryWidget Component
 * 
 * Displays recent exam attempts on the dashboard with scores and pass/fail status.
 */

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Trophy,
  TrendingUp,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface ExamAttempt {
  id: number;
  courseId: number;
  attemptNumber: number;
  percentageScore: string;
  passed: number;
  completedAt: string;
  courseName: string | null;
  framework: string | null;
}

interface CourseExamHistory {
  courseId: number;
  courseName: string | null;
  framework: string | null;
  attempts: ExamAttempt[];
  bestScore: number;
  hasPassed: boolean;
}

export function ExamHistoryWidget() {
  const { data: examHistory, isLoading, error } = trpc.examAttempts.getExamHistory.useQuery();

  if (isLoading) return <ExamHistoryWidgetSkeleton />;

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Exam History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load exam history.</p>
        </CardContent>
      </Card>
    );
  }

  const recentExams = examHistory?.slice(0, 3) || [];
  const totalPassed = examHistory?.filter((e: CourseExamHistory) => e.hasPassed).length || 0;
  const totalCourses = examHistory?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Exam History
            </CardTitle>
            {totalCourses > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {totalPassed}/{totalCourses} Passed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {recentExams.length === 0 ? (
            <EmptyExamState />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalCourses}</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{totalPassed}</div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {examHistory?.reduce((sum: number, e: CourseExamHistory) => sum + e.attempts.length, 0) || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Attempts</div>
                </div>
              </div>

              <div className="space-y-3">
                {recentExams.map((course: CourseExamHistory, index: number) => (
                  <ExamCourseCard key={course.courseId} course={course} index={index} />
                ))}
              </div>

              {totalCourses > 3 && (
                <Link href="/dashboard/exam-history">
                  <Button variant="ghost" className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    View All Exam History
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExamCourseCard({ course, index }: { course: CourseExamHistory; index: number }) {
  const latestAttempt = course.attempts[0];
  const score = Number(latestAttempt?.percentageScore || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className="bg-muted/30 rounded-lg p-3 border border-border/50 hover:border-border transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {course.hasPassed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            )}
            <h4 className="font-medium text-sm truncate">
              {course.courseName || 'Unknown Course'}
            </h4>
          </div>
          
          {course.framework && (
            <Badge variant="outline" className="text-xs mb-2">
              {course.framework}
            </Badge>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {course.attempts.length} attempt{course.attempts.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Best: {course.bestScore}%
            </span>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className={`text-lg font-bold ${
            course.hasPassed ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {score}%
          </div>
          <div className="text-xs text-muted-foreground">
            {latestAttempt?.completedAt 
              ? new Date(latestAttempt.completedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })
              : 'N/A'
            }
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <Progress value={score} className="h-1.5" />
      </div>
    </motion.div>
  );
}

function EmptyExamState() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <GraduationCap className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="font-medium text-foreground mb-1">No Exam Attempts Yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Complete your training modules to unlock certification exams.
      </p>
      <Link href="/training">
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Start Training
        </Button>
      </Link>
    </div>
  );
}

function ExamHistoryWidgetSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExamHistoryWidget;
