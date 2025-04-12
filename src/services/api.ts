
import { DataSource } from "@/types";
import { clearLeaderboardCache } from "./leaderboard";
import { clearPoolStandingsCache } from "./pool";
import { forceRefreshFromGoogleSheets } from "./googleSheetsApi";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap, clearLeaderboardCache } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// Masters API endpoint - Using a mock JSON file
export const API_ENDPOINTS = {
  MASTERS_SCORES: "https://run.mocky.io/v3/cc5b7d16-7b22-401e-800a-3e92c6d2f2bb"
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
export const getBestDataSource = async (): Promise<DataSource> => {
  try {
    // First check if our primary API is available
    const primaryHealthy = await checkApiHealth(API_ENDPOINTS.MASTERS_SCORES);
    
    if (primaryHealthy) {
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
    return 'masters-scores-api'; // Default fallback
  }
};

/**
 * Force refresh pool data from Google Sheets
 */
export const forceRefreshPoolData = async (): Promise<void> => {
  try {
    // Clear caches first
    clearLeaderboardCache();
    clearPoolStandingsCache();
    
    // Force refresh from Google Sheets
    const sheetsAvailable = await forceRefreshFromGoogleSheets();
    
    if (!sheetsAvailable) {
      console.warn("Google Sheets is not available for refresh");
    }
    
    console.log("Forced refresh of pool data completed");
    return Promise.resolve();
  } catch (error) {
    console.error("Error forcing refresh:", error);
    return Promise.reject(error);
  }
};

/**
 * Function to enable direct Google Sheets data retrieval
 * This now supports fallback to mock data when API is unavailable
 */
export const fetchDataFromGoogleSheets = async (dataType: 'leaderboard' | 'pool'): Promise<any> => {
  const { fetchLeaderboardFromGoogleSheets, fetchPoolStandingsFromGoogleSheets } = await import('./googleSheetsApi');
  
  try {
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
