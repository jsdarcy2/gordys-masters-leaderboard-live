import { DataSource } from "@/types";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// Masters.com API endpoint - Updating to use our own hosted API
export const API_ENDPOINTS = {
  MASTERS_SCORES: "https://lovable-uploads/c7c1aa26-ae59-4ff9-abfe-aa16c5c35bd4.json"
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

/**
 * Force refresh pool data from Google Sheets
 */
export const forceRefreshPoolData = async (): Promise<void> => {
  try {
    // Clear caches first
    clearLeaderboardCache();
    
    // Try to fetch fresh data from Google Sheets
    const freshSheetData = await fetchLeaderboardFromGoogleSheets();
    
    console.log("Forced refresh from Google Sheets:", freshSheetData.length, "golfers");
    return Promise.resolve();
  } catch (error) {
    console.error("Error forcing refresh from Google Sheets:", error);
    return Promise.reject(error);
  }
};
