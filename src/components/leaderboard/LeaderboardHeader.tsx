
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";
import DataSourceInfo from "./DataSourceInfo";

interface LeaderboardHeaderProps {
  lastUpdated: string;
  loading: boolean;
  refreshing: boolean;
  handleManualRefresh: () => void;
  showPotentialWinnings: boolean;
  togglePotentialWinnings: () => void;
  dataSource?: string;
  errorMessage?: string;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  lastUpdated,
  loading,
  refreshing,
  handleManualRefresh,
  showPotentialWinnings,
  togglePotentialWinnings,
  dataSource,
  errorMessage
}) => {
  return (
    <div className="masters-header bg-gradient-to-r from-masters-green to-masters-green/90 backdrop-blur-sm rounded-t-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-4">
        <h2 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-0">
          Masters Tournament Leaderboard
        </h2>
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className={`bg-white/10 text-white border-0 hover:bg-white/20 hover:text-white ${refreshing ? 'opacity-70 pointer-events-none' : ''}`}
              onClick={handleManualRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={14} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="sr-only md:not-sr-only">Refresh</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/10 text-white border-0 hover:bg-white/20 hover:text-white"
              onClick={togglePotentialWinnings}
            >
              <Trophy size={14} className="mr-1" />
              <span className="sr-only md:not-sr-only">
                {showPotentialWinnings ? "Hide Prize" : "Show Prize"}
              </span>
            </Button>
          </div>
          {lastUpdated && (
            <DataSourceInfo 
              lastUpdated={lastUpdated} 
              dataSource={dataSource} 
              errorMessage={errorMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
