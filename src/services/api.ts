import { GolferScore, PoolParticipant, TournamentRound, DataSource } from "@/types";
import { useTournamentData } from "@/hooks/use-tournament-data";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap, scrapeMastersWebsite } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// Google Sheets API health monitoring
export const API_ENDPOINTS = {
  GOOGLE_SHEETS: `https://sheets.googleapis.com/v4/spreadsheets/1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o/values/A1:A1?key=AIzaSyDa_J9wM1OZJ3CMHXWRYzf5u1vIBr6SBcI`
};

// Centralized API health tracking
interface ApiHealthStatus {
  endpoint: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  lastChecked: string;
  successRate: number;
  consecutiveFailures: number;
}

// Initialize health status tracking
const apiHealthStatus: Record<string, ApiHealthStatus> = {};

// Check health of the Google Sheets API endpoint
export const checkApiHealth = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiHealthStatus> => {
  const startTime = performance.now();
  const now = new Date().toISOString();
  
  // Get existing health status or create a new one
  const currentStatus = apiHealthStatus[endpoint] || {
    endpoint,
    status: 'online',
    latency: 0,
    lastChecked: now,
    successRate: 100,
    consecutiveFailures: 0
  };
  
  try {
    // For full requests, we need to validate the response is actual JSON data, not HTML
    const method = options.method || 'GET';
    const response = await fetch(endpoint, {
      ...options,
      method,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    // First check if response is OK
    if (!response.ok) {
      // API responded but with an error
      const updatedStatus: ApiHealthStatus = {
        endpoint,
        status: 'degraded',
        latency,
        lastChecked: now,
        successRate: currentStatus.successRate * 0.9, // Decrease success rate
        consecutiveFailures: currentStatus.consecutiveFailures + 1
      };
      
      apiHealthStatus[endpoint] = updatedStatus;
      return updatedStatus;
    }
    
    // For GET requests, try to parse response as JSON to ensure it's valid data
    if (method === 'GET') {
      const responseText = await response.text();
      
      // Check if response is HTML instead of JSON
      if (responseText.trim().startsWith('<!DOCTYPE html>') || 
          responseText.trim().startsWith('<html')) {
        console.error(`API returned HTML instead of JSON: ${endpoint}`);
        
        const updatedStatus: ApiHealthStatus = {
          endpoint,
          status: 'offline',
          latency,
          lastChecked: now,
          successRate: currentStatus.successRate * 0.8,
          consecutiveFailures: currentStatus.consecutiveFailures + 1
        };
        
        apiHealthStatus[endpoint] = updatedStatus;
        return updatedStatus;
      }
      
      // Try to parse as JSON
      try {
        JSON.parse(responseText);
      } catch (e) {
        console.error(`API returned invalid JSON: ${endpoint}`);
        
        const updatedStatus: ApiHealthStatus = {
          endpoint,
          status: 'offline',
          latency,
          lastChecked: now,
          successRate: currentStatus.successRate * 0.8,
          consecutiveFailures: currentStatus.consecutiveFailures + 1
        };
        
        apiHealthStatus[endpoint] = updatedStatus;
        return updatedStatus;
      }
    }
    
    // If we got here, the response was successful
    const updatedStatus: ApiHealthStatus = {
      endpoint,
      status: latency > 2000 ? 'degraded' : 'online',
      latency,
      lastChecked: now,
      successRate: currentStatus.successRate * 0.9 + 10, // Weighted average
      consecutiveFailures: 0
    };
    
    apiHealthStatus[endpoint] = updatedStatus;
    return updatedStatus;
  } catch (error) {
    const endTime = performance.now();
    
    // API request failed completely
    const updatedStatus: ApiHealthStatus = {
      endpoint,
      status: 'offline',
      latency: endTime - startTime,
      lastChecked: now,
      successRate: currentStatus.successRate * 0.8, // Decrease success rate more significantly
      consecutiveFailures: currentStatus.consecutiveFailures + 1
    };
    
    apiHealthStatus[endpoint] = updatedStatus;
    return updatedStatus;
  }
};

// Get the currently best performing data source - since we only have one source, this is simpler
export const getBestDataSource = (): DataSource => {
  // Check if the Google Sheets API is healthy
  const sheetsStatus = apiHealthStatus[API_ENDPOINTS.GOOGLE_SHEETS];
  
  if (!sheetsStatus || sheetsStatus.status === 'offline') {
    return 'cached-data'; // Use cached data if Google Sheets is offline
  }
  
  return 'google-sheets'; // Now this is a valid DataSource
};

// Get health status for all monitored endpoints
export const getApiHealthStatus = (): ApiHealthStatus[] => {
  return Object.values(apiHealthStatus);
};

// Initialize API health monitoring system
if (typeof window !== 'undefined') {
  // Only run in browser environment
  const checkGoogleSheetsHealth = () => {
    checkApiHealth(API_ENDPOINTS.GOOGLE_SHEETS);
  };
  
  // Initial health check
  checkGoogleSheetsHealth();
  
  // Set up periodic health checks (every 5 minutes)
  setInterval(checkGoogleSheetsHealth, 5 * 60 * 1000);
}
