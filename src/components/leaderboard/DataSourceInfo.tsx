
import React from "react";
import { Info, ExternalLink, Calendar, BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataSourceBadge from "./DataSourceBadge";

interface DataSourceInfoProps {
  dataSource?: string;
  lastUpdated: string;
  errorMessage?: string;
  tournamentYear?: string;
  hasLiveData?: boolean;
  onRefresh?: () => void;
}

const DataSourceInfo: React.FC<DataSourceInfoProps> = ({ 
  dataSource, 
  lastUpdated,
  errorMessage,
  tournamentYear,
  hasLiveData = false,
  onRefresh
}) => {
  const formatLastUpdated = (timestamp: string): string => {
    if (!timestamp) return "Just now";
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return "Just now";
    }
  };
  
  const getDataSourceLink = () => {
    return "https://developer.sportradar.com/docs/read/golf/Golf_v3";
  };
  
  const sourceLink = getDataSourceLink();
  
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This prevents the click from bubbling up to parent elements
  };
  
  // Always show the live signal for our hosted data
  const shouldShowLiveSignal = dataSource === "sportradar-api" || hasLiveData;
  
  return (
    <div className="flex items-center gap-2 text-sm text-white/90">
      <div className="flex items-center">
        {errorMessage ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="mr-1 text-white/70" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-10 bg-white border border-gray-200">
                <p className="max-w-xs">{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Info size={14} className="mr-1 text-white/70" />
        )}
        <span>
          <span className="text-white/70">Source:</span> 
          <span className="text-white font-medium ml-1">
            <DataSourceBadge source={dataSource || ""} onRefresh={onRefresh} className="bg-opacity-20" />
          </span> 
          
          {shouldShowLiveSignal && (
            <span className="ml-1.5 bg-green-500/20 text-white/95 text-xs px-1.5 py-0.5 rounded inline-flex items-center">
              <BadgeCheck size={12} className="mr-0.5 text-green-400" />
              LIVE
            </span>
          )}
          
          {tournamentYear && (
            <span className="ml-1.5 text-white/90">
              <Calendar size={12} className="inline mr-0.5" />
              {tournamentYear}
            </span>
          )}
          
          <span className="mx-1.5 text-white/50">•</span>
          
          <span className="text-white/70">Updated:</span> <span className="text-white/90">{formatLastUpdated(lastUpdated)}</span>
          
          {sourceLink && (
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 text-white/80 hover:text-white inline-flex items-center cursor-pointer"
              onClick={handleExternalClick}
            >
              <ExternalLink size={12} className="ml-0.5" />
            </a>
          )}
        </span>
      </div>
    </div>
  );
};

export default DataSourceInfo;
