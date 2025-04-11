
import React from "react";
import { Info, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataSourceInfoProps {
  dataSource?: string;
  lastUpdated: string;
  errorMessage?: string;
}

const DataSourceInfo: React.FC<DataSourceInfoProps> = ({ 
  dataSource, 
  lastUpdated,
  errorMessage
}) => {
  const formatLastUpdated = (timestamp: string): string => {
    if (!timestamp) return "Unknown";
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return "Unknown";
    }
  };
  
  const getDataSourceLabel = () => {
    if (!dataSource) return "Unknown";
    
    switch (dataSource.toLowerCase()) {
      case "espn":
        return "ESPN";
      case "masters.com":
        return "Masters.org";
      default:
        return dataSource;
    }
  };
  
  return (
    <div className="flex items-center gap-2 text-sm text-masters-yellow">
      <div className="flex items-center">
        {errorMessage ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle size={14} className="mr-1 text-amber-300" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Info size={14} className="mr-1" />
        )}
        <span>
          Data: <span className={dataSource?.toLowerCase() === "masters.com" ? "text-white font-medium" : ""}>
            {getDataSourceLabel()}
          </span> • Updated: {formatLastUpdated(lastUpdated)}
        </span>
      </div>
    </div>
  );
};

export default DataSourceInfo;
