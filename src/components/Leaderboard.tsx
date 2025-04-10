import { GolferScore } from "@/types";
import { useEffect, useState, useRef } from "react";
import { fetchLeaderboardData } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, RefreshCw, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const POOL_CONFIG = {
  entryFee: 50, // $50 per entry
  estimatedEntrants: 120, // Estimated number of participants
  prizeTiers: [
    { position: 1, percentage: 0.5 }, // 50% to 1st place
    { position: 2, percentage: 0.25 }, // 25% to 2nd place
    { position: 3, percentage: 0.15 }, // 15% to 3rd place
    { position: 4, percentage: 0.06 }, // 6% to 4th place
    { position: 5, percentage: 0.04 }  // 4% to 5th place
  ]
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<GolferScore[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [changedPositions, setChangedPositions] = useState<Record<string, 'up' | 'down' | null>>({});
  const [showPotentialWinnings, setShowPotentialWinnings] = useState<boolean>(true);
  const previousLeaderboard = useRef<GolferScore[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const getScoreClass = (score: number) => {
    if (score < 0) return "text-masters-green font-bold";
    if (score > 0) return "text-red-600";
    return "text-black";
  };

  const formatScore = (score: number | string) => {
    if (typeof score === 'string') {
      score = parseFloat(score);
      if (isNaN(score)) return "E";
    }
    
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

  const loadLeaderboardData = async (showToast = false) => {
    try {
      setLoading(!refreshing);
      if (showToast) {
        setRefreshing(true);
      }
      
      const data = await fetchLeaderboardData();
      
      previousLeaderboard.current = [...leaderboard];
      
      const sortedLeaderboard = data.leaderboard.sort((a, b) => a.position - b.position);
      setLeaderboard(sortedLeaderboard);
      setLastUpdated(data.lastUpdated);
      setError(null);
      
      if (previousLeaderboard.current.length > 0) {
        const newChanges: Record<string, 'up' | 'down' | null> = {};
        
        sortedLeaderboard.forEach(golfer => {
          const previousGolfer = previousLeaderboard.current.find(g => g.name === golfer.name);
          
          if (previousGolfer && previousGolfer.position !== golfer.position) {
            if (previousGolfer.position > golfer.position) {
              newChanges[golfer.name] = 'up';
              
              if (golfer.position <= 10 || (previousGolfer.position - golfer.position) >= 3) {
                toast({
                  title: `${golfer.name} Moving Up!`,
                  description: `Moved from position ${previousGolfer.position} to ${golfer.position}`,
                  variant: "default",
                });
              }
            } else {
              newChanges[golfer.name] = 'down';
            }
          } else {
            newChanges[golfer.name] = null;
          }
        });
        
        setChangedPositions(newChanges);
        
        setTimeout(() => {
          setChangedPositions({});
        }, 5000);
      }
      
      if (showToast) {
        toast({
          title: "Leaderboard Updated",
          description: `Data refreshed at ${formatLastUpdated(data.lastUpdated)}`,
        });
      }
      
      localStorage.setItem('leaderboardLastUpdated', data.lastUpdated);
      localStorage.setItem('leaderboardData', JSON.stringify(data.leaderboard));
    } catch (err) {
      setError("Failed to load leaderboard data");
      console.error(err);
      
      if (showToast) {
        toast({
          title: "Update Failed",
          description: "Could not refresh leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    loadLeaderboardData(true);
  };

  useEffect(() => {
    const cachedLastUpdated = localStorage.getItem('leaderboardLastUpdated');
    const cachedData = localStorage.getItem('leaderboardData');
    
    if (cachedLastUpdated && cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setLeaderboard(parsedData);
        setLastUpdated(cachedLastUpdated);
        setLoading(false);
        
        loadLeaderboardData();
      } catch (e) {
        loadLeaderboardData();
      }
    } else {
      loadLeaderboardData();
    }
    
    const intervalTime = isMobile ? 120000 : 60000;
    const intervalId = setInterval(() => {
      loadLeaderboardData();
    }, intervalTime);
    
    return () => clearInterval(intervalId);
  }, [isMobile]);

  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculatePotentialWinnings = (position: number) => {
    const totalPrizePool = POOL_CONFIG.entryFee * POOL_CONFIG.estimatedEntrants;
    
    const prizeTier = POOL_CONFIG.prizeTiers.find(tier => tier.position === position);
    
    if (prizeTier) {
      const winnings = totalPrizePool * prizeTier.percentage;
      return winnings.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else {
      return "0";
    }
  };

  const togglePotentialWinnings = () => {
    setShowPotentialWinnings(!showPotentialWinnings);
    localStorage.setItem('showPotentialWinnings', (!showPotentialWinnings).toString());
  };

  useEffect(() => {
    const showWinnings = localStorage.getItem('showPotentialWinnings');
    if (showWinnings !== null) {
      setShowPotentialWinnings(showWinnings === 'true');
    }
  }, []);

  return (
    <div className="masters-card">
      <div className="masters-header">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-serif">
            Masters Tournament Leaderboard
          </h2>
          <div className="flex items-center gap-2">
            {!loading && !refreshing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-masters-yellow hover:text-white hover:bg-masters-green/40"
                onClick={handleManualRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={14} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only md:not-sr-only">Refresh</span>
              </Button>
            )}
            {!loading && !refreshing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-masters-yellow hover:text-white hover:bg-masters-green/40"
                onClick={togglePotentialWinnings}
              >
                <DollarSign size={14} className="mr-1" />
                <span className="sr-only md:not-sr-only">
                  {showPotentialWinnings ? "Hide Winnings" : "Show Winnings"}
                </span>
              </Button>
            )}
            {!loading && lastUpdated && (
              <div className="flex items-center text-sm text-masters-yellow">
                <Clock size={14} className="mr-1" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {error && (
          <div className="text-center text-red-500 py-4 flex items-center justify-center">
            <AlertTriangle size={16} className="mr-1" />
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
                {showPotentialWinnings && <Skeleton className="h-6 w-20" />}
              </div>
            ))}
          </div>
        ) : (
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
                      <th className="masters-table-header text-right rounded-tr-md">
                        Potential Winnings
                      </th>
                    )}
                    {!showPotentialWinnings && (
                      <th className="masters-table-header text-right rounded-tr-md"></th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={showPotentialWinnings ? 6 : 5} className="text-center py-8 text-gray-500">
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
                            {golfer.position}
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
                          <td className="px-2 py-3 text-right font-medium">
                            {golfer.status !== 'cut' && golfer.status !== 'withdrawn' ? (
                              <span className="text-masters-green">${calculatePotentialWinnings(golfer.position)}</span>
                            ) : (
                              <span className="text-gray-400">$0</span>
                            )}
                          </td>
                        )}
                        {!showPotentialWinnings && <td></td>}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
