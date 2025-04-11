
import React from "react";
import { RefreshCcw, Clock, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  tournamentYear
}) => {
  return (
    <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-masters-green text-white">
      <div className="flex-1 mb-2 sm:mb-0">
        <h3 className="text-lg font-semibold mb-1">Tournament Leaderboard</h3>
        
        <DataSourceInfo 
          dataSource={dataSource} 
          lastUpdated={lastUpdated} 
          errorMessage={errorMessage}
          tournamentYear={tournamentYear}
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
