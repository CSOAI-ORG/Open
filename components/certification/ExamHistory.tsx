import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, Clock, Award, ChevronRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { Link } from 'wouter';

export default function ExamHistory() {
  const { data: history, isLoading } = trpc.examAttempts.getExamHistory.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-20 bg-muted rounded" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Exam History</CardTitle>
          <CardDescription>Track your certification exam attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No exam attempts yet. Complete a course to take the final exam.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Exam History</CardTitle>
        <CardDescription>Track your certification exam attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {history.map((course: any) => (
            <AccordionItem key={course.courseId} value={`course-${course.courseId}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${course.hasPassed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {course.hasPassed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{course.courseName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {course.framework && <Badge variant="outline" className="text-xs">{course.framework}</Badge>}
                        <span>{course.attempts.length} attempt{course.attempts.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">Best: {course.bestScore}%</p>
                      <Badge variant={course.hasPassed ? 'default' : 'secondary'}>{course.hasPassed ? 'Passed' : 'In Progress'}</Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2 pb-4">
                  {course.attempts.map((attempt: any) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {attempt.passed === 1 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Attempt #{attempt.attemptNumber}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(attempt.completedAt), 'MMM d, yyyy h:mm a')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <Progress value={Number(attempt.percentageScore)} className="h-2" />
                        </div>
                        <Badge variant={attempt.passed === 1 ? 'default' : 'secondary'}>{Number(attempt.percentageScore)}%</Badge>
                      </div>
                    </div>
                  ))}
                  {!course.hasPassed && (
                    <Button asChild className="w-full mt-2">
                      <Link href={`/courses/${course.courseId}`}>
                        Continue Course <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
