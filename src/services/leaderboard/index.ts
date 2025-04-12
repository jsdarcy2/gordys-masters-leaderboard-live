
import { GolferScore } from "@/types";
import { API_ENDPOINTS } from "@/services/api";
import { fetchLeaderboardFromGoogleSheets, checkGoogleSheetsAvailability } from "@/services/googleSheetsApi";

// Cache for leaderboard data
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL (reduced from 15 minutes)

/**
 * Fetch scores data from Masters.com official JSON endpoint
 */
async function fetchMastersScoresData(): Promise<GolferScore[]> {
  try {
    console.log("Fetching data from Masters.com official JSON...");
    const response = await fetch(API_ENDPOINTS.MASTERS_SCORES, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Force a new request each time
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Masters scores API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Masters scores data received:", data);
    
    // Map the player data to our GolferScore format
    // The structure might be different from our mock, so we need to check the actual response
    if (data && data.player && Array.isArray(data.player)) {
      return data.player.map((player: any, index: number) => {
        // Extract and process player data based on Masters.com scores structure
        const position = player.pos || String(index + 1);
        const numericPosition = parseInt(position.replace(/T/g, ''), 10) || index + 1;
        
        // Parse score values, handling 'E' (even) as 0
        const totalScore = player.topar === 'E' ? 0 : parseInt(player.topar, 10) || 0;
        const todayScore = player.today === 'E' ? 0 : parseInt(player.today, 10) || 0;
        
        // Parse round scores - explicitly handle 'E' as 0
        const round1Score = player.round1 === 'E' ? 0 : 
                          player.round1 === '' ? undefined : 
                          parseInt(player.round1, 10) || 0;
                          
        const round2Score = player.round2 === 'E' ? 0 : 
                          player.round2 === '' ? undefined : 
                          parseInt(player.round2, 10) || 0;
                          
        const round3Score = player.round3 === 'E' ? 0 : 
                          player.round3 === '' ? undefined : 
                          parseInt(player.round3, 10) || 0;
                          
        const round4Score = player.round4 === 'E' ? 0 : 
                          player.round4 === '' ? undefined : 
                          parseInt(player.round4, 10) || 0;
        
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
          status: playerStatus,
          round1: round1Score,
          round2: round2Score,
          round3: round3Score,
          round4: round4Score,
          thru: player.thru || "F"
        };
      });
    } else if (data && data.data && data.data.player && Array.isArray(data.data.player)) {
      // Alternative structure that might be present in the Masters.com JSON
      return data.data.player.map((player: any, index: number) => {
        // Extract and process player data based on Masters.com scores structure
        const position = player.pos || String(index + 1);
        const numericPosition = parseInt(position.replace(/T/g, ''), 10) || index + 1;
        
        // Parse score values, handling 'E' (even) as 0
        const totalScore = player.topar === 'E' ? 0 : parseInt(player.topar, 10) || 0;
        const todayScore = player.today === 'E' ? 0 : parseInt(player.today, 10) || 0;
        
        // Parse round scores - explicitly handle 'E' as 0
        const round1Score = player.round1 === 'E' ? 0 : 
                          player.round1 === '' ? undefined : 
                          parseInt(player.round1, 10) || 0;
                          
        const round2Score = player.round2 === 'E' ? 0 : 
                          player.round2 === '' ? undefined : 
                          parseInt(player.round2, 10) || 0;
                          
        const round3Score = player.round3 === 'E' ? 0 : 
                          player.round3 === '' ? undefined : 
                          parseInt(player.round3, 10) || 0;
                          
        const round4Score = player.round4 === 'E' ? 0 : 
                          player.round4 === '' ? undefined : 
                          parseInt(player.round4, 10) || 0;
        
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
          status: playerStatus,
          round1: round1Score,
          round2: round2Score,
          round3: round3Score,
          round4: round4Score,
          thru: player.thru || "F"
        };
      });
    }
    
    console.error("Unexpected data format from Masters.com:", data);
    throw new Error("Invalid data format from Masters.com scores data");
  } catch (error) {
    console.error("Error fetching from Masters scores data:", error);
    throw error;
  }
}

/**
 * Fetch leaderboard data from Google Sheets as fallback
 */
async function fetchGoogleSheetsLeaderboard(): Promise<GolferScore[]> {
  try {
    console.log("Attempting to fetch data from Google Sheets...");
    // Check if Google Sheets API is available first
    const isAvailable = await checkGoogleSheetsAvailability();
    
    if (!isAvailable) {
      console.error("Google Sheets API not available");
      throw new Error("Google Sheets API not available");
    }
    
    // Fetch leaderboard data from Google Sheets
    const sheetsData = await fetchLeaderboardFromGoogleSheets();
    console.log(`Retrieved ${sheetsData.length} players from Google Sheets`);
    
    return sheetsData;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch leaderboard data with caching and fallback
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
      source: "masters-scores-api", // Always use this source name for consistency
      lastUpdated: new Date(lastFetchTime).toISOString()
    };
  }
  
  try {
    // Try to fetch data from the hosted JSON
    const scoresData = await fetchMastersScoresData();
    if (scoresData && scoresData.length > 0) {
      console.log(`Retrieved ${scoresData.length} players from Masters scores data`);
      
      // Update cache
      leaderboardCache = scoresData;
      lastFetchTime = now;
      
      return {
        leaderboard: scoresData,
        source: "masters-scores-api", // Consistently use this source name
        lastUpdated: new Date().toISOString()
      };
    }
    
    // If masters API fails, try Google Sheets
    console.log("Masters API returned no data, trying Google Sheets fallback");
    throw new Error("Masters API returned no data");
  } catch (error) {
    console.warn("Error fetching from Masters API, trying Google Sheets fallback:", error);
    
    try {
      // Try to get data from Google Sheets
      const sheetsData = await fetchGoogleSheetsLeaderboard();
      if (sheetsData && sheetsData.length > 0) {
        console.log(`Successfully fetched ${sheetsData.length} players from Google Sheets`);
        
        // Update cache with Google Sheets data
        leaderboardCache = sheetsData;
        lastFetchTime = now;
        
        return {
          leaderboard: sheetsData,
          source: "google-sheets",
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (sheetsError) {
      console.error("Error fetching from Google Sheets fallback:", sheetsError);
    }
    
    // If we have a cache, return it regardless of age in case of error
    if (leaderboardCache && leaderboardCache.length > 0) {
      console.log("All data sources failed. Returning cached data.");
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
 * Manually clear leaderboard cache to force a fresh fetch
 */
export const clearLeaderboardCache = async (): Promise<void> => {
  try {
    localStorage.removeItem('masters_leaderboard');
    localStorage.removeItem('masters_leaderboard_timestamp');
    leaderboardCache = null;
    lastFetchTime = 0;
    console.log('Leaderboard cache cleared successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing leaderboard cache:', error);
    return Promise.reject(error);
  }
};
