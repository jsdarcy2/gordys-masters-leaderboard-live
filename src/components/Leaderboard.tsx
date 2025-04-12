
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentTournament } from "@/services/api";
import { useTournamentData } from "@/hooks/use-tournament-data";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { AlertTriangle, Info, Calendar, RefreshCw, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import LoadingState from "./leaderboard/LoadingState";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import LeaderboardTable from "./leaderboard/LeaderboardTable";
import EmergencyFallback from "./leaderboard/EmergencyFallback";
import { DataSource } from "@/types";

const TOURNAMENT_YEAR = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();

// Increased tolerance for issues before showing emergency fallback
const CRITICAL_OUTAGE_THRESHOLD = 5;

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
      (dataHealth?.status === "offline" && consecutiveFailures && consecutiveFailures >= 3);
    
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
      let errorMessage = `Using previously saved data. Last update: ${formatLastUpdated(lastUpdated)}`;
      
      if (dataYear && dataYear !== TOURNAMENT_YEAR) {
        errorMessage += ` Data is from ${dataYear}.`;
      }
      
      setDataSourceError(errorMessage);
    } else if (dataSource === 'no-data') {
      setDataSourceError("Data refresh in progress. Please wait a moment.");
    } else if (dataSource === 'mock-data' as DataSource) {
      setDataSourceError("Estimated scores currently displayed. Live data refresh in progress.");
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
        description: `Data refreshed at ${formatLastUpdated(new Date().toISOString())}`,
      });
      
      if (showEmergencyFallback && dataSource && 
          dataSource !== "mock-data" && 
          dataSource !== "no-data" && 
          dataSource !== "cached-data") {
        setShowEmergencyFallback(false);
      }
    } catch (error) {
      toast({
        title: "Update in Progress",
        description: "Your data will refresh shortly. Please try again in a moment.",
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
          criticalOutage={false} // Avoid showing critical outage banner
        />
        
        <div className="p-4 bg-white">
          <EmergencyFallback 
            onRetry={handleManualRefresh} 
            message="Live scores are updating. Enjoy watching the tournament while we refresh the data."
            severity="warning"
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
        criticalOutage={false} // Never show critical outage banner
      />
      
      <div className="p-4 bg-white">
        <Alert variant="default" className="mb-4 bg-masters-green/10 border-masters-green/20">
          <Trophy className="h-4 w-4 text-masters-green" />
          <AlertTitle className="text-masters-green font-serif">Final 2024 Masters Results</AlertTitle>
          <AlertDescription className="text-masters-dark text-sm">
            Showing the final results from the 2024 Masters Tournament. 
            Justin Rose won his first green jacket with a score of -8.
          </AlertDescription>
        </Alert>
        
        {dataSource === 'no-data' && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Refreshing Data</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              Live tournament data is being refreshed. This will only take a moment.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCw size={14} className="mr-1" />
                Refresh Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {dataSource === 'cached-data' && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Using Recent Data for {dataYear || TOURNAMENT_YEAR} Masters</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              Showing most recent available scores. Live updates will resume momentarily.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCw size={14} className="mr-1" />
                Refresh Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {dataSource === ('mock-data' as DataSource) && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Estimated Standings</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              Displaying estimated tournament positions while we establish connection to live data.
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCw size={14} className="mr-1" />
                Check for Live Data
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
          <div className="text-center text-blue-500 py-4 flex items-center justify-center">
            <RefreshCw size={16} className="mr-1 animate-spin" />
            Refreshing data...
          </div>
        )}
        
        {loading ? (
          <LoadingState showPotentialWinnings={showPotentialWinnings} />
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <Info size={24} className="mx-auto mb-2 text-masters-green"/>
            <p>Loading leaderboard data for {dataYear || TOURNAMENT_YEAR} Masters.</p>
            <p className="mt-2 text-sm text-gray-500">Data will appear momentarily.</p>
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
