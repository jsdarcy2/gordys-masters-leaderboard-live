
import { useState, useEffect } from "react";
import { PoolParticipant } from "@/types";
import { fetchPoolStandings } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Clock } from "lucide-react";

const PoolStandings = () => {
  const [standings, setStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

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

  return (
    <div className="masters-card">
      <div className="masters-header">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-serif">
            Pool Standings
          </h2>
          {!loading && lastUpdated && (
            <div className="flex items-center text-sm text-masters-yellow">
              <Clock size={14} className="mr-1" />
              <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
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
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-masters-green">
                  <th className="masters-table-header rounded-tl-md">Pos</th>
                  <th className="masters-table-header">Name</th>
                  <th className="masters-table-header text-right">Points</th>
                  <th className="masters-table-header hidden md:table-cell rounded-tr-md">Picks</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((participant, index) => (
                  <tr key={index} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
                    <td className="px-2 py-3 font-medium">
                      {participant.position === 1 && (
                        <span className="inline-flex items-center">
                          <Award size={16} className="text-masters-yellow mr-1" />
                          {participant.position}
                        </span>
                      )}
                      {participant.position !== 1 && participant.position}
                    </td>
                    <td className="px-2 py-3 font-medium">{participant.name}</td>
                    <td className="px-2 py-3 text-right font-medium">{participant.totalPoints}</td>
                    <td className="px-2 py-3 hidden md:table-cell">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolStandings;
