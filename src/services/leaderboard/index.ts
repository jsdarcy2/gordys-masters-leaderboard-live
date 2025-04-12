
import { GolferScore } from "@/types";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";

// Reexport other leaderboard utilities
export { scrapeMastersWebsite } from './scraper';

// Cache for leaderboard data
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Fetch leaderboard data exclusively from Google Sheets
 */
export async function fetchLeaderboardData(): Promise<{
  leaderboard: GolferScore[];
  source: string;
  lastUpdated: string;
}> {
  const now = Date.now();
  const cacheAge = now - lastFetchTime;
  
  // Use cache if valid and not expired
  if (leaderboardCache && leaderboardCache.length > 0 && cacheAge < CACHE_TTL) {
    console.log(`Using cached leaderboard (${Math.round(cacheAge / 1000)}s old)`);
    return {
      leaderboard: leaderboardCache,
      source: "cached-data",
      lastUpdated: new Date(lastFetchTime).toISOString()
    };
  }
  
  try {
    // Check if Google Sheets is available
    const sheetsAvailable = await checkGoogleSheetsAvailability();
    
    if (sheetsAvailable) {
      console.log("Fetching leaderboard from Google Sheets...");
      const googleSheetsData = await fetchLeaderboardFromGoogleSheets();
      
      if (googleSheetsData && googleSheetsData.length > 0) {
        console.log(`Fetched ${googleSheetsData.length} golfers from Google Sheets`);
        
        // Update cache
        leaderboardCache = googleSheetsData;
        lastFetchTime = now;
        
        return {
          leaderboard: googleSheetsData,
          source: "google-sheets",
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    // If Google Sheets fails and we have a cache, use it regardless of age
    if (leaderboardCache && leaderboardCache.length > 0) {
      console.log("Google Sheets data unavailable. Using expired cache as last resort.");
      return {
        leaderboard: leaderboardCache,
        source: "cached-data",
        lastUpdated: new Date(lastFetchTime).toISOString()
      };
    }
    
    // Everything failed including cache, return empty array
    return {
      leaderboard: [],
      source: "no-data",
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    
    // If we have a cache, return it regardless of age in case of error
    if (leaderboardCache && leaderboardCache.length > 0) {
      console.log("Error fetching leaderboard. Returning cached data.");
      return {
        leaderboard: leaderboardCache,
        source: "cached-data",
        lastUpdated: new Date(lastFetchTime).toISOString()
      };
    }
    
    // Return empty array as last resort
    return {
      leaderboard: [],
      source: "no-data",
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Build a map of golfer names to their scores
 */
export function buildGolferScoreMap(leaderboard: GolferScore[]): Record<string, number> {
  const map: Record<string, number> = {};
  
  leaderboard.forEach(golfer => {
    map[golfer.name] = golfer.score;
  });
  
  return map;
}
