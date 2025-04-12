
import { GolferScore } from "@/types";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";
import { generateMastersLeaderboard } from "./leaderboardData";

// Reexport other leaderboard utilities
export { scrapeMastersWebsite } from './scraper';

// Cache for leaderboard data with extended TTL for betting stability
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL - extended for betting

// Masters.com API endpoints for tournament data
const MASTERS_API_PLAYER_ENDPOINT = "https://www.masters.com/en_US/cms/feeds/players/2025/players.json";
const MASTERS_API_SCORES_ENDPOINT = "https://www.masters.com/en_US/scores/feeds/2025/scores.json";

/**
 * Fetch scores data from Masters.com scores API
 * This provides more comprehensive scoring information
 */
async function fetchMastersScoresData(): Promise<GolferScore[]> {
  try {
    console.log("Fetching data from Masters.com scores API...");
    const response = await fetch(MASTERS_API_SCORES_ENDPOINT, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Masters scores API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Masters.com scores API data received:", data);
    
    // Map the Masters.com player data to our GolferScore format
    if (data && data.data && Array.isArray(data.data.player)) {
      return data.data.player.map((player: any, index: number) => {
        // Extract and process player data based on Masters.com scores structure
        const position = player.pos || String(index + 1);
        const numericPosition = parseInt(position.replace(/T/g, ''), 10) || index + 1;
        
        // Parse score values, handling 'E' (even) as 0
        const totalScore = player.topar === 'E' ? 0 : parseInt(player.topar, 10) || 0;
        const todayScore = player.today === 'E' ? 0 : parseInt(player.today, 10) || 0;
        
        // Determine player status
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
          position: numericPosition,
          name: player.name || player.playerName || 'Unknown',
          score: totalScore,
          today: todayScore,
          thru: player.thru || player.teetime || 'F',
          status: playerStatus
        };
      });
    }
    
    throw new Error("Invalid data format from Masters.com scores API");
  } catch (error) {
    console.error("Error fetching from Masters.com scores API:", error);
    throw error;
  }
}

/**
 * Fetch player data from Masters.com players API
 * Fallback if scores API fails
 */
async function fetchMastersPlayerData(): Promise<GolferScore[]> {
  try {
    console.log("Fetching data from Masters.com players API...");
    const response = await fetch(MASTERS_API_PLAYER_ENDPOINT, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Masters API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Masters.com players API data received:", data);
    
    // Map the Masters.com player data to our GolferScore format
    if (Array.isArray(data.players)) {
      return data.players.map((player: any, index: number) => {
        // Extract and process player data based on Masters.com structure
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
    
    throw new Error("Invalid data format from Masters.com players API");
  } catch (error) {
    console.error("Error fetching from Masters.com players API:", error);
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
    // First try to fetch data from the Masters.com scores API
    console.log("Trying to fetch data from Masters.com scores API...");
    try {
      const scoresData = await fetchMastersScoresData();
      if (scoresData && scoresData.length > 0) {
        console.log(`Retrieved ${scoresData.length} players from Masters.com scores API`);
        
        // Update cache
        leaderboardCache = scoresData;
        lastFetchTime = now;
        
        return {
          leaderboard: scoresData,
          source: "masters-scores-api",
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (mastersScoresApiError) {
      console.warn("Failed to fetch from Masters.com scores API:", mastersScoresApiError);
      // Continue to next data source
    }
    
    // If scores API fails, try player API as a fallback
    console.log("Trying to fetch data from Masters.com players API...");
    try {
      const mastersData = await fetchMastersPlayerData();
      if (mastersData && mastersData.length > 0) {
        console.log(`Retrieved ${mastersData.length} players from Masters.com players API`);
        
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
      console.warn("Failed to fetch from Masters.com players API:", mastersApiError);
      // Continue to next data source
    }
    
    // If both APIs fail, fall back to fixed data
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
