
import React from "react";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getWinnerTooltip } from "@/utils/leaderboardUtils";

interface WinnerIconsProps {
  position: number;
}

const WinnerIcons: React.FC<WinnerIconsProps> = ({ position }) => {
  const getWinnerIcon = (position: number) => {
    if (position === 1) {
      return <Trophy className="text-yellow-500" size={18} />;
    } else if (position === 2) {
      return <Medal className="text-gray-400" size={18} />;
    } else if (position === 3) {
      return <Award className="text-amber-700" size={18} />;
    }
    return null;
  };

  // Only show tooltips for top 3 positions
  if (position > 3) {
    return <>{position}</>;
  }

  const icon = getWinnerIcon(position);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <span>{position}</span>
            {icon && <span className="ml-1">{icon}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-white border border-masters-green">
          <p className="font-medium">Position {position}</p>
          <div className="text-sm">
            <p className="text-masters-green">{getWinnerTooltip(position).split('\n')[0]}</p>
            {getWinnerTooltip(position).includes('Masters Prize') && (
              <p className="text-purple-600">{getWinnerTooltip(position).split('\n')[1]}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WinnerIcons;
