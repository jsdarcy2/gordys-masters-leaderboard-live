
import { GolferScore } from "@/types";
import { useEffect, useState, useRef } from "react";
import { fetchLeaderboardData } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, RefreshCw, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
      // Handle case where score comes as a string
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
      
      // Store previous leaderboard before updating
      previousLeaderboard.current = [...leaderboard];
      
      // Sort by position and update state
      const sortedLeaderboard = data.leaderboard.sort((a, b) => a.position - b.position);
      setLeaderboard(sortedLeaderboard);
      setLastUpdated(data.lastUpdated);
      setError(null);
      
      // Check for position changes
      if (previousLeaderboard.current.length > 0) {
        const newChanges: Record<string, 'up' | 'down' | null> = {};
        
        sortedLeaderboard.forEach(golfer => {
          const previousGolfer = previousLeaderboard.current.find(g => g.name === golfer.name);
          
          if (previousGolfer && previousGolfer.position !== golfer.position) {
            // Position changed
            if (previousGolfer.position > golfer.position) {
              // Moved up in ranking (position number decreased)
              newChanges[golfer.name] = 'up';
              
              // Only show toast for significant improvements (top 10 or big jumps)
              if (golfer.position <= 10 || (previousGolfer.position - golfer.position) >= 3) {
                toast({
                  title: `${golfer.name} Moving Up!`,
                  description: `Moved from position ${previousGolfer.position} to ${golfer.position}`,
                  variant: "default",
                });
              }
            } else {
              // Moved down in ranking (position number increased)
              newChanges[golfer.name] = 'down';
            }
          } else {
            newChanges[golfer.name] = null;
          }
        });
        
        setChangedPositions(newChanges);
        
        // Clear animations after 5 seconds
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
      
      // Store the last updated time in localStorage for cross-device consistency
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
    // First check if we have cached data
    const cachedLastUpdated = localStorage.getItem('leaderboardLastUpdated');
    const cachedData = localStorage.getItem('leaderboardData');
    
    if (cachedLastUpdated && cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setLeaderboard(parsedData);
        setLastUpdated(cachedLastUpdated);
        setLoading(false);
        
        // Then fetch fresh data in the background
        loadLeaderboardData();
      } catch (e) {
        // If there's an error parsing cached data, load fresh data
        loadLeaderboardData();
      }
    } else {
      // If no cached data, load fresh data
      loadLeaderboardData();
    }
    
    // Set up polling for real-time updates (every 60 seconds for desktop, 120 seconds for mobile)
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

  // Calculate potential winnings for each position
  const calculatePotentialWinnings = (position: number) => {
    const totalPurse = 20000000; // $20 million total purse (2023 Masters)
    
    // Approximate purse distribution based on recent Masters tournaments
    switch(position) {
      case 1: return (totalPurse * 0.18).toLocaleString(); // 18% to winner
      case 2: return (totalPurse * 0.108).toLocaleString();
      case 3: return (totalPurse * 0.068).toLocaleString();
      case 4: return (totalPurse * 0.048).toLocaleString();
      case 5: return (totalPurse * 0.04).toLocaleString();
      case 6: return (totalPurse * 0.036).toLocaleString();
      case 7: return (totalPurse * 0.0335).toLocaleString();
      case 8: return (totalPurse * 0.031).toLocaleString();
      case 9: return (totalPurse * 0.029).toLocaleString();
      case 10: return (totalPurse * 0.027).toLocaleString();
      default:
        if (position <= 15) return (totalPurse * 0.02).toLocaleString();
        if (position <= 20) return (totalPurse * 0.015).toLocaleString();
        if (position <= 30) return (totalPurse * 0.0075).toLocaleString();
        if (position <= 50) return (totalPurse * 0.0025).toLocaleString();
        return "N/A";
    }
  };

  const togglePotentialWinnings = () => {
    setShowPotentialWinnings(!showPotentialWinnings);
    localStorage.setItem('showPotentialWinnings', (!showPotentialWinnings).toString());
  };

  // Load preference from localStorage
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
