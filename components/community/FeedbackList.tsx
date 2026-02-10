import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Feedback {
  id: number;
  moduleId: string;
  userId: number;
  feedback: string;
  helpful: number;
  createdAt: string;
}

interface FeedbackListProps {
  moduleId: string;
  limit?: number;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ moduleId, limit = 5 }) => {
  const [offset, setOffset] = useState(0);

  const { data, isLoading, refetch } = trpc.moduleRatings.getModuleFeedback.useQuery({
    moduleId,
    limit,
    offset,
  });

  const markHelpfulMutation = trpc.moduleRatings.markFeedbackHelpful.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkHelpful = async (feedbackId: number, helpful: number) => {
    try {
      await markHelpfulMutation.mutateAsync({
        feedbackId,
        helpful,
      });
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to update feedback');
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Loading feedback...</div>;
  }

  if (!data || data.feedback.length === 0) {
    return <div className="text-center py-4 text-gray-500">No feedback yet</div>;
  }

  return (
    <div className="space-y-4">
      {data.feedback.map((item: Feedback) => (
        <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">{item.feedback}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMarkHelpful(item.id, 1)}
                className={item.helpful === 1 ? 'text-green-600' : 'text-gray-400'}
              >
                <ThumbsUp size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMarkHelpful(item.id, -1)}
                className={item.helpful === -1 ? 'text-red-600' : 'text-gray-400'}
              >
                <ThumbsDown size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {data.total > limit && (
        <div className="flex gap-2 justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= data.total}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
