
import { PoolParticipant } from "@/types";
import { fetchPoolStandingsFromGoogleSheets } from "@/services/googleSheetsApi";
import { generateEmergencyPoolStandings } from "./participantUtils";

// Cache for pool standings data
let poolStandingsCache: PoolParticipant[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Fetch pool standings exclusively from Google Sheets
 */
export async function fetchPoolStandings(): Promise<PoolParticipant[]> {
  const now = Date.now();
  const cacheAge = now - lastFetchTime;
  
  // Use cache if valid and not expired
  if (poolStandingsCache && poolStandingsCache.length > 0 && cacheAge < CACHE_TTL) {
    console.log(`Using cached pool standings (${Math.round(cacheAge / 1000)}s old)`);
    return poolStandingsCache;
  }
  
  try {
    console.log("Fetching pool standings from Google Sheets...");
    const googleSheetsData = await fetchPoolStandingsFromGoogleSheets();
    
    if (googleSheetsData && googleSheetsData.length > 0) {
      console.log(`Fetched ${googleSheetsData.length} participants from Google Sheets`);
      
      // Update cache
      poolStandingsCache = googleSheetsData;
      lastFetchTime = now;
      
      return googleSheetsData;
    }
    
    // If Google Sheets fails and we have a cache, use it regardless of age
    if (poolStandingsCache && poolStandingsCache.length > 0) {
      console.log("Google Sheets data unavailable. Using expired cache as last resort.");
      return poolStandingsCache;
    }
    
    // Everything failed including cache, generate emergency data
    console.log("CRITICAL: No pool standings data available from any source. Generating emergency data.");
    const emergencyData = generateEmergencyPoolStandings(134);
    poolStandingsCache = emergencyData;
    lastFetchTime = now;
    return emergencyData;
    
  } catch (error) {
    console.error("Error fetching pool standings:", error);
    
    // If we have a cache, return it regardless of age in case of error
    if (poolStandingsCache && poolStandingsCache.length > 0) {
      console.log("Error fetching pool standings. Returning cached data.");
      return poolStandingsCache;
    }
    
    // Generate mock data as last resort
    console.log("No cached data available. Generating emergency data.");
    return generateEmergencyPoolStandings(134);
  }
}

/**
 * Fetch participant selections
 */
export async function fetchPlayerSelections(participantName: string) {
  try {
    // First try to get data from the cache
    if (poolStandingsCache && poolStandingsCache.length > 0) {
      const participant = poolStandingsCache.find(p => 
        p.name.toLowerCase() === participantName.toLowerCase()
      );
      
      if (participant) {
        return {
          picks: participant.picks || [],
          scores: participant.pickScores || {}
        };
      }
    }
    
    // If not in cache, fetch fresh data
    const standings = await fetchPoolStandings();
    const participant = standings.find(p => 
      p.name.toLowerCase() === participantName.toLowerCase()
    );
    
    if (participant) {
      return {
        picks: participant.picks || [],
        scores: participant.pickScores || {}
      };
    }
    
    throw new Error(`Player not found: ${participantName}`);
  } catch (error) {
    console.error(`Error fetching selections for ${participantName}:`, error);
    throw error;
  }
}

// Clear cache function for testing and debugging
export function clearPoolStandingsCache() {
  poolStandingsCache = null;
  lastFetchTime = 0;
  console.log("Pool standings cache cleared");
}
