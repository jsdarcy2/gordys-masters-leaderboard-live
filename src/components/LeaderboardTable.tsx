
import React from "react";
import { GolferScore } from "@/types";
import { RefreshCw, CircleX, CircleDollarSign, InfoIcon } from "lucide-react";
import WinnerIcons from "./leaderboard/WinnerIcons";
import { 
  getScoreClass, 
  formatScore, 
  getMastersPurseAmount 
} from "@/utils/leaderboardUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LeaderboardTableProps {
  leaderboard: GolferScore[];
  refreshing: boolean;
  changedPositions: Record<string, 'up' | 'down' | null>;
  dataSource?: string;
  onRefresh?: () => void;
  showPotentialWinnings?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  refreshing,
  changedPositions,
  dataSource,
  onRefresh,
  showPotentialWinnings = true
}) => {
  return (
    <>
      {dataSource && dataSource !== "masters-scores-api" && (
        <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm flex justify-between items-center">
            <span>
              Using {dataSource === "mock-data" ? "simulated golf data" : "cached data"} instead of live tournament scores.
              This may cause scoring discrepancies.
            </span>
            {onRefresh && (
              <button 
                onClick={onRefresh} 
                className="ml-2 text-xs px-2 py-1 bg-white border border-amber-200 rounded hover:bg-amber-100 transition-colors flex items-center"
              >
                <RefreshCw size={12} className="mr-1" />
                Refresh
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {refreshing && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <RefreshCw size={24} className="animate-spin text-masters-green" />
        </div>
      )}
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-2 border-masters-green">
              <th className="masters-table-header rounded-tl-md">Pos</th>
              <th className="masters-table-header">Player</th>
              <th className="masters-table-header text-right">Score</th>
              <th className="masters-table-header text-right">R1</th>
              <th className="masters-table-header text-right">R2</th>
              <th className="masters-table-header text-right">Today</th>
              <th className="masters-table-header text-right rounded-tr-md">
                Prize Money
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No leaderboard data available
                </td>
              </tr>
            ) : (
              leaderboard.map((golfer, index) => (
                <tr 
                  key={`${golfer.name}-${index}`} 
                  className={`${index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"} ${
                    changedPositions[golfer.name] === 'up' 
                      ? 'animate-pulse bg-green-50' 
                      : changedPositions[golfer.name] === 'down' 
                      ? 'animate-pulse bg-red-50'
                      : ''
                  } transition-all duration-500`}
                >
                  <td className="px-2 py-3 font-medium">
                    <div className="flex items-center">
                      {changedPositions[golfer.name] === 'up' && (
                        <span className="text-masters-green mr-1">▲</span>
                      )}
                      {changedPositions[golfer.name] === 'down' && (
                        <span className="text-red-500 mr-1">▼</span>
                      )}
                      <WinnerIcons position={golfer.position} isPoolStandings={false} />
                    </div>
                  </td>
                  <td className="px-2 py-3 font-medium">
                    <div className="flex items-center">
                      {golfer.name}
                      {golfer.status === 'cut' && (
                        <span className="ml-2 inline-flex items-center text-xs text-red-500 font-medium">
                          <CircleX size={14} className="mr-0.5" />
                          MC
                        </span>
                      )}
                      {golfer.status === 'withdrawn' && <span className="ml-2 text-xs text-red-500">(WD)</span>}
                    </div>
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.score)}`}>
                    {formatScore(golfer.score)}
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.round1)}`}>
                    {golfer.round1 !== undefined ? formatScore(golfer.round1) : "-"}
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.round2)}`}>
                    {golfer.round2 !== undefined ? formatScore(golfer.round2) : "-"}
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.today)}`}>
                    {formatScore(golfer.today)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {golfer.status !== 'cut' && golfer.status !== 'withdrawn' ? (
                      <span className="inline-flex items-center font-medium text-[#8B5CF6] bg-[#8B5CF6]/5 px-2 py-0.5 rounded">
                        <CircleDollarSign size={13} className="mr-1 text-[#8B5CF6]" />
                        {getMastersPurseAmount(golfer.position)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">$0</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeaderboardTable;
