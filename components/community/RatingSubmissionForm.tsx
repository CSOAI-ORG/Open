import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface RatingSubmissionFormProps {
  moduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RatingSubmissionForm: React.FC<RatingSubmissionFormProps> = ({
  moduleId,
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const submitRatingMutation = trpc.moduleRatings.submitRating.useMutation();
  const submitFeedbackMutation = trpc.moduleRatings.submitFeedback.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      // Submit rating
      await submitRatingMutation.mutateAsync({
        moduleId,
        rating,
      });

      // Submit feedback if provided
      if (feedback.trim()) {
        await submitFeedbackMutation.mutateAsync({
          moduleId,
          feedback: feedback.trim(),
        });
      }

      toast.success('Thank you for your feedback!');
      setRating(0);
      setFeedback('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', error);
    }
  };

  const isSubmitting = submitRatingMutation.isPending || submitFeedbackMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate this module
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your feedback (optional)
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts about this module..."
          maxLength={1000}
          className="resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          {feedback.length}/1000 characters
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Send size={16} className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </div>
    </form>
  );
};
