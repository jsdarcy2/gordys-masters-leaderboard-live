
import React, { useState } from "react";
import { PoolParticipant } from "@/types";
import { formatGolfScore } from "@/utils/leaderboardUtils";
import { Check, Ban, CircleDollarSign, ExternalLink } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import WinnerIcons from "../leaderboard/WinnerIcons";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

// List of participants who have already paid
const PAID_PARTICIPANTS = new Set([
  "Kyle Flippen", "Jim Jones", "Charlotte Ramalingam", "Louis Baker", "Chris Crawford", 
  "Ava Rose Darcy", "Mike Baker", "Chuck Corbett Sr", "Jay Despard", "Charles Elder", 
  "J.J. Furst", "Grayson Ginkel", "David Hardt", "Sargent Johnson, Jr.", "Jamie Lockhart", 
  "Johnny McWhite", "James Petrikas Sr.", "Phil Present Jr.", "John Saunders", "Cora Stofer", 
  "Ford Stofer", "Sylas Stofer", "Sarah Sturgis", "Nate Carlson", "Brian Ginkel", 
  "Peter Kepic Sr.", "Owen Kepic", "Peggy McClintock", "Roth Sanner", "Stuie Snyder", 
  "Gordon Stofer III", "Avery Sturgis", "Scott Tande", "Elia Ayaz", "Ted Beckman", 
  "James Carlson", "Hadley Carlson", "Ed Corbett", "Mik Gusenius", "Andy Gustafson", 
  "Chris Kelley", "Max Kepic", "Dan Lenmark", "Elle McClintock", "Rich McClintock", 
  "Charles Meech Jr", "Chad Murphy", "Nash Nibbe", "Julie Nibbe", "James Petrikas Jr.", 
  "Davey Phelps", "Phil Present III", "Matt Rogers", "Jackson Saunders", "Ryan Schmitt", 
  "Tyler Smith", "Steve Sorenson", "Debbie Stofer", "Gordon Stofer Jr.", "Addie Stofer", 
  "Chris Willette", "Peter Bassett", "John Gustafson", "Brack Herfurth", "Peter Kepic Jr.", 
  "Greg Kevane", "Rory Kevane", "Pete Kostroski", "Rollie Logan", "Bo Massopust", 
  "Knox Nibbe", "Jay Perlmutter", "Donny Schmitt", "Hayden Simmons", "Tommy Simmons", 
  "Eileen Stofer", "Jon Sturgis", "Hilary Beckman", "Lily Gustafson", "Darby Herfurth", 
  "Henry Herfurth", "Rachel Herfurth", "Jenny McClintock", "Kevin McClintock", "Jon Moseley", 
  "Les Perry", "Jack Simmons", "Jimmy Stofer", "Teddy Stofer", "Ben Applebaum", "Ross Baker", 
  "Oliver Beckman", "Peter Beugg", "Quinn Carlson", "Tilly Duff", "Gretchen Duff", "Eric Fox", 
  "Jess Herfurth", "Decker Herfurth", "Sargent Johnson", "Sarah Kepic", "Andy Koch", 
  "Chad Kollar", "Jack Lenmark", "C.J. Nibbe", "Ravi Ramalingam", "Victoria Simmons", 
  "Robby Stofer", "Jess Troyak", "Annie Carlson", "Ethan Sturgis"
]);

