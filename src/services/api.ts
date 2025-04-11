
import { GolferScore, PoolParticipant, TournamentRound, DataSource } from "@/types";
import { useTournamentData } from "@/hooks/use-tournament-data";

// Re-export functions from modular service files
export { isTournamentInProgress, getCurrentTournament } from './tournament';
export { fetchLeaderboardData, buildGolferScoreMap, scrapeMastersWebsite } from './leaderboard';
export { fetchPoolStandings, fetchPlayerSelections } from './pool';
export { useTournamentData } from '@/hooks/use-tournament-data';

// New centralized API health monitoring system
export const API_ENDPOINTS = {
  PGA_TOUR: 'https://statdata.pgatour.com/r/current/leaderboard-v2mini.json',
  ESPN: 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard/events/{year}/masters/leaderboard',
  SPORTS_DATA: 'https://golf-live-data.p.rapidapi.com/leaderboard/masters/{year}',
  MASTERS_WEB: 'https://www.masters.com/en_US/scores/index.html'
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

// Check health of an API endpoint
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
    // Perform a HEAD request when possible to minimize data transfer
    const method = options.method || 'HEAD';
    const response = await fetch(endpoint, {
      ...options,
      method,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache'
      }
    });
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    // Update health status based on response
    if (response.ok) {
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
    } else {
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

// Get the currently best performing data source
export const getBestDataSource = (): DataSource => {
  // First, check if we have health data
  if (Object.keys(apiHealthStatus).length === 0) {
    return 'pgatour-api'; // Default to PGA Tour API if no health data
  }
  
  // Get all sources that are online or degraded
  const availableSources = Object.values(apiHealthStatus)
    .filter(status => status.status !== 'offline');
  
  if (availableSources.length === 0) {
    // All sources offline - fallback to cache
    return 'cached-data';
  }
  
  // Sort by status (online > degraded) and then by success rate
  availableSources.sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return b.successRate - a.successRate;
  });
  
  // Map endpoint to data source type
  const endpointToSource: Record<string, DataSource> = {
    [API_ENDPOINTS.PGA_TOUR]: 'pgatour-api',
    [API_ENDPOINTS.ESPN]: 'espn-api',
    [API_ENDPOINTS.SPORTS_DATA]: 'sportsdata-api',
    [API_ENDPOINTS.MASTERS_WEB]: 'masters-scraper'
  };
  
  return endpointToSource[availableSources[0].endpoint] || 'cached-data';
};

// Initialize health checks for primary APIs
export const initializeApiHealthMonitoring = () => {
  const year = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();
  
  // Replace {year} placeholder in URLs
  const pgaTourEndpoint = API_ENDPOINTS.PGA_TOUR;
  const espnEndpoint = API_ENDPOINTS.ESPN.replace('{year}', year);
  const sportsDataEndpoint = API_ENDPOINTS.SPORTS_DATA.replace('{year}', year);
  const mastersWebEndpoint = API_ENDPOINTS.MASTERS_WEB;
  
  // Initial health checks
  checkApiHealth(pgaTourEndpoint);
  checkApiHealth(espnEndpoint);
  checkApiHealth(sportsDataEndpoint, {
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_SPORTS_API_KEY || 'fallback-key-for-dev',
      'X-RapidAPI-Host': 'golf-live-data.p.rapidapi.com'
    }
  });
  checkApiHealth(mastersWebEndpoint);
  
  // Set up periodic health checks (every 5 minutes)
  setInterval(() => {
    checkApiHealth(pgaTourEndpoint);
    checkApiHealth(espnEndpoint);
    checkApiHealth(sportsDataEndpoint, {
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_SPORTS_API_KEY || 'fallback-key-for-dev',
        'X-RapidAPI-Host': 'golf-live-data.p.rapidapi.com'
      }
    });
    checkApiHealth(mastersWebEndpoint);
  }, 5 * 60 * 1000); // 5 minutes
};

// Get health status for all monitored endpoints
export const getApiHealthStatus = (): ApiHealthStatus[] => {
  return Object.values(apiHealthStatus);
};

// Initialize API health monitoring system
if (typeof window !== 'undefined') {
  // Only run in browser environment
  initializeApiHealthMonitoring();
}
