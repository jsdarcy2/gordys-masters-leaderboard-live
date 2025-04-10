
import { useState, useEffect } from "react";
import { PoolParticipant } from "@/types";
import { fetchPoolStandings } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Clock, ChevronDown, ChevronUp, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const PoolStandings = () => {
  const [standings, setStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const PREVIEW_COUNT = 15; // Increased from 10 to show more in preview

  const getScoreClass = (score: number) => {
    if (score < 0) return "text-masters-green font-bold";
    if (score > 0) return "text-red-600";
    return "";
  };

  const formatScore = (score: number) => {
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

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

  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
      <div className="masters-header">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-serif">
            Pool Standings
          </h2>
          <div className="flex items-center gap-2">
            {!loading && totalParticipants > 0 && (
              <div className="flex items-center text-sm text-masters-yellow">
                <Users size={14} className="mr-1" />
                <span>{totalParticipants} Participants</span>
              </div>
            )}
            {!loading && lastUpdated && (
              <div className="flex items-center text-sm text-masters-yellow">
                <Clock size={14} className="mr-1" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
        )}
        
        {/* Search bar */}
        {!loading && standings.length > 0 && (
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-masters-green border-opacity-50 focus-visible:ring-masters-green"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">
                Found {filteredCount} {filteredCount === 1 ? 'participant' : 'participants'}
              </p>
            )}
          </div>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-masters-green">
                  <TableHead className="masters-table-header rounded-tl-md w-[80px]">Pos</TableHead>
                  <TableHead className="masters-table-header">Name</TableHead>
                  <TableHead className="masters-table-header text-right w-[100px]">Points</TableHead>
                  <TableHead className="masters-table-header hidden md:table-cell rounded-tr-md">Picks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayStandings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {searchQuery 
                        ? "No participants match your search" 
                        : "No standings data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayStandings.map((participant, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
                      <TableCell className="py-3 font-medium">
                        {participant.position === 1 && (
                          <span className="inline-flex items-center">
                            <Award size={16} className="text-masters-yellow mr-1" />
                            {participant.position}
                          </span>
                        )}
                        {participant.position !== 1 && participant.position}
                      </TableCell>
                      <TableCell className="py-3 font-medium">
                        {participant.name}
                        {!participant.paid && (
                          <span className="ml-2 text-xs text-red-500">(Unpaid)</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-right font-medium">
                        <span className={getScoreClass(participant.totalPoints)}>
                          {formatScore(participant.totalPoints)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {participant.picks.map((pick, i) => (
                            <span 
                              key={i}
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                participant.pickScores && participant.pickScores[pick] < 0
                                  ? "bg-green-100"
                                  : participant.pickScores && participant.pickScores[pick] > 0
                                  ? "bg-red-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {pick} 
                              {participant.pickScores && (
                                <span className={getScoreClass(participant.pickScores[pick])}>
                                  {" "}({formatScore(participant.pickScores[pick])})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {filteredStandings.length > PREVIEW_COUNT && !searchQuery && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)}
                  className="text-masters-green border-masters-green hover:bg-masters-green/10 focus:ring-2 focus:ring-masters-green/30"
                >
                  {showAll ? (
                    <>
                      <span>Show Preview</span>
                      <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Show All {filteredStandings.length} Participants</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolStandings;
