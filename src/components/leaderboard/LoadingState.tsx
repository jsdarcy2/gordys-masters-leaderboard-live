
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  showPotentialWinnings: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ showPotentialWinnings }) => {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
          {showPotentialWinnings && (
            <Skeleton className="h-6 w-20" />
          )}
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
