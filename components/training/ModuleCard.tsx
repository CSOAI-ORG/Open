import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ModuleRatingCard } from './ModuleRatingCard';
import { RatingSubmissionForm } from './RatingSubmissionForm';
import { FeedbackList } from './FeedbackList';
import { AverageRatingDisplay } from './AverageRatingDisplay';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Star } from 'lucide-react';

interface ModuleCardProps {
  num: number;
  title: string;
  icon: string;
  moduleId: string;
  itemVariants?: any;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  num,
  title,
  icon,
  moduleId,
  itemVariants = {},
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: ratingData, refetch: refetchRating } = trpc.moduleRatings.getAverageRating.useQuery({
    moduleId,
  });

  const { data: userRating } = trpc.moduleRatings.getUserRating.useQuery(
    { moduleId },
    { enabled: isAuthenticated }
  );

  const handleRatingSuccess = () => {
    setShowRatingForm(false);
    refetchRating();
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group">
      <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-400 bg-white hover:bg-emerald-50">
        <div className="text-4xl mb-3">{icon}</div>
        <div className="inline-block px-3 py-1 bg-emerald-100 rounded-full mb-3">
          <p className="text-emerald-700 font-bold text-xs">Module {num}</p>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">Learn industry-standard practices</p>

        {/* Rating Display */}
        {ratingData && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <ModuleRatingCard
              averageRating={ratingData.averageRating}
              totalRatings={ratingData.totalRatings}
              onRateClick={() => setShowRatingForm(true)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {isAuthenticated && (
            <>
              <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-emerald-300 hover:bg-emerald-50"
                  >
                    <Star size={16} className="mr-2" />
                    {userRating ? 'Update Rating' : 'Rate Module'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Rate "{title}"</DialogTitle>
                  </DialogHeader>
                  <RatingSubmissionForm
                    moduleId={moduleId}
                    onSuccess={handleRatingSuccess}
                    onCancel={() => setShowRatingForm(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-emerald-300 hover:bg-emerald-50"
                  >
                    View Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Module Feedback - {title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {ratingData && (
                      <AverageRatingDisplay
                        averageRating={ratingData.averageRating}
                        totalRatings={ratingData.totalRatings}
                        showDistribution={false}
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">User Reviews</h4>
                      <FeedbackList moduleId={moduleId} limit={5} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            Start Learning
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
