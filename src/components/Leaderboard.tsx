
import { GolferScore } from "@/types";
import { useEffect, useState, useRef } from "react";
import { fetchLeaderboardData, getCurrentTournament } from "@/services/api";
import { AlertTriangle, Info, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import LoadingState from "./leaderboard/LoadingState";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import LeaderboardTable from "./leaderboard/LeaderboardTable";
import ApiKeyForm from "./leaderboard/ApiKeyForm";
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
  const [currentTournament, setCurrentTournament] = useState<any>(null);
  const [tournamentLoading, setTournamentLoading] = useState<boolean>(true);
  const previousLeaderboard = useRef<GolferScore[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load tournament information
  useEffect(() => {
    const loadTournamentInfo = async () => {
      try {
        setTournamentLoading(true);
        const tournamentInfo = await getCurrentTournament();
        setCurrentTournament(tournamentInfo);
      } catch (error) {
        console.error("Error loading tournament info:", error);
      } finally {
        setTournamentLoading(false);
      }
    };
    
    loadTournamentInfo();
  }, []);

  const loadLeaderboardData = async (showToast = false) => {
    try {
      setLoading(!refreshing);
      if (showToast) {
        setRefreshing(true);
      }
      
      const data = await fetchLeaderboardData();
      console.log("Fetched leaderboard data:", data.leaderboard.length, "golfers");
      
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

  // Format tournament dates
  const formatTournamentDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

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
        {currentTournament && !tournamentLoading && (
          <div className="mb-4 bg-masters-green/5 border border-masters-green/20 rounded-md p-3">
            <div className="flex items-center gap-2 text-masters-dark">
              <Calendar size={18} className="text-masters-green" />
              <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                <h3 className="font-medium text-masters-green">
                  {currentTournament.name}
                  {currentTournament.isUpcoming && 
                    <span className="ml-2 text-xs bg-masters-yellow/20 text-masters-dark px-2 py-0.5 rounded-full">
                      Upcoming
                    </span>
                  }
                </h3>
                <div className="text-sm text-masters-dark/80">
                  {formatTournamentDates(currentTournament.startDate, currentTournament.endDate)}
                  {currentTournament.course && 
                    <span className="ml-2">• {currentTournament.course}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ApiKeyForm />
        
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
