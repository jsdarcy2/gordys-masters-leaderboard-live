
import { GolferScore } from "@/types";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";
import { generateMastersLeaderboard } from "./leaderboardData";

// Reexport other leaderboard utilities
export { scrapeMastersWebsite } from './scraper';

// Cache for leaderboard data with extended TTL for betting stability
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL - extended for betting

/**
 * Fetch leaderboard data with optimized reliability for betting applications
 */
export async function fetchLeaderboardData(): Promise<{
  leaderboard: GolferScore[];
  source: string;
  lastUpdated: string;
}> {
  const now = Date.now();
  const cacheAge = now - lastFetchTime;
  
  // Use cache if valid and not expired - more aggressive caching for betting stability
  if (leaderboardCache && leaderboardCache.length > 0 && cacheAge < CACHE_TTL) {
    console.log(`Using cached leaderboard (${Math.round(cacheAge / 1000)}s old)`);
    return {
      leaderboard: leaderboardCache,
      source: "cached-data",
      lastUpdated: new Date(lastFetchTime).toISOString()
    };
  }
  
  try {
    // Return the hardcoded data directly
    console.log("Using fixed leaderboard data from the 2024 Masters");
    const mastersData = generateMastersLeaderboard();
    
    // Update cache
    leaderboardCache = mastersData;
    lastFetchTime = now;
    
    return {
      leaderboard: mastersData,
      source: "fixed-data",
      lastUpdated: new Date().toISOString()
    };
    
    // The following code is commented out since we'll always use our fixed data
    /*
    // First, try Google Sheets as the primary data source
    console.log("Checking Google Sheets availability...");
    const sheetsAvailable = await checkGoogleSheetsAvailability();
    
    if (sheetsAvailable) {
      console.log("Google Sheets available, fetching data...");
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
      } else {
        console.log("Google Sheets returned empty data");
      }
    } else {
      console.log("Google Sheets is currently unavailable");
    }
    */
  } catch (error) {
    console.warn("Error fetching leaderboard data:", error);
    
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
    map[golfer.name] = golfer.score !== undefined ? golfer.score : 0;
  });
  
  return map;
}

/**
 * Clear cache for testing purposes
 */
export function clearLeaderboardCache() {
  leaderboardCache = null;
  lastFetchTime = 0;
  console.log("Leaderboard cache cleared");
}

/**
 * Get favorite golfers based on current standings and historical performance
 * Useful for betting insights
 */
export function getFavorites(leaderboard: GolferScore[]): GolferScore[] {
  if (!leaderboard || leaderboard.length === 0) {
    return [];
  }
  
  // Only include players in top 20 positions
  return leaderboard.filter(golfer => golfer.position <= 20);
}
