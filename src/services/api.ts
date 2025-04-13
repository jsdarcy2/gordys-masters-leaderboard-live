
import { DataSource } from "@/types";
import { clearLeaderboardCache } from "./leaderboard";
import { clearPoolStandingsCache } from "./pool";
import { forceRefreshFromGoogleSheets, checkGoogleSheetsAvailability } from "./googleSheetsApi";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap, clearLeaderboardCache } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// API endpoints
export const API_ENDPOINTS = {
  // Primary API: Sportradar Masters API
  SPORTRADAR_MASTERS: "https://api.sportradar.us/golf/trial/v3/en/tournaments/sr:tournament:975/summary.json",
  // Fallback API: Masters.com JSON endpoint
  MASTERS_SCORES: "https://www.masters.com/en_US/scores/feeds/2025/scores.json"
};

// Get the Sportradar API key from env
export const SPORTRADAR_API_KEY = import.meta.env.VITE_SPORTS_API_KEY || "key_not_set";

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
export const getBestDataSource = async (): Promise<DataSource> => {
  try {
    // First check if Sportradar API is available
    const sportRadarEndpoint = `${API_ENDPOINTS.SPORTRADAR_MASTERS}?api_key=${SPORTRADAR_API_KEY}`;
    const primaryHealthy = await checkApiHealth(sportRadarEndpoint);
    
    if (primaryHealthy) {
      return 'sportradar-api';
    }
    
    // Next check if Masters.com API is available
    const mastersApiHealthy = await checkApiHealth(API_ENDPOINTS.MASTERS_SCORES);
    
    if (mastersApiHealthy) {
      return 'masters-scores-api';
    }
    
    // If primary is unavailable, check Google Sheets availability
    const { checkGoogleSheetsAvailability } = await import('./googleSheetsApi');
    const sheetsAvailable = await checkGoogleSheetsAvailability();
    
    if (sheetsAvailable) {
      return 'google-sheets';
    }
    
    // Fallback to mock data if both are unavailable
    return 'mock-data';
  } catch (error) {
    console.error("Error determining best data source:", error);
    return 'sportradar-api'; // Default fallback
  }
};

/**
 * Force refresh pool data from Google Sheets
 * Returns a boolean indicating if refresh was successful
 */
export const forceRefreshPoolData = async (): Promise<boolean> => {
  try {
    console.log("Starting force refresh of pool data...");
    
    // Clear caches first
    clearLeaderboardCache();
    clearPoolStandingsCache();
    console.log("Caches cleared");
    
    // Check if Google Sheets is available before attempting refresh
    const sheetsAvailable = await checkGoogleSheetsAvailability();
    
    if (!sheetsAvailable) {
      console.warn("Google Sheets is not available for refresh");
      return false;
    }
    
    // Force refresh from Google Sheets
    const refreshSuccessful = await forceRefreshFromGoogleSheets();
    
    if (!refreshSuccessful) {
      console.warn("Google Sheets refresh was not successful");
      return false;
    }
    
    console.log("Forced refresh of pool data completed successfully");
    return true;
  } catch (error) {
    console.error("Error forcing refresh:", error);
    return false;
  }
};

/**
 * Function to enable direct Google Sheets data retrieval
 * This now supports fallback to mock data when API is unavailable
 */
export const fetchDataFromGoogleSheets = async (dataType: 'leaderboard' | 'pool'): Promise<any> => {
  const { fetchLeaderboardFromGoogleSheets, fetchPoolStandingsFromGoogleSheets } = await import('./googleSheetsApi');
  
  try {
    // First check if Google Sheets is available
    const sheetsAvailable = await checkGoogleSheetsAvailability();
    
    if (!sheetsAvailable) {
      console.warn(`Google Sheets is not available for fetching ${dataType}`);
      throw new Error("Google Sheets API is not available");
    }
    
    if (dataType === 'leaderboard') {
      return await fetchLeaderboardFromGoogleSheets();
    } else {
      return await fetchPoolStandingsFromGoogleSheets();
    }
  } catch (error) {
    console.error(`Error fetching ${dataType} from Google Sheets:`, error);
    throw error;
  }
};
