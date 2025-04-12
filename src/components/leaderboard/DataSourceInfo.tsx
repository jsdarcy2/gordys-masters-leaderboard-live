
import React from "react";
import { Info, ExternalLink, Calendar, FileSpreadsheet, BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataSourceInfoProps {
  dataSource?: string;
  lastUpdated: string;
  errorMessage?: string;
  tournamentYear?: string;
  hasLiveData?: boolean;
}

const DataSourceInfo: React.FC<DataSourceInfoProps> = ({ 
  dataSource, 
  lastUpdated,
  errorMessage,
  tournamentYear,
  hasLiveData = false
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
  
  const getDataSourceLabel = () => {
    if (!dataSource) return "Updating";
    
    switch (dataSource.toLowerCase()) {
      case "cached-data":
        return "Recent Data";
      case "no-data":
        return "Updating";
      case "masters-scores-api":
        return "Masters Live Scores";
      case "mock-data":
        return "Masters Leaderboard";
      case "google-sheets":
        return "Google Sheets Data";
      default:
        return dataSource;
    }
  };
  
  const getDataSourceLink = () => {
    if (dataSource?.toLowerCase() === "google-sheets") {
      return "https://docs.google.com/spreadsheets/d/1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o/edit?gid=2129153243#gid=2129153243";
    }
    return "https://www.masters.com/en_US/scores/index.html";
  };
  
  const sourceLink = getDataSourceLink();
  const googleSheetLink = "https://docs.google.com/spreadsheets/d/1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o/edit?gid=2129153243#gid=2129153243";
  
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This prevents the click from bubbling up to parent elements
  };
  
  // Always show the live signal for our hosted data
  const shouldShowLiveSignal = dataSource === "masters-scores-api" || hasLiveData;
  
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
          <span className="text-white/70">Source:</span> <span className="text-white font-medium">
            {getDataSourceLabel()}
          </span> 
          
          {shouldShowLiveSignal && (
            <span className="ml-1.5 bg-green-500/20 text-white/95 text-xs px-1.5 py-0.5 rounded inline-flex items-center">
              <BadgeCheck size={12} className="mr-0.5 text-green-400" />
              LIVE
            </span>
          )}
          
          {dataSource?.toLowerCase() === "google-sheets" && (
            <span className="ml-1.5 bg-yellow-500/20 text-white/95 text-xs px-1.5 py-0.5 rounded inline-flex items-center">
              <FileSpreadsheet size={12} className="mr-0.5 text-yellow-300" />
              BACKUP
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
          
          {/* Only show Google Sheets backup link if we're not already using Google Sheets */}
          {dataSource?.toLowerCase() !== "google-sheets" && (
            <a 
              href={googleSheetLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-3 text-white/95 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded inline-flex items-center cursor-pointer"
              title="Google Sheet Backup"
              onClick={handleExternalClick}
            >
              <FileSpreadsheet size={12} className="mr-1 text-masters-gold/90" />
              <span className="text-xs whitespace-nowrap">Google Sheet Backup</span>
            </a>
          )}
        </span>
      </div>
    </div>
  );
};

export default DataSourceInfo;
