
import { GolferScore } from "@/types";
import { useEffect, useState, useRef } from "react";
import { fetchLeaderboardData } from "@/services/api";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import LoadingState from "./leaderboard/LoadingState";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import LeaderboardTable from "./leaderboard/LeaderboardTable";
import { formatLastUpdated } from "@/utils/leaderboardUtils";

const POLLING_INTERVAL = 15000; // 15 seconds in milliseconds

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<GolferScore[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [changedPositions, setChangedPositions] = useState<Record<string, 'up' | 'down' | null>>({});
  const [showPotentialWinnings, setShowPotentialWinnings] = useState<boolean>(true);
  const [needsApiKey, setNeedsApiKey] = useState<boolean>(false);
  const previousLeaderboard = useRef<GolferScore[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const loadLeaderboardData = async (showToast = false) => {
    try {
      setLoading(!refreshing);
      if (showToast) {
        setRefreshing(true);
      }
      
      const data = await fetchLeaderboardData();
      console.log("Fetched leaderboard data:", data.leaderboard.length, "golfers");
      
      // Check if we might be using fallback data
      if (data.leaderboard.length > 0 && 
          data.leaderboard[0].name === "Scottie Scheffler" && 
          data.leaderboard[0].score === -10) {
        setNeedsApiKey(true);
      } else {
        setNeedsApiKey(false);
      }
      
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

  const togglePotentialWinnings = () => {
    setShowPotentialWinnings(!showPotentialWinnings);
    localStorage.setItem('showPotentialWinnings', (!showPotentialWinnings).toString());
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
    
    // Clear any existing interval
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    // Set up polling every 15 seconds
    pollingRef.current = setInterval(() => {
      loadLeaderboardData();
    }, POLLING_INTERVAL);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const showWinnings = localStorage.getItem('showPotentialWinnings');
    if (showWinnings !== null) {
      setShowPotentialWinnings(showWinnings === 'true');
    }
  }, []);

  return (
    <div className="masters-card">
      <LeaderboardHeader 
        lastUpdated={lastUpdated}
        loading={loading}
        refreshing={refreshing}
        handleManualRefresh={handleManualRefresh}
        showPotentialWinnings={showPotentialWinnings}
        togglePotentialWinnings={togglePotentialWinnings}
      />
      
      <div className="p-4 bg-white">
        {needsApiKey && (
          <div className="text-center text-amber-600 py-4 flex items-center justify-center mb-4 bg-amber-50 border border-amber-200 rounded-md">
            <Info size={16} className="mr-1" />
            Note: Using sample data. Set your RapidAPI key for live data.
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 py-4 flex items-center justify-center">
            <AlertTriangle size={16} className="mr-1" />
            {error}
          </div>
        )}
        
        {loading ? (
          <LoadingState showPotentialWinnings={showPotentialWinnings} />
        ) : (
          <LeaderboardTable 
            leaderboard={leaderboard}
            refreshing={refreshing}
            changedPositions={changedPositions}
            showPotentialWinnings={showPotentialWinnings}
          />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
