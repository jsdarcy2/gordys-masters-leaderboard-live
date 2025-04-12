
import { useState, useEffect, useRef } from "react";
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
import { RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds
const PREVIEW_COUNT = 134; // Show all 134 participants by default
const ERROR_THRESHOLD = 3; // Only show fallback after 3 consecutive errors

const PoolStandings = () => {
  const [standings, setStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTournamentActive, setIsTournamentActive] = useState(false);
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
        return;
      }
      
      // Reset error state on success
      errorCountRef.current = 0;
      setStandings(data);
      const timestamp = new Date().toISOString();
      setLastUpdated(timestamp);
      setError(null);
      
    } catch (err) {
      errorCountRef.current++;
      console.error("Error fetching pool standings:", err);
      setError("Having trouble connecting to the tournament data");
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

  // Check tournament status effect
  useEffect(() => {
    const checkTournamentStatus = async () => {
      const active = await isTournamentInProgress();
      setIsTournamentActive(active);
      console.log("Tournament active status:", active);
    };
    
    checkTournamentStatus();
    
    // Check tournament status every hour
    const tournamentStatusInterval = setInterval(checkTournamentStatus, 3600000);
    
    return () => {
      clearInterval(tournamentStatusInterval);
    };
  }, [toast]);

  // Initial data loading
  useEffect(() => {
    loadStandingsData();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Set up polling only when tournament is active
  useEffect(() => {
    // Clear any existing interval
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    // Only set up polling if tournament is active
    if (isTournamentActive) {
      console.log("Setting up 1-minute polling for standings data");
      
      // Poll every minute during active tournament
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

  // Filter standings based on search query
  const filteredStandings = searchQuery 
    ? standings.filter(participant => 
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : standings;

  // Display either all standings or just the preview based on showAll state
  const displayStandings = showAll 
    ? filteredStandings 
    : filteredStandings.slice(0, PREVIEW_COUNT);
    
  const totalParticipants = standings.length;
  const filteredCount = filteredStandings.length;

  return (
    <div className="masters-card">
      <PoolStandingsHeader 
        lastUpdated={lastUpdated} 
        totalParticipants={totalParticipants} 
        loading={loading}
        isTournamentActive={isTournamentActive}
      />
      
      <div className="p-4 bg-white">
        {error && (
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
                <RefreshCcw size={14} className="mr-1" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Search bar */}
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
                <Button onClick={handleManualRefresh} className="bg-masters-green hover:bg-masters-green/90">
                  <RefreshCcw size={16} className="mr-2" />
                  Refresh Data
                </Button>
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
