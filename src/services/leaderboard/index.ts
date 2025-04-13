
import { GolferScore, DataSource } from "@/types";
import { API_ENDPOINTS, SPORTRADAR_API_KEY } from "@/services/api";

// Cache for leaderboard data
let leaderboardCache: GolferScore[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL (reduced from 15 minutes)

/**
 * Fetch scores data from Sportradar Golf API
 */
async function fetchSportradarData(): Promise<GolferScore[]> {
  try {
    console.log("Fetching data from Sportradar Golf API...");
    const endpoint = `${API_ENDPOINTS.SPORTRADAR_MASTERS}?api_key=${SPORTRADAR_API_KEY}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Force a new request each time
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Sportradar API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Sportradar data received");
    
    // Extract and process player data based on Sportradar API structure
    if (data && data.players && Array.isArray(data.players)) {
      return data.players.map((player: any, index: number) => {
        // Determine player position - Sportradar uses position or rank
        const position = player.position || player.rank || index + 1;
        const numericPosition = typeof position === 'number' ? position : parseInt(String(position).replace(/T/g, ''), 10) || index + 1;
        
        // Calculate scores
        const totalScore = player.total_to_par !== undefined ? player.total_to_par : 0;
        const todayScore = player.today_to_par !== undefined ? player.today_to_par : 0;
        
        // Get round scores
        const rounds = player.rounds || [];
        const round1Score = rounds[0]?.to_par !== undefined ? rounds[0].to_par : undefined;
        const round2Score = rounds[1]?.to_par !== undefined ? rounds[1].to_par : undefined;
        const round3Score = rounds[2]?.to_par !== undefined ? rounds[2].to_par : undefined;
        const round4Score = rounds[3]?.to_par !== undefined ? rounds[3].to_par : undefined;
        
        // Determine player status (active, cut, withdrawn)
        let playerStatus: "active" | "cut" | "withdrawn" = "active";
        const status = (player.status || "").toLowerCase();
        
        if (status.includes('cut') || status.includes('mc')) {
          playerStatus = "cut";
        } else if (status.includes('wd') || status.includes('withdraw')) {
          playerStatus = "withdrawn";
        }
        
        return {
          position: numericPosition,
          name: player.name || player.first_name + " " + player.last_name,
          score: totalScore,
          today: todayScore,
          status: playerStatus,
          round1: round1Score,
          round2: round2Score,
          round3: round3Score,
          round4: round4Score,
          thru: player.thru || player.current_hole || "F"
        };
      });
    }
    
    // If Sportradar data structure is different, handle alternate format
    if (data && data.leaderboard && Array.isArray(data.leaderboard.players)) {
      return data.leaderboard.players.map((player: any, index: number) => {
        const position = player.position || player.rank || index + 1;
        const numericPosition = typeof position === 'number' ? position : parseInt(String(position).replace(/T/g, ''), 10) || index + 1;
        
        // Calculate scores - handle format differences
        const totalScore = player.total_to_par !== undefined ? player.total_to_par : 
                          player.score_to_par !== undefined ? player.score_to_par : 0;
        
        const todayScore = player.today_to_par !== undefined ? player.today_to_par : 
                          player.round_to_par !== undefined ? player.round_to_par : 0;
        
        // Get round scores from rounds or scores array
        const rounds = player.rounds || player.scores || [];
        const round1Score = rounds[0]?.to_par !== undefined ? rounds[0].to_par : undefined;
        const round2Score = rounds[1]?.to_par !== undefined ? rounds[1].to_par : undefined;
        const round3Score = rounds[2]?.to_par !== undefined ? rounds[2].to_par : undefined;
        const round4Score = rounds[3]?.to_par !== undefined ? rounds[3].to_par : undefined;
        
        // Determine player status
        let playerStatus: "active" | "cut" | "withdrawn" = "active";
        const status = (player.status || "").toLowerCase();
        
        if (status.includes('cut') || status.includes('mc')) {
          playerStatus = "cut";
        } else if (status.includes('wd') || status.includes('withdraw')) {
          playerStatus = "withdrawn";
        }
        
        return {
          position: numericPosition,
          name: player.name || `${player.first_name || ""} ${player.last_name || ""}`.trim(),
          score: totalScore,
          today: todayScore,
          status: playerStatus,
          round1: round1Score,
          round2: round2Score,
          round3: round3Score,
          round4: round4Score,
          thru: player.thru || player.current_hole || "F"
        };
      });
    }
    
    console.error("Unexpected data format from Sportradar API:", data);
    throw new Error("Invalid data format from Sportradar API");
  } catch (error) {
    console.error("Error fetching from Sportradar API:", error);
    throw error;
  }
}

/**
 * Fetch leaderboard data with caching
 */
export async function fetchLeaderboardData(): Promise<{
  leaderboard: GolferScore[];
  source: DataSource;
  lastUpdated: string;
}> {
  const now = Date.now();
  const cacheAge = now - lastFetchTime;
  
  // Use cache if valid and not expired
  if (leaderboardCache && leaderboardCache.length > 0 && cacheAge < CACHE_TTL) {
    console.log(`Using cached leaderboard (${Math.round(cacheAge / 1000)}s old)`);
    return {
      leaderboard: leaderboardCache,
      source: "sportradar-api", // Always use source name consistent with most recent fetch
      lastUpdated: new Date(lastFetchTime).toISOString()
    };
  }
  
  try {
    // Try Sportradar API - using type-safe check for API key
    if (SPORTRADAR_API_KEY && typeof SPORTRADAR_API_KEY === 'string' && SPORTRADAR_API_KEY.length > 0) {
      try {
        const scoresData = await fetchSportradarData();
        if (scoresData && scoresData.length > 0) {
          console.log(`Retrieved ${scoresData.length} players from Sportradar API`);
          
          // Update cache
          leaderboardCache = scoresData;
          lastFetchTime = now;
          
          return {
            leaderboard: scoresData,
            source: "sportradar-api",
            lastUpdated: new Date().toISOString()
          };
        }
      } catch (sportradarError) {
        console.warn("Error fetching from Sportradar API:", sportradarError);
      }
    }
    
    // If we have a cache, return it regardless of age in case of error
    if (leaderboardCache && leaderboardCache.length > 0) {
      console.log("Sportradar API failed. Returning cached data.");
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
  } catch (error) {
    console.error("Error in fetchLeaderboardData:", error);
    
    // Return empty array in case of error
    return {
      leaderboard: [],
      source: "error",
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
