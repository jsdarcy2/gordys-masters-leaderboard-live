
import React from "react";
import { Info, ExternalLink, Calendar, Signal, FileSpreadsheet } from "lucide-react";
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
      default:
        return dataSource;
    }
  };
  
  const getDataSourceLink = () => {
    return dataSource ? "https://www.masters.com/en_US/scores/index.html" : null;
  };
  
  const sourceLink = getDataSourceLink();
  const googleSheetLink = "https://docs.google.com/spreadsheets/d/1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o/edit?gid=2129153243#gid=2129153243";
  
  return (
    <div className="flex items-center gap-2 text-sm text-white/80">
      <div className="flex items-center">
        {errorMessage ? (
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
          
          {/* Google Sheets backup link */}
          <a 
            href={googleSheetLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-3 text-white/90 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded inline-flex items-center"
            title="Google Sheet Backup"
            onClick={(e) => e.stopPropagation()}
          >
            <FileSpreadsheet size={12} className="mr-1 text-masters-gold/90" />
            <span className="text-xs whitespace-nowrap">Google Sheet Backup</span>
          </a>
        </span>
      </div>
    </div>
  );
};

export default DataSourceInfo;
