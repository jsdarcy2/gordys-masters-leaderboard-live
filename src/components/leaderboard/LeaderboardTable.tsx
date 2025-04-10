
import React from "react";
import { GolferScore } from "@/types";
import { RefreshCw } from "lucide-react";
import WinnerIcons from "./WinnerIcons";
import { 
  getScoreClass, 
  formatScore, 
  calculatePotentialWinnings, 
  getMastersPurseAmount 
} from "@/utils/leaderboardUtils";

interface LeaderboardTableProps {
  leaderboard: GolferScore[];
  refreshing: boolean;
  changedPositions: Record<string, 'up' | 'down' | null>;
  showPotentialWinnings: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  refreshing,
  changedPositions,
  showPotentialWinnings
}) => {
  return (
    <>
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
              <th className="masters-table-header text-right">Today</th>
              <th className="masters-table-header text-right">Thru</th>
              {showPotentialWinnings && (
                <>
                  <th className="masters-table-header text-right">
                    Pool Winnings
                  </th>
                  <th className="masters-table-header text-right rounded-tr-md">
                    Masters Prize
                  </th>
                </>
              )}
              {!showPotentialWinnings && (
                <th className="masters-table-header text-right rounded-tr-md"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={showPotentialWinnings ? 7 : 5} className="text-center py-8 text-gray-500">
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
                      <WinnerIcons position={golfer.position} />
                    </div>
                  </td>
                  <td className="px-2 py-3 font-medium">
                    {golfer.name}
                    {golfer.status === 'cut' && <span className="ml-2 text-xs text-red-500">(CUT)</span>}
                    {golfer.status === 'withdrawn' && <span className="ml-2 text-xs text-red-500">(WD)</span>}
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.score)}`}>
                    {formatScore(golfer.score)}
                  </td>
                  <td className={`px-2 py-3 text-right ${getScoreClass(golfer.today)}`}>
                    {formatScore(golfer.today)}
                  </td>
                  <td className="px-2 py-3 text-right">{golfer.thru}</td>
                  {showPotentialWinnings && (
                    <>
                      <td className="px-2 py-3 text-right font-medium">
                        {golfer.status !== 'cut' && golfer.status !== 'withdrawn' ? (
                          <span className="text-masters-green">${calculatePotentialWinnings(golfer.position)}</span>
                        ) : (
                          <span className="text-gray-400">$0</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-right font-medium">
                        {golfer.status !== 'cut' && golfer.status !== 'withdrawn' ? (
                          <span className="text-purple-600">${getMastersPurseAmount(golfer.position)}</span>
                        ) : (
                          <span className="text-gray-400">$0</span>
                        )}
                      </td>
                    </>
                  )}
                  {!showPotentialWinnings && <td></td>}
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
