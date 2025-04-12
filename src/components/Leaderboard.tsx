import React, { useState, useEffect, useCallback } from "react";
import LeaderboardTable from "./LeaderboardTable";
import LeaderboardHeader from "./leaderboard/LeaderboardHeader";
import { GolferScore } from "@/types";
import { fetchLeaderboardData } from "@/services/leaderboard";
import { buildGolferScoreMap } from "@/utils/scoringUtils";
import { useToast } from "@/hooks/use-toast";
import { isTournamentInProgress } from "@/services/api";

interface LeaderboardProps {
  forceCriticalOutage?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ forceCriticalOutage = false }) => {
  const [leaderboard, setLeaderboard] = useState<GolferScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [tournamentActive, setTournamentActive] = useState(false);
  const [changedPositions, setChangedPositions] = useState<Record<string, 'up' | 'down' | null>>({});
  
  // Extract these from existing hooks or add them if not present
  const [dataSource, setDataSource] = useState<string>("loading");
  const { toast } = useToast();
  
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Use the existing fetchLeaderboardData function or whatever you're using
      const result = await fetchLeaderboardData();
      setLeaderboard(result.leaderboard);
      setLastUpdated(result.lastUpdated);
      setDataSource(result.source);
      // Reset any other state as needed
      setError(null);
    } catch (error) {
      console.error("Error refreshing leaderboard:", error);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    const loadLeaderboardData = async () => {
      setLoading(true);
      try {
        const result = await fetchLeaderboardData();
        setLeaderboard(result.leaderboard);
        setLastUpdated(result.lastUpdated);
        setDataSource(result.source);
        setError(null);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboardData();
  }, []);

  useEffect(() => {
    const checkTournamentStatus = async () => {
      try {
        const isActive = await isTournamentInProgress();
        setTournamentActive(isActive);
      } catch (error) {
        console.error("Error checking tournament status:", error);
      }
    };

    checkTournamentStatus();
  }, []);

  useEffect(() => {
    const updatePositions = (oldLeaderboard: GolferScore[], newLeaderboard: GolferScore[]) => {
      const oldPositions: Record<string, number> = {};
      oldLeaderboard.forEach((golfer, index) => {
        oldPositions[golfer.name] = golfer.position;
      });

      const newPositions: Record<string, 'up' | 'down' | null> = {};
      newLeaderboard.forEach(golfer => {
        const oldPosition = oldPositions[golfer.name];
        if (oldPosition) {
          if (golfer.position < oldPosition) {
            newPositions[golfer.name] = 'up';
          } else if (golfer.position > oldPosition) {
            newPositions[golfer.name] = 'down';
          } else {
            newPositions[golfer.name] = null;
          }
        } else {
          newPositions[golfer.name] = null;
        }
      });

      setChangedPositions(newPositions);
    };

    if (leaderboard.length > 0) {
      fetchLeaderboardData().then(result => {
        updatePositions(leaderboard, result.leaderboard);
      }).catch(error => {
        console.error("Error updating positions:", error);
      });
    }
  }, [leaderboard]);

  return (
    <div className="masters-card">
      <LeaderboardHeader 
        lastUpdated={lastUpdated} 
        loading={loading} 
        refreshing={refreshing}
        tournamentActive={tournamentActive}
        onRefresh={refreshData}
      />
      
      <div className="p-4 relative">
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            Loading leaderboard data...
          </div>
        ) : (
          <>
            <LeaderboardTable 
              leaderboard={leaderboard}
              refreshing={refreshing}
              changedPositions={changedPositions}
              dataSource={dataSource}
              onRefresh={refreshData}
            />
            
            <div className="mt-4 text-gray-500 text-sm">
              Last updated: {lastUpdated}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
