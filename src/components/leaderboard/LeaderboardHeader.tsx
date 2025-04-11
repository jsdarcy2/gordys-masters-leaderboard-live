
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign } from "lucide-react";
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
    <div className="masters-header">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-serif">
          Masters Tournament Leaderboard
        </h2>
        <div className="flex items-center gap-2">
          {!loading && !refreshing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-masters-yellow hover:text-white hover:bg-masters-green/40"
              onClick={handleManualRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={14} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="sr-only md:not-sr-only">Refresh</span>
            </Button>
          )}
          {!loading && !refreshing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-masters-yellow hover:text-white hover:bg-masters-green/40"
              onClick={togglePotentialWinnings}
            >
              <DollarSign size={14} className="mr-1" />
              <span className="sr-only md:not-sr-only">
                {showPotentialWinnings ? "Hide Prize Money" : "Show Prize Money"}
              </span>
            </Button>
          )}
          {!loading && lastUpdated && (
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
