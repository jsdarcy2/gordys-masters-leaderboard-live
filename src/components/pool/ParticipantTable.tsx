
import React from "react";
import { PoolParticipant } from "@/types";
import { formatGolfScore } from "@/utils/leaderboardUtils";

interface ParticipantTableProps {
  displayStandings: PoolParticipant[];
  searchQuery: string;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ displayStandings, searchQuery }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b-2 border-masters-green">
            <th className="masters-table-header rounded-tl-md">Pos</th>
            <th className="masters-table-header">Participant</th>
            <th className="masters-table-header text-right">Total Score</th>
            <th className="masters-table-header text-right hidden md:table-cell">Pick 1</th>
            <th className="masters-table-header text-right hidden md:table-cell">Pick 2</th>
            <th className="masters-table-header text-right hidden md:table-cell">Pick 3</th>
            <th className="masters-table-header text-right hidden md:table-cell">Pick 4</th>
            <th className="masters-table-header text-right hidden md:table-cell rounded-tr-md">Pick 5</th>
            <th className="masters-table-header text-right md:hidden rounded-tr-md">Details</th>
          </tr>
        </thead>
        <tbody>
          {displayStandings.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No participants match your search"
                  : "No participants data available"}
              </td>
            </tr>
          ) : (
            displayStandings.map((participant, index) => (
              <tr
                key={participant.name}
                className={`${
                  index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"
                } ${
                  searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ? "bg-masters-green/10"
                    : ""
                }`}
              >
                <td className="px-2 py-3 font-medium">
                  {participant.position}
                  {participant.position <= 3 && (
                    <span className="ml-1 text-masters-yellow">
                      {participant.position === 1 ? "🏆" : participant.position === 2 ? "🥈" : "🥉"}
                    </span>
                  )}
                </td>
                <td className="px-2 py-3 font-medium">
                  {participant.name}
                  {!participant.paid && (
                    <span className="ml-2 text-xs text-red-500">(unpaid)</span>
                  )}
                </td>
                <td className="px-2 py-3 text-right font-medium">
                  {formatGolfScore(participant.totalScore)}
                </td>
                
                {/* Desktop view - Individual picks */}
                {participant.picks && participant.picks.map((pick, idx) => (
                  <td key={idx} className="px-2 py-3 text-right hidden md:table-cell">
                    <div className="flex flex-col items-end">
                      <span className="text-sm">{pick}</span>
                      <span className={`text-xs ${participant.pickScores && participant.pickScores[pick] < 0 ? 'text-red-500' : participant.pickScores && participant.pickScores[pick] > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                        {participant.pickScores && formatGolfScore(participant.pickScores[pick])}
                      </span>
                    </div>
                  </td>
                ))}
                
                {/* Mobile view - Just a button */}
                <td className="px-2 py-3 text-right md:hidden">
                  <button className="text-xs bg-masters-green/10 text-masters-green px-2 py-1 rounded hover:bg-masters-green/20">
                    View Picks
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;
