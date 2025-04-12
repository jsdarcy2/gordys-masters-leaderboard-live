
import { GolferScore } from "@/types";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";

// Reexport other leaderboard utilities
export { scrapeMastersWebsite } from './scraper';

// Cache for leaderboard data
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Fetch leaderboard data with improved reliability and multiple data sources
 * Now with Google Sheets integration as a primary source
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
    // First check if Google Sheets is available
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
    
    // If Google Sheets fails, try to get data from existing sources
    console.log("Google Sheets data unavailable, falling back to primary API sources");
    
    // Here you would call your existing fetchFromPGATour, fetchFromESPN, etc.
    // For now, we're returning an empty result
    
    // If all sources fail and we have a cache, use it regardless of age
    if (leaderboardCache && leaderboardCache.length > 0) {
      console.log("All data sources failed. Using expired cache as last resort.");
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
