
import React, { useMemo } from "react";
import { PoolParticipant } from "@/types";
import { formatGolfScore } from "@/utils/leaderboardUtils";
import { Badge } from "@/components/ui/badge";
import { getBestFourGolfers } from "@/utils/scoringUtils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Info, Check } from "lucide-react";

interface ParticipantTableProps {
  displayStandings: PoolParticipant[];
  searchQuery: string;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ displayStandings, searchQuery }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
        <Info size={16} className="text-masters-green" />
        <span>
          Scores are calculated using the <span className="font-medium">best 4 out of 5</span> golfer scores.
        </span>
      </div>
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
            <th className="masters-table-header text-right hidden md:table-cell">Pick 5</th>
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
            displayStandings.map((participant, index) => {
              // Get the best four golfers for highlighting
              const bestFourGolfers = participant.pickScores ? 
                getBestFourGolfers(participant.pickScores) : [];
              
              console.log(`Rendering ${participant.name}, best four:`, bestFourGolfers);
                
              return (
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
                    <div className="flex items-center">
                      {participant.position}
                      {participant.position <= 3 && (
                        <span className="ml-1 text-masters-yellow">
                          {participant.position === 1 ? "🏆" : participant.position === 2 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 font-medium">
                    {participant.name}
                    {!participant.paid && (
                      <span className="ml-2 text-xs text-red-500">(unpaid)</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="border-b border-dotted border-gray-400">
                            {formatGolfScore(participant.totalScore)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Best 4 of 5 picks total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  
                  {/* Desktop view - Individual picks */}
                  {participant.picks && participant.picks.map((pick, idx) => {
                    const isBestFour = bestFourGolfers.includes(pick);
                    
                    return (
                      <td key={idx} className="px-2 py-3 text-right hidden md:table-cell">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className={`text-sm ${isBestFour ? "font-medium" : ""}`}>{pick}</span>
                            {isBestFour && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Check size={14} className="text-green-600 opacity-60" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-white text-xs">
                                    <p>Best 4 pick</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <span className={`text-xs ${
                            participant.pickScores && participant.pickScores[pick] < 0 
                              ? 'text-green-500' 
                              : participant.pickScores && participant.pickScores[pick] > 0 
                                ? 'text-red-500' 
                                : 'text-gray-500'
                          }`}>
                            {participant.pickScores && formatGolfScore(participant.pickScores[pick])}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  
                  {/* Mobile view - Just a button */}
                  <td className="px-2 py-3 text-right md:hidden">
                    <button 
                      className="text-xs bg-masters-green/10 text-masters-green px-2 py-1 rounded hover:bg-masters-green/20"
                      onClick={() => {
                        // In a real app, this would show a modal with pick details
                        alert(`${participant.name}'s picks: ${participant.picks?.join(', ')}`);
                      }}
                    >
                      View Picks
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;
