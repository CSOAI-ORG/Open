import React from 'react';
import { Star } from 'lucide-react';

interface AverageRatingDisplayProps {
  averageRating: number;
  totalRatings: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  showDistribution?: boolean;
}

export const AverageRatingDisplay: React.FC<AverageRatingDisplayProps> = ({
  averageRating,
  totalRatings,
  distribution,
  showDistribution = false,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const renderDistributionBar = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          {renderStars(averageRating)}
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {averageRating.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">
            {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>
      </div>

      {showDistribution && distribution && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 w-12">
                {stars} <Star size={14} className="inline" />
              </span>
              <div className="flex-1">
                {renderDistributionBar(distribution[stars as keyof typeof distribution], totalRatings)}
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {distribution[stars as keyof typeof distribution]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
