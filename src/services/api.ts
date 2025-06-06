
import { DataSource } from "@/types";
import { clearLeaderboardCache } from "./leaderboard";
import { clearPoolStandingsCache } from "./pool";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap, clearLeaderboardCache } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// API endpoints
export const API_ENDPOINTS = {
  // Primary API: Sportradar Masters API
  SPORTRADAR_MASTERS: "https://api.sportradar.us/golf/trial/v3/en/tournaments/sr:tournament:975/summary.json"
};

// Get the Sportradar API key from env
export const SPORTRADAR_API_KEY = "6U9WiXuo0kwq8PUNTrkAwLhOz60Obg8lZQN0Zval";

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

// Get the best data source
export const getBestDataSource = async (): Promise<DataSource> => {
  try {
    // Use Sportradar API
    const sportRadarEndpoint = `${API_ENDPOINTS.SPORTRADAR_MASTERS}?api_key=${SPORTRADAR_API_KEY}`;
    const primaryHealthy = await checkApiHealth(sportRadarEndpoint);
    
    if (primaryHealthy) {
      return 'sportradar-api';
    }
    
    // If primary is unavailable, fallback to cached data
    return 'cached-data';
  } catch (error) {
    console.error("Error determining best data source:", error);
    return 'sportradar-api'; // Default fallback
  }
};

/**
 * Force refresh pool data
 * Returns a boolean indicating if refresh was successful
 */
export const forceRefreshPoolData = async (): Promise<boolean> => {
  try {
    console.log("Starting force refresh of pool data...");
    
    // Clear caches
    clearLeaderboardCache();
    clearPoolStandingsCache();
    console.log("Caches cleared");
    
    console.log("Forced refresh of pool data completed successfully");
    return true;
  } catch (error) {
    console.error("Error forcing refresh:", error);
    return false;
  }
};
