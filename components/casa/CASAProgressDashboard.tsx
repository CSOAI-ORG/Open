import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Award, Download, Share2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';

export function CASAProgressDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Fetch user progress
  const { data: userProgress, isLoading } = trpc.casaCurriculum.getUserProgress.useQuery();
  const { data: modules } = trpc.casaCurriculum.getModules.useQuery();

  // Calculate overall progress
  const overallProgress = userProgress?.completedModules.length 
    ? (userProgress.completedModules.length / 7) * 100 
    : 0;

  if (isLoading) {
    return <div className="text-center py-12">Loading your progress...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CASA Certification Progress</h1>
          <p className="text-xl text-gray-600">
            Your journey to becoming a Certified Augmented Safety Analyst
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Progress</span>
                <span className="text-3xl font-bold text-emerald-600">{Math.round(overallProgress)}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3 mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{userProgress?.completedModules.length || 0}</p>
                  <p className="text-sm text-gray-600">Modules Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{7 - (userProgress?.completedModules.length || 0)}</p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{userProgress?.certificateEarned ? '✓' : '—'}</p>
                  <p className="text-sm text-gray-600">Certificate Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules?.map((module: any, index: number) => {
            const isCompleted = userProgress?.completedModules.includes(module.id);
            const isLocked = index > (userProgress?.completedModules.length || 0);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isLocked ? 'opacity-60' : ''
                  } ${selectedModule === module.id ? 'ring-2 ring-emerald-500' : ''}`}
                  onClick={() => !isLocked && setSelectedModule(module.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-600 mb-1">Module {module.order}</p>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      {isCompleted && <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />}
                      {isLocked && <Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{module.duration} hours</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Module Details */}
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Module Details</CardTitle>
              </CardHeader>
              <CardContent>
                {modules?.find(m => m.id === selectedModule) && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      {modules.find(m => m.id === selectedModule)?.title}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Topics Covered</h4>
                        <ul className="space-y-2">
                          {modules.find((m: any) => m.id === selectedModule)?.topics.map((topic: any, i: number) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="h-2 w-2 bg-emerald-600 rounded-full mr-2" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                        <ul className="space-y-2">
                          {modules.find((m: any) => m.id === selectedModule)?.learningOutcomes.map((outcome: any, i: number) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Certificate Section */}
        {userProgress?.certificateEarned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-amber-600" />
                  Your CASA Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Congratulations! You've earned your CEASAI Certified Augmented Safety Analyst certificate.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Certificate
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  Verification Code: {userProgress?.certificateId}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA for Next Steps */}
        {!userProgress?.certificateEarned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">Ready to continue your journey?</h3>
                <p className="text-gray-600 mb-6">
                  Complete all 7 modules to earn your CASA certification and join thousands of certified analysts worldwide.
                </p>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Start Next Module
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
