import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentTournament } from "@/services/api";
import { useTournamentData } from "@/hooks/use-tournament-data";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { AlertTriangle, Info, Calendar, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import LoadingState from "./leaderboard/LoadingState";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import LeaderboardTable from "./leaderboard/LeaderboardTable";
import EmergencyFallback from "./leaderboard/EmergencyFallback";

const TOURNAMENT_YEAR = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();
const CRITICAL_OUTAGE_THRESHOLD = 2;

interface LeaderboardProps {
  forceCriticalOutage?: boolean;
}

const Leaderboard = ({ forceCriticalOutage = false }: LeaderboardProps) => {
  const { 
    leaderboard, 
    loading, 
    error, 
    lastUpdated, 
    dataSource, 
    dataYear,
    refreshData,
    hasLiveData,
    dataHealth,
    consecutiveFailures
  } = useTournamentData();
  
  const [refreshing, setRefreshing] = useState(false);
  const [changedPositions, setChangedPositions] = useState<Record<string, 'up' | 'down' | null>>({});
  const [showPotentialWinnings, setShowPotentialWinnings] = useState<boolean>(true);
  const [currentTournament, setCurrentTournament] = useState<any>(null);
  const [tournamentLoading, setTournamentLoading] = useState<boolean>(true);
  const [dataSourceError, setDataSourceError] = useState<string | undefined>(undefined);
  const [showEmergencyFallback, setShowEmergencyFallback] = useState<boolean>(false);
  const previousLeaderboard = useRef(leaderboard);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (forceCriticalOutage) {
      console.log("Forcing critical outage mode from prop");
      setShowEmergencyFallback(true);
      return;
    }

    const shouldShowEmergency = 
      (consecutiveFailures && consecutiveFailures >= CRITICAL_OUTAGE_THRESHOLD) ||
      (dataHealth?.status === "offline" && consecutiveFailures && consecutiveFailures >= 1) ||
      (dataSource === "mock-data") || 
      (dataSource === "no-data" && consecutiveFailures && consecutiveFailures >= 1);
    
    console.log("Emergency fallback check:", { 
      consecutiveFailures, 
      dataHealthStatus: dataHealth?.status,
      dataSource,
      shouldShowEmergency
    });
    
    setShowEmergencyFallback(shouldShowEmergency);
  }, [consecutiveFailures, dataHealth, dataSource, forceCriticalOutage]);

  useEffect(() => {
    const loadTournamentInfo = async () => {
      try {
        setTournamentLoading(true);
        const tournamentInfo = await getCurrentTournament();
        console.log("Tournament info loaded:", tournamentInfo);
        setCurrentTournament(tournamentInfo);
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

  useEffect(() => {
    if (previousLeaderboard.current.length > 0) {
      const newChanges: Record<string, 'up' | 'down' | null> = {};
      
      leaderboard.forEach(golfer => {
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
    
    previousLeaderboard.current = leaderboard;
  }, [leaderboard, toast]);

  useEffect(() => {
    if (dataSource === 'cached-data') {
      let errorMessage = `Using cached data as we couldn't fetch fresh data. Last update: ${formatLastUpdated(lastUpdated)}`;
      
      if (dataYear && dataYear !== TOURNAMENT_YEAR) {
        errorMessage += ` Data is from ${dataYear} instead of ${TOURNAMENT_YEAR}.`;
      }
      
      setDataSourceError(errorMessage);
    } else if (dataSource === 'no-data') {
      setDataSourceError("Unable to fetch tournament data. Please check your connection and try again.");
    } else if (dataSource === 'mock-data') {
      setDataSourceError("EMERGENCY MODE: All data sources are unavailable. Displaying backup data.");
    } else {
      setDataSourceError(undefined);
    }
  }, [dataSource, dataYear, lastUpdated]);

  const handleManualRefresh = async () => {
    console.log("Manual refresh requested");
    setRefreshing(true);
    
    try {
      await refreshData(true);
      toast({
        title: "Leaderboard Updated",
        description: `Data refreshed at ${formatLastUpdated(new Date().toISOString())}${dataSource ? ` from ${dataSource}` : ''}`,
      });
      
      if (showEmergencyFallback && dataSource && 
          dataSource !== "mock-data" && 
          dataSource !== "no-data" && 
          dataSource !== "cached-data") {
        setShowEmergencyFallback(false);
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not refresh leaderboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
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

  useEffect(() => {
    document.title = "Masters Leaderboard - Live Tournament Standings";
    
    return () => {
      document.title = "Gordy's Masters Pool";
    };
  }, []);

  const formatTournamentDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  console.log("Render Leaderboard, showEmergencyFallback:", showEmergencyFallback);

  if (showEmergencyFallback) {
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
          tournamentYear={dataYear || TOURNAMENT_YEAR}
          hasLiveData={false}
          dataHealth={dataHealth}
          criticalOutage={true}
        />
        
        <div className="p-4 bg-white">
          <EmergencyFallback 
            onRetry={handleManualRefresh} 
            message="We're experiencing technical difficulties with our live scoring. Enjoy the live broadcast while our team resolves the issue."
          />
        </div>
      </div>
    );
  }

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
        tournamentYear={dataYear || TOURNAMENT_YEAR}
        hasLiveData={hasLiveData}
        dataHealth={dataHealth}
      />
      
      <div className="p-4 bg-white">
        {dataSource === 'no-data' && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Unable to fetch tournament data</AlertTitle>
            <AlertDescription className="text-red-700 text-sm">
              We couldn't retrieve live tournament data at this time. Please check your connection and try again.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCcw size={14} className="mr-1" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {dataSource === 'cached-data' && (
          <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Using Cached Data for {dataYear || TOURNAMENT_YEAR} Masters</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm">
              We're currently unable to fetch live tournament data. Scores shown may not reflect the current tournament standings.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCcw size={14} className="mr-1" />
                Refresh Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {dataSource === 'mock-data' && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">EMERGENCY MODE: Using Backup Data</AlertTitle>
            <AlertDescription className="text-red-700 text-sm">
              All data sources are currently unavailable. The data shown is not live tournament data.
              Our systems are continuously attempting to restore live data.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCcw size={14} className="mr-1" />
                Try Again
              </Button>
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
        
        {error && !showEmergencyFallback && (
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
            <p>No leaderboard data available for {dataYear || TOURNAMENT_YEAR} Masters.</p>
            <p className="mt-2 text-sm text-gray-500">We're having trouble connecting to our data sources.</p>
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
