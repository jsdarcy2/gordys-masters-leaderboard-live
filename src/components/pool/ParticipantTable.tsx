
import React from "react";
import { PoolParticipant } from "@/types";
import { formatGolfScore } from "@/utils/leaderboardUtils";
import { Check, Ban, CircleDollarSign, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import WinnerIcons from "../leaderboard/WinnerIcons";
import { Badge } from "@/components/ui/badge";

interface ParticipantTableProps {
  displayStandings: PoolParticipant[];
  searchQuery: string;
}

const getEarningsForPosition = (position: number, totalParticipants: number): string => {
  if (position === 1) return "$1,200";
  if (position === 2) return "$500";
  if (position === 3) return "$300";
  return "";
};

const ParticipantTable: React.FC<ParticipantTableProps> = ({ displayStandings, searchQuery }) => {
  // Find ties in the displayStandings
  const tiedPositions: Record<number, number> = {};
  displayStandings.forEach(participant => {
    tiedPositions[participant.position] = (tiedPositions[participant.position] || 0) + 1;
  });

  return (
    <div className="overflow-x-auto mt-4">
      <div className="text-sm text-gray-600 mb-3 flex items-center gap-1 bg-masters-cream/30 p-3 rounded-md border border-masters-green/10">
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
              const missedCut = participant.totalScore > 200;
              const isTied = tiedPositions[participant.position] > 1;
              const showEarnings = participant.position <= 3;
              const earningsAmount = getEarningsForPosition(participant.position, displayStandings.length);
              
              return (
                <tr
                  key={participant.name}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-masters-light/30"
                  } ${
                    missedCut ? "bg-red-50" : ""
                  } ${
                    searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "bg-masters-green/10"
                      : ""
                  } hover:bg-masters-cream/50 transition-colors border-b border-gray-100`}
                >
                  <td className="px-2 py-3 font-medium">
                    <div className="flex items-center">
                      <WinnerIcons position={participant.position} isPoolStandings={true} />
                      
                      {showEarnings && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1.5 inline-flex items-center justify-center bg-masters-gold/90 text-white text-xs rounded-full w-5 h-5 cursor-pointer hover:bg-masters-gold hover:shadow-sm hover:scale-110 transition-all duration-200 group">
                                <CircleDollarSign size={10} className="group-hover:animate-pulse" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-masters-gold text-white border-masters-gold shadow-md font-medium">
                              <p>
                                {isTied
                                  ? `${earningsAmount} (tied, may be split)`
                                  : `${earningsAmount} prize money`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 font-medium">
                    <div className="flex flex-wrap items-center gap-2">
                      {participant.name}
                      {!isPaid && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-normal">unpaid</span>
                      )}
                      {missedCut && (
                        <Badge variant="destructive" className="text-xs py-0 px-1.5 h-5 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800">
                          <Ban size={12} className="mr-1" />
                          Missed Cut
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="border-b border-dotted border-gray-400">
                            {missedCut ? (
                              <span className="text-red-600">MC</span>
                            ) : (
                              participant.totalScore > 0 ? `+${participant.totalScore}` : participant.totalScore
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Best 4 of 5 picks total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  
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
