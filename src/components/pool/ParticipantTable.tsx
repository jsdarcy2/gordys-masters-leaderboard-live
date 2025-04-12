
import React from "react";
import { PoolParticipant } from "@/types";
import { formatGolfScore } from "@/utils/leaderboardUtils";
import { Check } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import WinnerIcons from "../leaderboard/WinnerIcons";

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
            <th className="masters-table-header text-right">Pick 1</th>
            <th className="masters-table-header text-right">Pick 2</th>
            <th className="masters-table-header text-right">Pick 3</th>
            <th className="masters-table-header text-right">Pick 4</th>
            <th className="masters-table-header text-right rounded-tr-md">Pick 5</th>
          </tr>
        </thead>
        <tbody>
          {displayStandings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No participants match your search"
                  : "No participants data available"}
              </td>
            </tr>
          ) : (
            displayStandings.map((participant, index) => {
              // Get the best four golfers for highlighting
              const bestFourGolfers = participant.bestFourGolfers || [];
              const isPaid = participant.paid !== false;
              
              return (
                <tr
                  key={participant.name}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-stone-50"
                  } ${
                    searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "bg-masters-green/10"
                      : ""
                  } hover:bg-stone-100 transition-colors`}
                >
                  <td className="px-2 py-3 font-medium">
                    <WinnerIcons position={participant.position} isPoolStandings={true} />
                  </td>
                  <td className="px-2 py-3 font-medium">
                    {participant.name}
                    {!isPaid && (
                      <span className="ml-2 text-xs text-red-500 font-normal">(unpaid)</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="border-b border-dotted border-gray-400">
                            {participant.totalScore > 0 ? `+${participant.totalScore}` : participant.totalScore}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Best 4 of 5 picks total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  
                  {/* Display all 5 picks */}
                  {Array.from({ length: 5 }).map((_, pickIndex) => {
                    const pick = participant.picks?.[pickIndex] || "";
                    const score = participant.pickScores?.[pick] || 0;
                    const isBestFour = bestFourGolfers.includes(pick);
                    
                    return (
                      <td key={pickIndex} className="px-2 py-3 text-right">
                        {pick ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <span className={`${isBestFour ? "font-medium" : ""}`}>
                                {pick}
                              </span>
                              {isBestFour && (
                                <Check size={14} className="text-green-600 opacity-70" />
                              )}
                            </div>
                            <span className={`text-xs ${
                              score < 0 
                                ? 'text-green-500' 
                                : score > 0 
                                  ? 'text-red-500' 
                                  : 'text-gray-500'
                            }`}>
                              {score > 0 ? `+${score}` : score}
                            </span>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
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
