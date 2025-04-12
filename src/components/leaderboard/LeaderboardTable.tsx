
import React from "react";
import { GolferScore } from "@/types";
import { RefreshCw, CircleX, CircleDollarSign } from "lucide-react";
import WinnerIcons from "./WinnerIcons";
import { 
  getScoreClass, 
  formatScore, 
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
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
          <RefreshCw size={24} className="animate-spin text-masters-green" />
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="text-left border-b-2 border-masters-green">
            <th className="masters-table-header rounded-tl-md">Pos</th>
            <th className="masters-table-header">Player</th>
            <th className="masters-table-header text-right">Score</th>
            <th className="masters-table-header text-right">Today</th>
            <th className="masters-table-header text-right">Thru</th>
            <th className="masters-table-header text-right rounded-tr-md">
              Prize Money
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
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
                <td className={`px-2 py-3 text-right ${getScoreClass(golfer.today)}`}>
                  {formatScore(golfer.today)}
                </td>
                <td className="px-2 py-3 text-right">{golfer.thru}</td>
                <td className="px-2 py-3 text-right">
                  {golfer.status !== 'cut' && golfer.status !== 'withdrawn' ? (
                    <span className="inline-flex items-center font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded">
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
    </>
  );
};

export default LeaderboardTable;
