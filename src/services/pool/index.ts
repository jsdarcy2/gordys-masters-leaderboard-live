
import { PoolParticipant } from "@/types";
import { generateEmergencyPoolStandings, calculatePoolStandings } from "./participantUtils";
import { fetchLeaderboardData } from "@/services/leaderboard";
import { buildGolferScoreMap } from "@/utils/scoringUtils";

// Cache for pool standings data
let poolStandingsCache: PoolParticipant[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Fetch raw selections data directly without using pool standings
 * This avoids circular dependency
 */
async function fetchRawSelectionsData(): Promise<Record<string, { picks: string[], roundScores: number[], tiebreakers: [number, number] }>> {
  // This would normally come from your API or Google Sheets
  // For now, we'll use emergency data to avoid circular reference
  const emergencyData = generateEmergencyPoolStandings();
  
  // Transform emergency data into the selections format
  const selectionsData: Record<string, { picks: string[], roundScores: number[], tiebreakers: [number, number] }> = {};
  
  emergencyData.forEach(participant => {
    if (participant.name) {
      // Convert pick scores to an array in the same order as picks
      const roundScores = participant.picks?.map(pick => 
        participant.pickScores?.[pick] || 0
      ) || [];
      
      selectionsData[participant.name] = {
        picks: participant.picks || [],
        roundScores,
        tiebreakers: [participant.tiebreaker1 || 0, participant.tiebreaker2 || 0]
      };
    }
  });
  
  return selectionsData;
}

/**
 * Fetch pool standings
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
    // First, get the leaderboard data to calculate scores
    const leaderboardData = await fetchLeaderboardData();
    const golferScores = buildGolferScoreMap(leaderboardData.leaderboard);
    
    // Get all player selections without using fetchPoolStandings 
    // to avoid circular dependency
    const selectionsData = await fetchRawSelectionsData();
    
    // Calculate pool standings based on current leaderboard
    const calculatedStandings = calculatePoolStandings(selectionsData, golferScores);
    
    if (calculatedStandings && calculatedStandings.length > 0) {
      console.log(`Calculated ${calculatedStandings.length} pool standings from leaderboard data`);
      poolStandingsCache = calculatedStandings;
      lastFetchTime = now;
      return calculatedStandings;
    }
    
    // If calculation fails, fall back to emergency data
    console.log("Using emergency pool standings data");
    const emergencyData = generateEmergencyPoolStandings();
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
    return generateEmergencyPoolStandings();
  }
}

/**
 * Fetch participant selections
 * @param participantName Optional name of participant to fetch selections for
 */
export async function fetchPlayerSelections(participantName?: string): Promise<Record<string, { picks: string[], roundScores: number[], tiebreakers: [number, number] }>> {
  try {
    // Use raw data instead of pool standings to avoid circular dependency
    const selectionsData = await fetchRawSelectionsData();
    
    // If no participant name provided, return all selections
    if (!participantName) {
      return selectionsData;
    }
    
    // If participant name is provided, find that specific participant
    const participantData = selectionsData[participantName];
    
    if (participantData) {
      // For a single participant, return an object with just their name as the key
      return {
        [participantName]: participantData
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
