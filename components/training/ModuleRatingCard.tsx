import React from 'react';
import { Star } from 'lucide-react';

interface ModuleRatingCardProps {
  averageRating: number;
  totalRatings: number;
  onRateClick?: () => void;
}

export const ModuleRatingCard: React.FC<ModuleRatingCardProps> = ({
  averageRating,
  totalRatings,
  onRateClick,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors cursor-pointer"
         onClick={onRateClick}>
      <div>
        {renderStars(averageRating)}
        <p className="text-sm text-gray-600 mt-1">
          {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </p>
      </div>
    </div>
  );
};
