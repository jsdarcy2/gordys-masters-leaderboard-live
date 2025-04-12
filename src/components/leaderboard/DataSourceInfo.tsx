
import React from "react";
import { Info, AlertTriangle, ExternalLink, Calendar, Signal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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
      case "espn-api":
        return "ESPN Golf";
      case "sportsdata-api":
        return "Sports Data API";
      case "historical-data":
        return "Historical Data";
      case "cached-data":
        return "Recent Data";
      case "no-data":
        return "Updating";
      case "mock-data":
        return "Estimated Data";
      case "pgatour-api":
        return "PGA Tour";
      case "masters-scraper":
        return "Masters.com";
      case "masters-api":
        return "Masters.com API";
      case "fixed-data":
        return "Masters 2024";
      case "google-sheets":
        return "Live Tracker";
      default:
        return dataSource;
    }
  };
  
  const getDataSourceLink = () => {
    if (!dataSource) return null;
    
    const year = tournamentYear || new Date().getFullYear();
    
    switch (dataSource.toLowerCase()) {
      case "espn-api":
        return `https://www.espn.com/golf/${year}/masters/leaderboard`;
      case "pgatour-api":
        return `https://www.pgatour.com/leaderboard`;
      case "sportsdata-api":
      case "masters-scraper":
      case "masters-api":
        return `https://www.masters.com/en_US/scores/index.html`;
      case "historical-data":
      case "fixed-data":
        return `https://www.masters.com/en_US/scores/index.html`;
      case "google-sheets":
        return `https://www.masters.com/en_US/scores/index.html`;
      default:
        return null;
    }
  };
  
  const sourceLink = getDataSourceLink();
  
  return (
    <div className="flex items-center gap-2 text-sm text-white/80">
      <div className="flex items-center">
        {errorMessage && dataSource !== 'mock-data' && dataSource !== 'no-data' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="mr-1 text-white/60" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Info size={14} className="mr-1 text-white/60" />
        )}
        <span>
          <span className="text-white/60">Source:</span> <span className="text-white font-medium">
            {getDataSourceLabel()}
            {hasLiveData && (
              <Signal size={12} className="inline-block ml-1 text-green-400 animate-pulse" />
            )}
          </span> 
          {tournamentYear && (
            <span className="ml-1">
              <Calendar size={12} className="inline mr-0.5" />
              {tournamentYear}
            </span>
          )}
          <span> • </span>
          <span className="text-white/60">Updated:</span> {formatLastUpdated(lastUpdated)}
          
          {sourceLink && (
            <a 
              href={sourceLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 text-white/80 hover:text-white inline-flex items-center"
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
