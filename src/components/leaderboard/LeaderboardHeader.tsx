
import React from "react";
import { RefreshCcw, Clock, Save, Signal, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataSourceInfo from "./DataSourceInfo";
import { formatLastUpdated } from "@/utils/leaderboardUtils";

interface LeaderboardHeaderProps {
  lastUpdated: string;
  loading: boolean;
  refreshing: boolean;
  handleManualRefresh: () => void;
  showPotentialWinnings: boolean;
  togglePotentialWinnings: () => void;
  dataSource?: string;
  errorMessage?: string;
  tournamentYear?: string;
  hasLiveData?: boolean;
  dataHealth?: {
    status: "healthy" | "degraded" | "offline";
    message: string;
    timestamp: string;
  };
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  lastUpdated,
  loading,
  refreshing,
  handleManualRefresh,
  showPotentialWinnings,
  togglePotentialWinnings,
  dataSource,
  errorMessage,
  tournamentYear,
  hasLiveData = false,
  dataHealth
}) => {
  const renderHealthIndicator = () => {
    if (!dataHealth) return null;
    
    switch (dataHealth.status) {
      case "healthy":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-green-600/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <ShieldCheck size={12} className="mr-1" />
                  <span>HEALTHY</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{dataHealth.message}</p>
                <p className="text-xs opacity-70">Last checked: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "degraded":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-amber-500/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <ShieldAlert size={12} className="mr-1" />
                  <span>DEGRADED</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{dataHealth.message}</p>
                <p className="text-xs opacity-70">Last checked: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "offline":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-red-600/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <ShieldX size={12} className="mr-1" />
                  <span>OFFLINE</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{dataHealth.message}</p>
                <p className="text-xs opacity-70">Last checked: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-masters-green text-white">
      <div className="flex-1 mb-2 sm:mb-0">
        <h3 className="text-lg font-semibold mb-1 flex items-center">
          Tournament Leaderboard
          {hasLiveData && (
            <span className="ml-2 flex items-center text-sm bg-green-600/30 text-white px-2 py-0.5 rounded-full">
              <Signal size={12} className="mr-1 animate-pulse" />
              LIVE
            </span>
          )}
          {renderHealthIndicator()}
        </h3>
        
        <DataSourceInfo 
          dataSource={dataSource} 
          lastUpdated={lastUpdated} 
          errorMessage={errorMessage}
          tournamentYear={tournamentYear}
          hasLiveData={hasLiveData}
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center mr-2">
          <Label htmlFor="potential-toggle" className="mr-2 text-sm opacity-90">
            Potential Winnings
          </Label>
          <Switch 
            id="potential-toggle" 
            checked={showPotentialWinnings} 
            onCheckedChange={togglePotentialWinnings}
          />
        </div>
        
        <button 
          onClick={handleManualRefresh}
          disabled={loading || refreshing}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
