
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
    if (score < 0) return "score-under";
    if (score > 0) return "score-over";
    return "score-even";
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl font-serif text-masters-green">
            Masters Tournament Leaderboard
          </CardTitle>
          {!loading && lastUpdated && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
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
                  <th className="px-2 py-3 font-serif font-medium text-masters-green">Pos</th>
                  <th className="px-2 py-3 font-serif font-medium text-masters-green">Player</th>
                  <th className="px-2 py-3 text-right font-serif font-medium text-masters-green">Score</th>
                  <th className="px-2 py-3 text-right font-serif font-medium text-masters-green">Today</th>
                  <th className="px-2 py-3 text-right font-serif font-medium text-masters-green">Thru</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((golfer, index) => (
                  <tr key={index} className="scoreboard-row">
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
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
