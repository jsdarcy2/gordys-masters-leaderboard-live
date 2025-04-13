
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
import SyncStatusBadge from "@/components/pool/SyncStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info, Ban } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
            message="We're having trouble connecting to the data source. Please try refreshing."
            onRetry={handleManualRefresh}
            severity="critical"
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
        {usingEmergencyData && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200 flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="ml-2">
                <AlertTitle className="text-blue-800">Showing Final Masters Pool Standings</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  The leaderboard displays the final Masters Pool standings. Each participant's score is calculated using their best 4 out of 5 golfer picks.
                </AlertDescription>
              </div>
            </div>
            <SyncStatusBadge />
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
              <div className="ml-auto">
                <SyncStatusBadge />
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
                className="mt-2 w-full text-xs px-2 py-1 bg-white border border-amber-200 rounded hover:bg-amber-50 transition-colors"
              >
                <RefreshCcw size={12} className="mr-1" />
                Refresh Data
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-4">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            filteredCount={filteredCount}
            totalCount={totalParticipants}
          />
        </div>
        
        {loading ? (
          <div className="space-y-2 mt-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <ParticipantTable 
              participants={displayStandings} 
              isMobile={isMobile}
              emptyMessage="No participants match your search query."
            />
            
            {filteredStandings.length > PREVIEW_COUNT && (
              <ShowMoreButton 
                showAll={showAll} 
                setShowAll={setShowAll} 
                totalCount={filteredStandings.length}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PoolStandings;
