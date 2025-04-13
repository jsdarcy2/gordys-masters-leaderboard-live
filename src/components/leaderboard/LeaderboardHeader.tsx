
import React from "react";
import { RefreshCcw, Calendar, Shield, BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataSourceInfo from "./DataSourceInfo";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeaderboardHeaderProps {
  lastUpdated: string;
  loading: boolean;
  refreshing?: boolean;
  handleManualRefresh?: () => void;
  onRefresh?: () => void;
  dataSource?: string;
  errorMessage?: string;
  tournamentYear?: string;
  hasLiveData?: boolean;
  dataHealth?: {
    status: "healthy" | "degraded" | "offline";
    message: string;
    timestamp: string;
  };
  criticalOutage?: boolean;
  tournamentActive?: boolean;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  lastUpdated,
  loading,
  refreshing = false,
  handleManualRefresh,
  onRefresh,
  dataSource,
  errorMessage,
  tournamentYear,
  hasLiveData = false,
  dataHealth,
  criticalOutage = false,
  tournamentActive = false
}) => {
  const isMobile = useIsMobile();
  const imageOpacity = isMobile ? "opacity-[0.07]" : "opacity-[0.12]";

  // Use a normal header even in "outage" mode
  if (criticalOutage) {
    return (
      <div className="p-3 md:p-4 relative overflow-hidden">
        {/* Masters celebration image as subtle background */}
        <div className={`absolute inset-0 ${imageOpacity} pointer-events-none`}>
          <img 
            src="/lovable-uploads/b64f5d80-01a5-4e5d-af82-1b8aea8cec9a.png" 
            alt="" 
            className="w-full h-full object-cover object-bottom"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-masters-green/90 pointer-events-none"></div>
        
        <div className="relative z-10 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <DataSourceInfo 
                dataSource={dataSource || "updating"} 
                lastUpdated={lastUpdated}
                errorMessage="Data refresh in progress"
                tournamentYear={tournamentYear}
                hasLiveData={false}
                onRefresh={onRefresh}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs bg-blue-500/30 text-white px-2 py-0.5 rounded-full ml-2">
                      <Shield size={12} className="mr-1" />
                      <span>UPDATING</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-10 bg-white border border-gray-200">
                    <p>Connection being reestablished</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center">
              <button 
                className="bg-white/10 hover:bg-white/20 rounded p-1.5 text-white cursor-pointer"
                onClick={handleManualRefresh}
                disabled={refreshing}
                aria-label="Refresh data"
              >
                <RefreshCcw 
                  size={18} 
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 relative overflow-hidden">
      {/* Masters celebration image as subtle background with enhanced bridge visibility */}
      <div className={`absolute inset-0 ${imageOpacity} pointer-events-none`}>
        <img 
          src="/lovable-uploads/b64f5d80-01a5-4e5d-af82-1b8aea8cec9a.png" 
          alt="" 
          className="w-full h-full object-cover object-bottom"
        />
      </div>
      
      {/* Gradient overlay adjusted for bridge visibility */}
      <div className="absolute inset-0 bg-masters-green/85 pointer-events-none"></div>
      
      <div className="relative z-10 text-white">
        <div className="flex flex-col md:flex-row justify-between gap-2 items-start md:items-center">
          <DataSourceInfo 
            dataSource={dataSource} 
            lastUpdated={lastUpdated}
            errorMessage={errorMessage}
            tournamentYear={tournamentYear}
            hasLiveData={hasLiveData}
            onRefresh={onRefresh}
          />
          
          <button 
            className="bg-white/10 hover:bg-white/20 rounded p-1.5 text-white cursor-pointer transition-colors"
            onClick={handleManualRefresh}
            disabled={refreshing}
            aria-label="Refresh data"
          >
            <RefreshCcw 
              size={18} 
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
