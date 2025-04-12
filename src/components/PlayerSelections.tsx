import { useState, useEffect, useMemo } from "react";
import { fetchPlayerSelections, fetchPoolStandings } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PoolParticipant } from "@/types";
import { useToast } from "@/hooks/use-toast";

type TeamSelection = {
  picks: string[];
  roundScores: number[];
  tiebreakers: [number, number];
};

const PlayerSelections = () => {
  const [selections, setSelections] = useState<{[participant: string]: TeamSelection}>({});
  const [poolStandings, setPoolStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "golfer">("name");
  const [sortedGolfer, setSortedGolfer] = useState<string | null>(null);
  const { toast } = useToast();
  
  const PREVIEW_COUNT = 50; // Increased from 20 to 50 to show more participants by default

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load both selections and pool standings data
        const [standingsData] = await Promise.all([
          fetchPoolStandings()
        ]);
        
        // Transform the pool standings data to match the selections format
        const transformedSelections: {[participant: string]: TeamSelection} = {};
        
        standingsData.forEach(participant => {
          if (participant.name && participant.picks) {
            const roundScores = participant.picks.map(pick => 
              participant.pickScores?.[pick] || 0
            );
            
            transformedSelections[participant.name] = {
              picks: participant.picks || [],
              roundScores: roundScores,
              tiebreakers: [participant.tiebreaker1 || 0, participant.tiebreaker2 || 0]
            };
          }
        });
        
        console.log(`Loaded ${Object.keys(transformedSelections).length} team selections`);
        setSelections(transformedSelections);
        setPoolStandings(standingsData);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the selections data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const getGolferPopularity = useMemo(() => {
    const popularity: {[golfer: string]: number} = {};
    
    Object.values(selections).forEach(({picks}) => {
      picks.forEach(golfer => {
        popularity[golfer] = (popularity[golfer] || 0) + 1;
      });
    });
    
    return popularity;
  }, [selections]);

  const sortedGolfers = useMemo(() => 
    Object.entries(getGolferPopularity)
      .sort(([, countA], [, countB]) => countB - countA),
  [getGolferPopularity]);

  const getScoreClass = (score: number) => {
    if (score < 0) return "text-masters-green font-bold";
    if (score > 0) return "text-red-600";
    return "";
  };

  const formatScore = (score: number) => {
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

  const participantRankMap = useMemo(() => {
    const rankMap = new Map<string, number>();
    poolStandings.forEach((participant) => {
      rankMap.set(participant.name, participant.position);
    });
    return rankMap;
  }, [poolStandings]);

  const filteredParticipants = useMemo(() => {
    let filtered = Object.entries(selections);
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(([name, data]) => {
        return (
          name.toLowerCase().includes(lowerSearchTerm) || 
          data.picks.some(pick => pick.toLowerCase().includes(lowerSearchTerm))
        );
      });
    }
    
    if (sortBy === "golfer" && sortedGolfer) {
      filtered = filtered.filter(([, data]) => 
        data.picks.includes(sortedGolfer)
      );
    }
    
    filtered = filtered.sort((a, b) => {
      const rankA = participantRankMap.get(a[0]) || Infinity;
      const rankB = participantRankMap.get(b[0]) || Infinity;
      
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      
      return a[0].localeCompare(b[0]);
    });
    
    return filtered;
  }, [selections, searchTerm, sortBy, sortedGolfer, participantRankMap]);

  const displaySelections = showAll ? filteredParticipants : filteredParticipants.slice(0, PREVIEW_COUNT);

  const calculateTotalRoundScore = (roundScores: number[]) => {
    return roundScores.reduce((sum, score) => sum + score, 0);
  };

  return (
    <div className="space-y-8">
      <div className="masters-card">
        <div className="masters-header">
          <h2 className="text-xl md:text-2xl font-serif">
            Player Selections
          </h2>
          <p className="text-sm text-white/80 mt-1">
            View all {Object.keys(selections).length} team selections for The Masters, ordered by pool position
          </p>
        </div>
        
        <div className="p-4 bg-white">
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or golfer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-masters-green/30 focus-visible:ring-masters-green/30"
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Showing {displaySelections.length} of {filteredParticipants.length} teams
              {searchTerm && ` (filtered by "${searchTerm}")`}
              {sortBy === "golfer" && sortedGolfer && ` showing only teams with ${sortedGolfer}`}
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-24" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b-2 border-masters-green">
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium rounded-tl-md">Pos</th>
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium">Name</th>
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium text-center">Rd 1</th>
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium text-center">TB1</th>
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium text-center">TB2</th>
                      <th className="px-2 py-2 bg-masters-light text-masters-green font-medium rounded-tr-md">Selections (5)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySelections.map(([participant, data], index) => {
                      const totalRound1 = calculateTotalRoundScore(data.roundScores);
                      const poolPosition = participantRankMap.get(participant) || index + 1;
                      
                      return (
                        <tr key={participant} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
                          <td className="px-2 py-3 text-center font-medium">{poolPosition}</td>
                          <td className="px-2 py-3 font-medium">{participant}</td>
                          <td className={`px-2 py-3 text-center ${getScoreClass(totalRound1)}`}>
                            {formatScore(totalRound1)}
                          </td>
                          <td className="px-2 py-3 text-center">{data.tiebreakers[0]}</td>
                          <td className="px-2 py-3 text-center">{data.tiebreakers[1]}</td>
                          <td className="px-2 py-3">
                            <div className="flex flex-wrap gap-1">
                              {data.picks.map((pick, i) => (
                                <span 
                                  key={i}
                                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    data.roundScores[i] < 0
                                      ? "bg-green-100"
                                      : data.roundScores[i] > 0
                                      ? "bg-red-100"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {pick} 
                                  <span className={getScoreClass(data.roundScores[i])}>
                                    {" "}({formatScore(data.roundScores[i])})
                                  </span>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="md:hidden space-y-6">
                {displaySelections.map(([participant, data], index) => {
                  const totalRound1 = calculateTotalRoundScore(data.roundScores);
                  const poolPosition = participantRankMap.get(participant) || index + 1;
                  
                  return (
                    <div key={participant} className={`border-b pb-4 last:border-0 ${index % 2 === 0 ? "" : "bg-masters-yellow bg-opacity-10 -mx-4 px-4"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-masters-green text-white rounded-full text-sm font-medium">
                            {poolPosition}
                          </span>
                          <h3 className="font-medium text-lg">{participant}</h3>
                        </div>
                        <div className={`text-lg ${getScoreClass(totalRound1)}`}>
                          {formatScore(totalRound1)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {data.picks.map((pick, i) => (
                          <span 
                            key={i} 
                            className={`inline-block px-3 py-1 rounded-full text-sm ${
                              data.roundScores[i] < 0
                                ? "bg-green-100"
                                : data.roundScores[i] > 0
                                ? "bg-red-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {pick}
                            <span className={getScoreClass(data.roundScores[i])}>
                              {" "}({formatScore(data.roundScores[i])})
                            </span>
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tiebreakers: {data.tiebreakers[0]} / {data.tiebreakers[1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {filteredParticipants.length > PREVIEW_COUNT && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAll(!showAll)}
                className="text-masters-green border-masters-green hover:bg-masters-green/10 focus:ring-2 focus:ring-masters-green/30"
              >
                {showAll ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Show All ({filteredParticipants.length} Teams)</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="masters-card">
        <div className="masters-header">
          <h2 className="text-xl md:text-2xl font-serif">
            Golfer Popularity
          </h2>
        </div>
        <div className="p-4 bg-white">
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedGolfers.map(([golfer, count], index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center py-2 px-2 border-b ${index % 2 === 0 ? "" : "bg-masters-yellow bg-opacity-10"} cursor-pointer hover:bg-masters-green/5 transition-colors`}
                  onClick={() => {
                    if (sortBy === "golfer" && sortedGolfer === golfer) {
                      setSortBy("name");
                      setSortedGolfer(null);
                    } else {
                      setSortBy("golfer");
                      setSortedGolfer(golfer);
                    }
                  }}
                >
                  <span className="font-medium">
                    {golfer}
                    {sortBy === "golfer" && sortedGolfer === golfer && 
                      <span className="ml-2 text-xs text-masters-green">(click to clear filter)</span>
                    }
                  </span>
                  <span className="bg-masters-green text-white px-2 py-1 rounded-full text-sm">
                    {count} pick{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelections;
