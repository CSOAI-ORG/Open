/**
 * Courses Page - Open-Source Training Catalog
 * Browse regional AI compliance courses - 100% free, no barriers to entry
 */

import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Award, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function Courses() {
  const searchString = useSearch();
  const urlParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const filterParam = urlParams.get('filter');
  
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<"fundamentals" | "advanced" | "specialist" | undefined>();
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>();
  const [priceFilter, setPriceFilter] = useState<"all" | "paid">(filterParam === "paid" ? "paid" : "all");
  // Update filter when URL changes
  useEffect(() => {
    if (filterParam === "paid") setPriceFilter("paid");
    else setPriceFilter("all");
  }, [filterParam]);

  // Fetch regions
  const { data: regions = [] } = trpc.courses.getRegions.useQuery();

  // Fetch courses with filters
  const { data: courses = [], isLoading: coursesLoading } = trpc.courses.getCatalog.useQuery({
    regionId: selectedRegion,
    level: selectedLevel,
    framework: selectedFramework,
  });


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">
              <Award className="w-4 h-4 mr-2" />
              Open-Source Training Platform
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Free AI Safety Training for Everyone
            </h1>
            <p className="text-lg text-emerald-100 mb-4">
              As the open-source FAA for AI, we believe safety education should be accessible to all.
              All courses are <strong>100% free</strong>—no paywalls, no hidden fees.
            </p>
            <p className="text-sm text-emerald-200 mb-4">
              100% open-source | No fees | No barriers to entry
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>7 Regional Frameworks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>Self-Paced Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>Free Certification Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Filter Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select
                value={selectedRegion?.toString()}
                onValueChange={(value) => setSelectedRegion(value === "all" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region: any) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level</label>
              <Select
                value={selectedLevel || "all"}
                onValueChange={(value: any) => setSelectedLevel(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="fundamentals">Fundamentals</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="specialist">Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Framework</label>
              <Select
                value={selectedFramework || "all"}
                onValueChange={(value) => setSelectedFramework(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Frameworks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="EU AI Act">EU AI Act</SelectItem>
                  <SelectItem value="NIST AI RMF">NIST AI RMF</SelectItem>
                  <SelectItem value="UK AI Safety">UK AI Safety</SelectItem>
                  <SelectItem value="Canada AIDA">Canada AIDA</SelectItem>
                  <SelectItem value="Australia AI Ethics">Australia AI Ethics</SelectItem>
                  <SelectItem value="ISO/IEC 42001">ISO/IEC 42001</SelectItem>
                  <SelectItem value="China TC260">China TC260</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value="free"
                onValueChange={() => {}}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Free" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">All Courses (FREE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Courses Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>

          {/* Individual Courses */}
          <div className="mt-2">
              {coursesLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="inline-block h-8 w-8 animate-spin text-emerald-600" />
                  <p className="mt-4 text-gray-600">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-gray-600">Try adjusting your filters</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses
                    .filter((course: any) => {
                      if (priceFilter === "paid") return !course.isFree && course.price > 0;
                      return true;
                    })
                    .sort((a: any, b: any) => {
                      // Show lower priced courses first (fundamentals before advanced)
                      return (a.price || 0) - (b.price || 0);
                    })
                    .map((course: any) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CourseCard({ course }: { course: any }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const enrollMutation = trpc.courses.enrollInCourse.useMutation();

  const handleEnroll = async () => {
    // Check if user is logged in first
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      console.log('[Frontend] handleEnroll started - FREE course', { courseId: course.id });
      
      const result = await enrollMutation.mutateAsync({
        courseId: course.id,
        paymentType: "one_time" as any,
      });

      console.log('[Frontend] Enrollment result:', result);
      toast.success("Successfully enrolled in free course!");
      setLocation("/my-courses");
    } catch (error: any) {
      console.error('[Frontend] Enrollment error:', error);
      if (error.message?.includes('login') || error.message?.includes('10001')) {
        setShowLoginDialog(true);
      } else {
        toast.error(error.message || "Failed to enroll in course");
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{course.name}</h3>
          <div className="flex gap-2 mb-2">
            <Badge variant="secondary">{course.level}</Badge>
            <Badge variant="outline">{course.framework}</Badge>
            <Badge className="bg-emerald-500 text-white">FREE</Badge>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{course.duration || 10}h</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{course.moduleCount || 0} modules</span>
        </div>
      </div>

      {/* Free Training Banner */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-1">FREE</div>
          <div className="text-sm text-muted-foreground">Training is 100% free</div>
          <div className="text-xs text-emerald-600 mt-2">Free certification after passing exam</div>
        </div>
      </div>

      <Button
        onClick={handleEnroll}
        disabled={enrollMutation.isPending}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
      >
        {enrollMutation.isPending ? "Enrolling..." : "Start Free Training"}
      </Button>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in to enroll in this course. If you don't have an account, you can create one for free.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setShowLoginDialog(false);
                setLocation("/login?redirect=/courses");
              }}
            >
              Log In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// BundleCard function removed - bundles are no longer used
// The 7 core modules are now all free with pay-what-you-can option
/*
*/
