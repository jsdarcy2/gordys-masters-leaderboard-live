
import { useState, useEffect, useRef, useMemo } from "react";
import { PoolParticipant } from "@/types";
import { fetchPoolStandings, isTournamentInProgress } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PoolStandingsHeader from "@/components/pool/PoolStandingsHeader";
import SearchBar from "@/components/pool/SearchBar";
import ParticipantTable from "@/components/pool/ParticipantTable";
import ShowMoreButton from "@/components/pool/ShowMoreButton";
import PoolStandingsFallback from "@/components/pool/PoolStandingsFallback";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info, Ban, FileSpreadsheet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchPoolStandingsFromGoogleSheets } from "@/services/googleSheetsApi";

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds
const PREVIEW_COUNT = 134; // Show all 134 participants by default
const ERROR_THRESHOLD = 3; // Only show fallback after 3 consecutive errors

const ACTIVE_PARTICIPANTS = 94;
const MISSED_CUT_PARTICIPANTS = 43;

const PoolStandings = () => {
  const [standings, setStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [usingEmergencyData, setUsingEmergencyData] = useState(false);
  const [dataSource, setDataSource] = useState<string>("primary");
  const [criticalError, setCriticalError] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  
  const loadStandingsData = async () => {
    try {
      setLoading(true);
      // Try to fetch from primary source first
      const data = await fetchPoolStandings();
      
      console.log("Fetched pool standings data:", data.length, "participants");
      
      if (data.length === 0) {
        errorCountRef.current++;
        setError("No data available. Please try again later.");
        
        if (errorCountRef.current >= ERROR_THRESHOLD) {
          setCriticalError(true);
        }
        return;
      }
      
      errorCountRef.current = 0;
      setCriticalError(false);
      setStandings(data);
      setDataSource("primary");
      const timestamp = new Date().toISOString();
      setLastUpdated(timestamp);
      setError(null);
      
      if (data[0]?.name === "Matt Rogers" && data[0]?.position === 1 && data[0]?.totalScore === -21) {
        setUsingEmergencyData(true);
      } else {
        setUsingEmergencyData(false);
      }
      
    } catch (err) {
      errorCountRef.current++;
      console.error("Error fetching pool standings:", err);
      setError("Having trouble connecting to the tournament data");
      
      if (errorCountRef.current >= ERROR_THRESHOLD) {
        setCriticalError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const tryGoogleSheets = async () => {
    try {
      setLoading(true);
      toast({
        title: "Trying Google Sheets backup",
        description: "Fetching data from Google Sheets..."
      });
      
      const sheetsData = await fetchPoolStandingsFromGoogleSheets();
      
      if (sheetsData && sheetsData.length > 0) {
        setStandings(sheetsData);
        setDataSource("google-sheets");
        setLastUpdated(new Date().toISOString());
        setCriticalError(false);
        setError(null);
        
        toast({
          title: "Using Google Sheets data",
          description: `Successfully retrieved ${sheetsData.length} participants from Google Sheets`,
        });
      } else {
        toast({
          title: "Google Sheets Error",
          description: "Could not retrieve data from Google Sheets",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error fetching from Google Sheets:", err);
      toast({
        title: "Google Sheets Error",
        description: "Failed to fetch from Google Sheets backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    loadStandingsData();
    toast({
      title: "Refreshing data",
      description: "Getting the latest pool standings...",
    });
  };

  useEffect(() => {
    const checkTournamentStatus = async () => {
      const active = await isTournamentInProgress();
      setIsTournamentActive(active);
      console.log("Tournament active status:", active);
    };
    
    checkTournamentStatus();
    
    const tournamentStatusInterval = setInterval(checkTournamentStatus, 3600000);
    
    return () => {
      clearInterval(tournamentStatusInterval);
    };
  }, [toast]);

  useEffect(() => {
    loadStandingsData();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    if (isTournamentActive) {
      console.log("Setting up 1-minute polling for standings data");
      
      pollingRef.current = setInterval(() => {
        loadStandingsData();
      }, POLLING_INTERVAL);
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isTournamentActive]);

  const filteredStandings = searchQuery 
    ? standings.filter(participant => 
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : standings;

  const displayStandings = showAll 
    ? filteredStandings 
    : filteredStandings.slice(0, PREVIEW_COUNT);
    
  const totalParticipants = standings.length;
  const filteredCount = filteredStandings.length;
  
  const activeParticipantCount = ACTIVE_PARTICIPANTS; 
  const missedCutCount = MISSED_CUT_PARTICIPANTS;

  if (criticalError) {
    return (
      <div className="masters-card">
        <PoolStandingsHeader 
          lastUpdated={lastUpdated} 
          totalParticipants={totalParticipants} 
          loading={loading}
          isTournamentActive={isTournamentActive}
          activeParticipants={activeParticipantCount}
          missedCutCount={missedCutCount}
          onRefresh={handleManualRefresh}
        />
        
        <div className="p-4 bg-white">
          <PoolStandingsFallback
            message="We're having trouble connecting to the data source. You can try refreshing or using our Google Sheets backup."
            onRetry={handleManualRefresh}
            severity="critical"
            tryGoogleSheets={tryGoogleSheets}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="masters-card">
      <PoolStandingsHeader 
        lastUpdated={lastUpdated} 
        totalParticipants={totalParticipants} 
        loading={loading}
        isTournamentActive={isTournamentActive}
        activeParticipants={activeParticipantCount}
        missedCutCount={missedCutCount}
        onRefresh={handleManualRefresh}
      />
      
      <div className="p-4 bg-white">
        {dataSource === "google-sheets" && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm flex justify-between items-center">
              <span>
                Using Google Sheets backup data. Primary data source is currently unavailable.
              </span>
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="ml-2 text-xs px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center"
              >
                <RefreshCw size={12} className="mr-1" />
                Try Primary Source
              </Button>
            </AlertDescription>
          </Alert>
        )}
      
        {usingEmergencyData && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Showing Final Masters Pool Standings</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              The leaderboard displays the final Masters Pool standings. Each participant's score is calculated using their best 4 out of 5 golfer picks.
            </AlertDescription>
          </Alert>
        )}
        
        {!loading && standings.length > 0 && (
          <Alert variant="default" className="mb-4 bg-masters-green/10 border-masters-green/20">
            <Info className="h-4 w-4 text-masters-green" />
            <AlertDescription className="text-masters-dark flex flex-wrap items-center gap-x-4">
              <div>
                <span className="font-medium">{activeParticipantCount}</span> active participants
              </div>
              <div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                  <Ban size={12} />
                  <span>{missedCutCount} missed cut</span>
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {error && !criticalError && (
          <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
            <AlertTitle className="text-amber-800">Connection Issue</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm">
              {error}
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white"
              >
                <RefreshCw size={14} className="mr-1" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {!loading && standings.length > 0 && (
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredCount={filteredCount}
          />
        )}
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {standings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-700 font-medium">No pool standings data available</p>
                <p className="text-gray-500 text-sm mb-4">We're having trouble retrieving the current standings</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleManualRefresh} className="bg-masters-green hover:bg-masters-green/90">
                    <RefreshCw size={16} className="mr-2" />
                    Refresh Data
                  </Button>
                  <Button onClick={tryGoogleSheets} variant="outline" className="border-amber-500 text-amber-600">
                    <FileSpreadsheet size={16} className="mr-2" />
                    Try Google Sheets
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ParticipantTable 
                  displayStandings={displayStandings}
                  searchQuery={searchQuery}
                />
                
                {filteredStandings.length > PREVIEW_COUNT && !searchQuery && (
                  <ShowMoreButton 
                    showAll={showAll}
                    setShowAll={setShowAll}
                    totalCount={filteredStandings.length}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PoolStandings;