// List of all participant names - used to determine who hasn't paid
const ALL_PARTICIPANTS = new Set([
  "Kyle Flippen", "Jim Jones", "Charlotte Ramalingam", "Louis Baker", "Chris Crawford", 
  "Ava Rose Darcy", "Mike Baker", "Chuck Corbett Sr", "Jay Despard", "Pete Drago", 
  "Alexa Drago", "Charles Elder", "J.J. Furst", "Grayson Ginkel", "David Hardt", 
  "Sargent Johnson, Jr.", "Jamie Lockhart", "Johnny McWhite", "James Petrikas Sr.", 
  "Phil Present Jr.", "John Saunders", "Jon Schwingler", "Cora Stofer", "Ford Stofer", 
  "Sylas Stofer", "Sarah Sturgis", "Jimmy Beltz", "Nate Carlson", "Ollie Drago", 
  "Adam Duff", "Brian Ginkel", "Peter Kepic Sr.", "Owen Kepic", "Peggy McClintock", 
  "Roth Sanner", "Stuie Snyder", "Bette Stephens", "Gordon Stofer III", "Avery Sturgis", 
  "Scott Tande", "Elia Ayaz", "Ted Beckman", "James Carlson", "Hadley Carlson", 
  "Ed Corbett", "Holland Darcy", "Audrey Darcy", "Charlie Drago", "Mik Gusenius", 
  "Andy Gustafson", "Chris Kelley", "Paul Kelly", "Max Kepic", "Dan Lenmark", 
  "Elle McClintock", "Rich McClintock", "Charles Meech Jr", "Chad Murphy", "Nash Nibbe", 
  "Julie Nibbe", "James Petrikas Jr.", "Davey Phelps", "Will Phelps", "Phil Present III", 
  "Matt Rogers", "Jackson Saunders", "Ryan Schmitt", "Tyler Smith", "Steve Sorenson", 
  "Katie Stephens", "Reven Stephens", "Caelin Stephens", "Debbie Stofer", "Gordon Stofer Jr.", 
  "Addie Stofer", "Chris Willette", "Peter Bassett", "John Gustafson", "Brack Herfurth", 
  "Davis Jones", "Peter Kepic Jr.", "Greg Kevane", "Rory Kevane", "Pete Kostroski", 
  "Rollie Logan", "Bo Massopust", "Knox Nibbe", "Jay Perlmutter", "Donny Schmitt", 
  "Hayden Simmons", "Tommy Simmons", "Winfield Stephens", "Eileen Stofer", "Jon Sturgis", 
  "Hilary Beckman", "Justin Darcy", "Lily Gustafson", "Darby Herfurth", "Henry Herfurth", 
  "Rachel Herfurth", "Jenny McClintock", "Kevin McClintock", "Jon Moseley", "Les Perry", 
  "Toby Schwingler", "Jack Simmons", "Jimmy Stofer", "Teddy Stofer", "Ben Applebaum", 
  "Ross Baker", "Oliver Beckman", "Peter Beugg", "Quinn Carlson", "Tilly Duff", 
  "Gretchen Duff", "Eric Fox", "Jess Herfurth", "Decker Herfurth", "Amy Jones", 
  "Carter Jones", "Sargent Johnson", "Sarah Kepic", "Andy Koch", "Chad Kollar", 
  "Jack Lenmark", "C.J. Nibbe", "Ravi Ramalingam", "Victoria Simmons", "Robby Stofer", 
  "Jess Troyak", "Annie Carlson", "Ethan Sturgis"
]);

// Calculate unpaid participants by filtering PAID_PARTICIPANTS from ALL_PARTICIPANTS
const UNPAID_PARTICIPANTS = new Set(
  [...ALL_PARTICIPANTS].filter(name => !PAID_PARTICIPANTS.has(name))
);

const ParticipantTable: React.FC<ParticipantTableProps> = ({ displayStandings, searchQuery }) => {
  // Find ties in the displayStandings
  const tiedPositions: Record<number, number> = {};
  displayStandings.forEach(participant => {
    tiedPositions[participant.position] = (tiedPositions[participant.position] || 0) + 1;
  });

  // State to track participants who have paid during this session
  const [justPaid, setJustPaid] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Handle when a payment is initiated
  const handlePaymentClick = (participantName: string) => {
    // Mark the participant as paid
    setJustPaid(prev => {
      const newSet = new Set(prev);
      newSet.add(participantName);
      return newSet;
    });
    
    // Show confirmation toast
    toast({
      title: "Payment Initiated",
      description: `Thank you for paying! The badge will be hidden now.`,
      variant: "default",
    });
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="text-sm text-gray-600 mb-3 flex items-center gap-1 bg-masters-cream/30 p-3 rounded-md border border-masters-green/10">
        <CircleDollarSign size={16} className="text-masters-green" />
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
              
              // Check if the participant has paid
              const isPaid = PAID_PARTICIPANTS.has(participant.name) || justPaid.has(participant.name);
              
              // Explicitly check if participant is unpaid
              const isUnpaid = UNPAID_PARTICIPANTS.has(participant.name) && !justPaid.has(participant.name);
              
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
                              <span className="ml-1.5 inline-flex items-center justify-center text-masters-gold cursor-help">
                                <CircleDollarSign size={14} className="hover:scale-110 transition-transform" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-masters-gold text-white border-masters-gold shadow-md font-medium">
                              <p>
                                {isTied
                                  ? `Prize money: ${earningsAmount} (tied, may be split)`
                                  : `Prize money: ${earningsAmount}`}
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
                      {isUnpaid && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href="https://venmo.com/gfstofer" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-normal hover:bg-blue-200 transition-colors flex items-center gap-1"
                                onClick={(e) => {
                                  // This doesn't prevent navigation, just triggers the paid status update
                                  handlePaymentClick(participant.name);
                                }}
                              >
                                <span>unpaid</span>
                                <ExternalLink size={10} />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="bg-blue-600 text-white border-blue-700">
                              <p className="text-xs">Pay with Venmo @gfstofer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
