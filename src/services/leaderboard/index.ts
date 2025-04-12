
import { GolferScore } from "@/types";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";
import { generateMastersLeaderboard } from "./leaderboardData";

// Reexport other leaderboard utilities
export { scrapeMastersWebsite } from './scraper';

// Cache for leaderboard data with extended TTL for betting stability
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL - extended for betting

// Masters.com API endpoint for player data
const MASTERS_API_ENDPOINT = "https://www.masters.com/en_US/cms/feeds/players/2025/players.json";

/**
 * Fetch player data from Masters.com API
 */
async function fetchMastersPlayerData(): Promise<GolferScore[]> {
  try {
    console.log("Fetching data from Masters.com API...");
    const response = await fetch(MASTERS_API_ENDPOINT, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Masters API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Masters.com API data received:", data);
    
    // Map the Masters.com player data to our GolferScore format
    // Note: The actual mapping will depend on the structure of the Masters.com JSON
    if (Array.isArray(data.players)) {
      return data.players.map((player: any, index: number) => {
        // Extract and process player data based on Masters.com structure
        // This is a placeholder - actual mapping will depend on API structure
        const position = player.position || index + 1;
        const score = parseFloat(player.score) || 0;
        const today = parseFloat(player.today) || 0;
        
        let playerStatus: "active" | "cut" | "withdrawn" = "active";
        if (player.status) {
          const statusLower = player.status.toLowerCase();
          if (statusLower.includes('cut') || statusLower.includes('mc')) {
            playerStatus = "cut";
          } else if (statusLower.includes('wd')) {
            playerStatus = "withdrawn";
          }
        }
        
        return {
          position: Number(position),
          name: player.playerName || player.name || 'Unknown',
          score: score,
          today: today,
          thru: player.thru || 'F',
          status: playerStatus
        };
      });
    }
    
    throw new Error("Invalid data format from Masters.com API");
  } catch (error) {
    console.error("Error fetching from Masters.com API:", error);
    throw error;
  }
}

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
    // First try to fetch data from the Masters.com API
    console.log("Trying to fetch data from Masters.com API...");
    try {
      const mastersData = await fetchMastersPlayerData();
      if (mastersData && mastersData.length > 0) {
        console.log(`Retrieved ${mastersData.length} players from Masters.com API`);
        
        // Update cache
        leaderboardCache = mastersData;
        lastFetchTime = now;
        
        return {
          leaderboard: mastersData,
          source: "masters-api",
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (mastersApiError) {
      console.warn("Failed to fetch from Masters.com API:", mastersApiError);
      // Continue to next data source
    }
    
    // If Masters.com API fails, fall back to fixed data
    console.log("Falling back to fixed Masters 2024 data...");
    const fixedData = generateMastersLeaderboard();
    
    // Update cache
    leaderboardCache = fixedData;
    lastFetchTime = now;
    
    return {
      leaderboard: fixedData,
      source: "fixed-data",
      lastUpdated: new Date().toISOString()
    };
    
    // The following code is commented out since we'll always use our fixed data
    /*
    // If Masters.com API fails, try Google Sheets
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
