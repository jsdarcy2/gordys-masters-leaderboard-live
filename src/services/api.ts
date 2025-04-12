
import { DataSource } from "@/types";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// Masters.com API endpoint
export const API_ENDPOINTS = {
  MASTERS_SCORES: "https://www.masters.com/en_US/scores/feeds/2025/scores.json"
};

// Simple API health check function
export const checkApiHealth = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<boolean> => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Get the best data source (simplified)
export const getBestDataSource = (): DataSource => {
  return 'masters-scores-api';
};
