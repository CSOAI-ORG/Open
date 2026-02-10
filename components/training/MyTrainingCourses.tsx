import { Book, Clock, Award, Play, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/data/courses';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';

export default function MyTrainingCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch enrolled courses with progress
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/courses/with-enrollment/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          // Filter only enrolled courses and merge with static data
          const enrolled = data
            .filter((c: any) => c.isEnrolled)
            .map((apiCourse: any) => {
              const staticCourse = courses.find(sc => sc.id === apiCourse.id);
              const totalLessons = staticCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
              const progressPercent = apiCourse.progress || 0;
              const completedLessons = Math.round((progressPercent / 100) * totalLessons);
              
              return {
                ...staticCourse,
                ...apiCourse,
                totalLessons,
                completedLessons,
                progressPercent,
                lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              };
            });
          setEnrolledCourses(enrolled);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const inProgress = enrolledCourses.filter(c => c.progressPercent > 0 && c.progressPercent < 100);
  const completed = enrolledCourses.filter(c => c.progressPercent === 100);
  const notStarted = enrolledCourses.filter(c => c.progressPercent === 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
          <div className="container py-12">
            <h1 className="text-4xl font-bold mb-4">My Courses</h1>
            <p className="text-lg text-muted-foreground">
              Track your learning progress and continue where you left off
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b bg-card">
          <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Book className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Courses</span>
                </div>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <p className="text-3xl font-bold">{inProgress.length}</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <p className="text-3xl font-bold">{completed.length}</p>
              </Card>