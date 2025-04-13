
import React from "react";
import { BadgeCheck, AlertCircle, RefreshCcw } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { SPORTRADAR_API_KEY } from "@/services/api";

interface DataSourceBadgeProps {
  source: string;
  onRefresh?: () => void;
  className?: string;
}

const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ 
  source, 
  onRefresh,
  className = ""
}) => {
  if (!source || source === "loading") {
    return (
      <span className={`inline-flex items-center text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full ${className}`}>
        <RefreshCcw size={12} className="mr-1 animate-spin" />
        <span>Loading...</span>
      </span>
    );
  }
  
  // Check if the Sportradar API key is properly set
  const isSportradarKeyValid = SPORTRADAR_API_KEY && SPORTRADAR_API_KEY !== "key_not_set";
  
  // If source is sportradar but key is invalid, show warning
  if (source === "sportradar-api" && !isSportradarKeyValid) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className={`inline-flex items-center text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full ${className}`}>
              <AlertCircle size={12} className="mr-1" />
              <span>API Key Error</span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="max-w-xs text-sm p-2">
            <p>The Sportradar API key is not set properly. Please add a valid API key in the environment variables.</p>
            <button 
              onClick={onRefresh}
              className="mt-2 text-xs px-2 py-1 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 w-full"
            >
              <RefreshCcw size={12} className="inline mr-1" />
              Try Again
            </button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  switch (source) {
    case "sportradar-api":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className={`inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ${className}`}>
                <BadgeCheck size={12} className="mr-1" />
                <span>Sportradar Golf</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Using official Sportradar Golf API data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "cached-data":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className={`inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full ${className}`}>
                <span>Cached Data</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Using cached data from a previous fetch</p>
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className="mt-1 text-xs px-2 py-1 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 w-full"
                >
                  <RefreshCcw size={12} className="inline mr-1" />
                  Refresh Data
                </button>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "mock-data":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className={`inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full ${className}`}>
                <span>Mock Data</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Using simulated leaderboard data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return (
        <span className={`inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full ${className}`}>
          <span>{source}</span>
        </span>
      );
  }
};

export default DataSourceBadge;
