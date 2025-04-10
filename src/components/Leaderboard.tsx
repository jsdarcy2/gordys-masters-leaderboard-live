
import { GolferScore } from "@/types";
import { useEffect, useState } from "react";
import { fetchLeaderboardData } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<GolferScore[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getScoreClass = (score: number) => {
    if (score < 0) return "text-masters-green font-bold";
    if (score > 0) return "text-red-600";
    return "text-black";
  };

  const formatScore = (score: number) => {
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboardData();
      setLeaderboard(data.leaderboard);
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (err) {
      setError("Failed to load leaderboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
    
    // Set up polling for real-time updates (every 60 seconds)
    const intervalId = setInterval(() => {
      loadLeaderboardData();
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
            Masters Tournament Leaderboard
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
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-masters-green">
                  <th className="masters-table-header rounded-tl-md">Pos</th>
                  <th className="masters-table-header">Player</th>
                  <th className="masters-table-header text-right">Score</th>
                  <th className="masters-table-header text-right">Today</th>
                  <th className="masters-table-header text-right rounded-tr-md">Thru</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((golfer, index) => (
                  <tr key={index} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
                    <td className="px-2 py-3 font-medium">{golfer.position}</td>
                    <td className="px-2 py-3 font-medium">{golfer.name}</td>
                    <td className={`px-2 py-3 text-right ${getScoreClass(golfer.score)}`}>
                      {formatScore(golfer.score)}
                    </td>
                    <td className={`px-2 py-3 text-right ${getScoreClass(golfer.today)}`}>
                      {formatScore(golfer.today)}
                    </td>
                    <td className="px-2 py-3 text-right">{golfer.thru}</td>
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

export default Leaderboard;
