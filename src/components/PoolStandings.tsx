
import { useState, useEffect } from "react";
import { PoolParticipant } from "@/types";
import { fetchPoolStandings } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PoolStandingsHeader from "@/components/pool/PoolStandingsHeader";
import SearchBar from "@/components/pool/SearchBar";
import ParticipantTable from "@/components/pool/ParticipantTable";
import ShowMoreButton from "@/components/pool/ShowMoreButton";

const PoolStandings = () => {
  const [standings, setStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const PREVIEW_COUNT = 15;

  const loadStandingsData = async () => {
    try {
      setLoading(true);
      const data = await fetchPoolStandings();
      setStandings(data);
      setLastUpdated(new Date().toISOString());
      setError(null);
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

  useEffect(() => {
    loadStandingsData();
    
    // Set up polling for real-time updates (every 60 seconds)
    const intervalId = setInterval(() => {
      loadStandingsData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

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
