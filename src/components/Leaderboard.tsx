import { GolferScore } from "@/types";
import { useEffect, useState, useRef } from "react";
import { fetchLeaderboardData, getCurrentTournament } from "@/services/api";
import { AlertTriangle, Info, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingState from "./leaderboard/LoadingState";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import LeaderboardTable from "./leaderboard/LeaderboardTable";
import ApiKeyForm from "./leaderboard/ApiKeyForm";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const POLLING_INTERVAL = 30000; 

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
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string | undefined>(undefined);
  const [dataSourceError, setDataSourceError] = useState<string | undefined>(undefined);
  const previousLeaderboard = useRef<GolferScore[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTournamentInfo = async () => {
      try {
        setTournamentLoading(true);
        const tournamentInfo = await getCurrentTournament();
        console.log("Tournament info loaded:", tournamentInfo);
        setCurrentTournament(tournamentInfo);
        if (tournamentInfo.source) {
          setDataSource(tournamentInfo.source);
        }
      } catch (error) {
        console.error("Error loading tournament info:", error);
      } finally {
        setTournamentLoading(false);
      }
    };
    
    loadTournamentInfo();
    
    const tournamentRefreshInterval = setInterval(loadTournamentInfo, 30 * 60 * 1000); // 30 minutes
    
    return () => {
      clearInterval(tournamentRefreshInterval);
    };
  }, []);

  const loadLeaderboardData = async (showToast = false) => {
    try {
      setLoading(!refreshing && !dataInitialized);
      if (showToast) {
        setRefreshing(true);
      }
      
      console.log("Loading leaderboard data, initialized:", dataInitialized);
      
      const data = await fetchLeaderboardData();
      console.log("Fetched leaderboard data:", data.leaderboard.length, "golfers");
      
      if (!data || !data.leaderboard || !Array.isArray(data.leaderboard)) {
        throw new Error("Invalid leaderboard data structure");
      }
      
      previousLeaderboard.current = [...leaderboard];
      
      const sortedLeaderboard = data.leaderboard.sort((a, b) => a.position - b.position);
      setLeaderboard(sortedLeaderboard);
      setLastUpdated(data.lastUpdated);
      setDataSource(data.source);
      setDataSourceError(undefined); // Clear any previous errors on successful fetch
      setError(null);
      setDataInitialized(true);
      
      if (data.source === 'historical-data' || data.source === 'cached-data') {
        setDataSourceError(`Note: Using ${data.source === 'historical-data' ? 'historical' : 'cached'} data as live data could not be fetched.`);
      }
      
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
          description: `Data refreshed at ${formatLastUpdated(data.lastUpdated)}${data.source ? ` from ${data.source}` : ''}`,
        });
      }
      
      localStorage.setItem('leaderboardLastUpdated', data.lastUpdated);
      localStorage.setItem('leaderboardData', JSON.stringify(data.leaderboard));
      if (data.source) {
        localStorage.setItem('leaderboardSource', data.source);
      }
    } catch (err: any) {
      console.error("Leaderboard data fetch error:", err);
      setError("Failed to load leaderboard data. Please try again later.");
      setDataSourceError(`Error: ${err.message || "Unknown error"}`);
      
      if (showToast) {
        toast({
          title: "Update Failed",
          description: "Could not refresh leaderboard data. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    console.log("Manual refresh requested");
    loadLeaderboardData(true);
  };

  const togglePotentialWinnings = () => {
    setShowPotentialWinnings(!showPotentialWinnings);
    localStorage.setItem('showPotentialWinnings', (!showPotentialWinnings).toString());
  };

  useEffect(() => {
    const cachedLastUpdated = localStorage.getItem('leaderboardLastUpdated');
    const cachedData = localStorage.getItem('leaderboardData');
    const cachedSource = localStorage.getItem('leaderboardSource');
    
    if (cachedLastUpdated && cachedData) {
      try {
        console.log("Found cached leaderboard data, initializing...");
        const parsedData = JSON.parse(cachedData);
        setLeaderboard(parsedData);
        setLastUpdated(cachedLastUpdated);
        if (cachedSource) {
          setDataSource(cachedSource);
        }
        setLoading(false);
        setDataInitialized(true);
        
        loadLeaderboardData();
      } catch (e) {
        console.error("Error parsing cached data:", e);
        loadLeaderboardData();
      }
    } else {
      console.log("No cached leaderboard data found");
      loadLeaderboardData();
    }
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = setInterval(() => {
      console.log("Polling for leaderboard updates...");
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
        dataSource={dataSource}
        errorMessage={dataSourceError}
      />
      
      <div className="p-4 bg-white">
        {dataSource && (dataSource === 'historical-data' || dataSource === 'cached-data') && (
          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Using {dataSource === 'historical-data' ? 'Historical' : 'Cached'} Data</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm">
              We're currently unable to fetch live tournament data. Scores shown may not reflect the current tournament standings.
            </AlertDescription>
          </Alert>
        )}
        
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
        
        {error && (
          <div className="text-center text-red-500 py-4 flex items-center justify-center">
            <AlertTriangle size={16} className="mr-1" />
            {error}
          </div>
        )}
        
        {loading ? (
          <LoadingState showPotentialWinnings={showPotentialWinnings} />
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <Info size={24} className="mx-auto mb-2 text-masters-green"/>
            <p>No leaderboard data available. Please try refreshing.</p>
            <button 
              onClick={handleManualRefresh}
              className="mt-4 px-4 py-2 text-sm bg-masters-green text-white rounded hover:bg-masters-green/90"
            >
              Refresh Now
            </button>
          </div>
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
