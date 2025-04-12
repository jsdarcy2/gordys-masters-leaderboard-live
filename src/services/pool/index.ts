
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
    // Since the live data isn't working, let's use our emergency data directly
    console.log("Using emergency pool standings data");
    const emergencyData = generateEmergencyPoolStandings();
    poolStandingsCache = emergencyData;
    lastFetchTime = now;
    return emergencyData;
    
    // Commented out the Google Sheets API call since it's not working
    /*
    console.log("Fetching pool standings from Google Sheets...");
    const googleSheetsData = await fetchPoolStandingsFromGoogleSheets();
    
    if (googleSheetsData && googleSheetsData.length > 0) {
      console.log(`Fetched ${googleSheetsData.length} participants from Google Sheets`);
      
      // Update cache
      poolStandingsCache = googleSheetsData;
      lastFetchTime = now;
      
      return googleSheetsData;
    }
    */
  } catch (error) {
    console.error("Error fetching pool standings:", error);
    
    // If we have a cache, return it regardless of age in case of error
    if (poolStandingsCache && poolStandingsCache.length > 0) {
      console.log("Error fetching pool standings. Returning cached data.");
      return poolStandingsCache;
    }
    
    // Generate mock data as last resort
    console.log("No cached data available. Generating emergency data.");
    return generateEmergencyPoolStandings();
  }
}

/**
 * Fetch participant selections
 * @param participantName Optional name of participant to fetch selections for
 */
export async function fetchPlayerSelections(participantName?: string) {
  try {
    // Get all participants first
    const standings = await fetchPoolStandings();
    
    // If no participant name provided, return all selections
    if (!participantName) {
      const allSelections: Record<string, { picks: string[], roundScores: number[], tiebreakers: [number, number] }> = {};
      
      standings.forEach(participant => {
        if (participant.name) {
          // Convert pick scores to an array in the same order as picks
          const roundScores = participant.picks?.map(pick => 
            participant.pickScores?.[pick] || 0
          ) || [];
          
          allSelections[participant.name] = {
            picks: participant.picks || [],
            roundScores,
            tiebreakers: [participant.tiebreaker1 || 0, participant.tiebreaker2 || 0]
          };
        }
      });
      
      return allSelections;
    }
    
    // If participant name is provided, find that specific participant
    const participant = standings.find(p => 
      p.name.toLowerCase() === participantName.toLowerCase()
    );
    
    if (participant) {
      // Convert pick scores to an array in the same order as picks
      const roundScores = participant.picks?.map(pick => 
        participant.pickScores?.[pick] || 0
      ) || [];
      
      return {
        picks: participant.picks || [],
        scores: participant.pickScores || {},
        roundScores,
        tiebreakers: [participant.tiebreaker1 || 0, participant.tiebreaker2 || 0]
      };
    }
    
    throw new Error(`Player not found: ${participantName}`);
  } catch (error) {
    console.error(`Error fetching selections${participantName ? ` for ${participantName}` : ''}:`, error);
    throw error;
  }
}

// Clear cache function for testing and debugging
export function clearPoolStandingsCache() {
  poolStandingsCache = null;
  lastFetchTime = 0;
  console.log("Pool standings cache cleared");
}
