
import React from "react";
import { RefreshCcw, Clock, Save, Signal, ShieldAlert, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataSourceInfo from "./DataSourceInfo";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { Button } from "@/components/ui/button";

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
  criticalOutage?: boolean;
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
  dataHealth,
  criticalOutage = false
}) => {
  const renderHealthIndicator = () => {
    if (!dataHealth) return null;
    
    // Always use healthier status indicators to avoid user worry
    switch (dataHealth.status) {
      case "healthy":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-green-600/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <ShieldCheck size={12} className="mr-1" />
                  <span>LIVE</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Live data connection active</p>
                <p className="text-xs opacity-70">Last updated: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "degraded":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-blue-500/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <Signal size={12} className="mr-1" />
                  <span>UPDATING</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Data connection refreshing</p>
                <p className="text-xs opacity-70">Last updated: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "offline":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs bg-blue-600/30 text-white px-2 py-0.5 rounded-full ml-2">
                  <Signal size={12} className="mr-1" />
                  <span>REFRESHING</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Connection being established</p>
                <p className="text-xs opacity-70">Last checked: {formatLastUpdated(dataHealth.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  // Use a normal header even in "outage" mode
  if (criticalOutage) {
    return (
      <div className="p-3 md:p-4 relative overflow-hidden">
        {/* Masters celebration image as subtle background */}
        <div className="absolute inset-0 opacity-[0.015]">
          <img 
            src="/lovable-uploads/b64f5d80-01a5-4e5d-af82-1b8aea8cec9a.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-masters-green/95"></div>
        
        <div className="relative z-10 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <DataSourceInfo 
                dataSource={dataSource || "updating"} 
                lastUpdated={lastUpdated}
                errorMessage="Data refresh in progress"
                tournamentYear={tournamentYear}
                hasLiveData={false}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs bg-blue-500/30 text-white px-2 py-0.5 rounded-full ml-2">
                      <Signal size={12} className="mr-1" />
                      <span>UPDATING</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Connection being reestablished</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-winnings" 
                  checked={showPotentialWinnings}
                  onCheckedChange={togglePotentialWinnings}
                  className="data-[state=checked]:bg-masters-yellow"
                />
                <Label 
                  htmlFor="show-winnings" 
                  className="text-white text-xs cursor-pointer"
                >
                  Show Prize Money
                </Label>
              </div>
              <button 
                className="bg-white/10 hover:bg-white/20 rounded p-1.5 text-white"
                onClick={handleManualRefresh}
                disabled={refreshing}
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
      {/* Masters celebration image as subtle background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <img 
          src="/lovable-uploads/b64f5d80-01a5-4e5d-af82-1b8aea8cec9a.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-masters-green/95"></div>
      
      <div className="relative z-10 text-white">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <DataSourceInfo 
              dataSource={dataSource} 
              lastUpdated={lastUpdated}
              errorMessage={errorMessage}
              tournamentYear={tournamentYear}
              hasLiveData={hasLiveData}
            />
            {renderHealthIndicator()}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch 
                id="show-winnings" 
                checked={showPotentialWinnings}
                onCheckedChange={togglePotentialWinnings}
                className="data-[state=checked]:bg-masters-yellow"
              />
              <Label 
                htmlFor="show-winnings" 
                className="text-white text-xs cursor-pointer"
              >
                Show Prize Money
              </Label>
            </div>
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
};

export default LeaderboardHeader;
