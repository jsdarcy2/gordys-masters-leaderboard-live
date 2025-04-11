
import { useState, useEffect, useRef } from "react";
import { PoolParticipant } from "@/types";
import { fetchPoolStandings, isTournamentInProgress } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PoolStandingsHeader from "@/components/pool/PoolStandingsHeader";
import SearchBar from "@/components/pool/SearchBar";
import ParticipantTable from "@/components/pool/ParticipantTable";
import ShowMoreButton from "@/components/pool/ShowMoreButton";
import { useIsMobile } from "@/hooks/use-mobile";

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds
const PREVIEW_COUNT = 200; // Increased from 15 to 200 to show all participants

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
  
  const loadStandingsData = async () => {
    try {
      setLoading(true);
      const data = await fetchPoolStandings();
      
      console.log("Fetched pool standings data:", data.length, "participants");
      
      setStandings(data);
      const timestamp = new Date().toISOString();
      setLastUpdated(timestamp);
      setError(null);
      
      // Store data in localStorage for consistency across devices
      localStorage.setItem('poolStandingsLastUpdated', timestamp);
      localStorage.setItem('poolStandingsData', JSON.stringify(data));
      
    } catch (err) {
      setError("Failed to load pool standings");
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load pool standings data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check tournament status effect
  useEffect(() => {
    const checkTournamentStatus = async () => {
      const active = await isTournamentInProgress();
      setIsTournamentActive(active);
      console.log("Tournament active status:", active);
      
      // If tournament status changes to active, display a notification
      if (active) {
        toast({
          title: "Tournament In Progress",
          description: "Live data updates every minute during tournament play.",
          duration: 5000,
        });
      }
    };
    
    checkTournamentStatus();
    
    // Check tournament status every hour
    const tournamentStatusInterval = setInterval(checkTournamentStatus, 3600000);
    
    return () => {
      clearInterval(tournamentStatusInterval);
    };
  }, [toast]);

  useEffect(() => {
    // First check if we have cached data
    const cachedLastUpdated = localStorage.getItem('poolStandingsLastUpdated');
    const cachedData = localStorage.getItem('poolStandingsData');
    
    if (cachedLastUpdated && cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setStandings(parsedData);
        setLastUpdated(cachedLastUpdated);
        setLoading(false);
        
        // Then fetch fresh data in the background
        loadStandingsData();
      } catch (e) {
        // If there's an error parsing cached data, load fresh data
        loadStandingsData();
      }
    } else {
      // If no cached data, load fresh data
      loadStandingsData();
    }
    
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
    } else {
      console.log("Tournament not active - polling disabled");
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
          <div className="text-center text-red-500 py-4">{error}</div>
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
      </div>
    </div>
  );
};

export default PoolStandings;
