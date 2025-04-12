
import { PoolParticipant } from "@/types";
import { fetchPoolStandingsFromGoogleSheets } from "@/services/googleSheetsApi";
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
 * Check if pool standings are in sync with Google Sheets data
 * Returns a sync status object with details about the sync status
 */
export async function checkPoolStandingsSync(): Promise<{
  inSync: boolean;
  localCount: number;
  sheetsCount: number;
  differences: Array<{ name: string, localScore?: number, sheetsScore?: number }>;
}> {
  try {
    // Get local data
    const localData = await fetchPoolStandings();
    
    // Get Google Sheets data directly, bypassing any cached data
    let sheetsData: PoolParticipant[] = [];
    try {
      sheetsData = await fetchPoolStandingsFromGoogleSheets();
      console.log(`Sync check: Successfully fetched ${sheetsData.length} participants from Google Sheets`);
    } catch (error) {
      console.error("Error fetching Google Sheets data for sync check:", error);
      // Instead of failing completely, we'll continue with an empty sheets data array
      // This will show all local participants as "out of sync" but at least we can show something
    }
    
    console.log(`Sync check: Local data count: ${localData.length}, Sheets data count: ${sheetsData.length}`);
    
    // If Google Sheets returned no data, mark everything as out of sync
    if (sheetsData.length === 0) {
      console.warn("Google Sheets returned no data, showing all local data as out of sync");
      const differences = localData.map(participant => ({
        name: participant.name,
        localScore: participant.totalScore,
        sheetsScore: undefined
      }));
      
      return {
        inSync: false,
        localCount: localData.length,
        sheetsCount: 0,
        differences
      };
    }
    
    // Create maps for easier comparison
    const localMap = new Map<string, number>();
    localData.forEach(participant => {
      if (participant.name) {
        localMap.set(participant.name, participant.totalScore);
      }
    });
    
    const sheetsMap = new Map<string, number>();
    sheetsData.forEach(participant => {
      if (participant.name) {
        sheetsMap.set(participant.name, participant.totalScore);
      }
    });
    
    // Find differences
    const differences: Array<{ name: string, localScore?: number, sheetsScore?: number }> = [];
    
    // Log full comparison data for debugging
    console.log("Beginning detailed sync comparison");
    
    // Check local participants against sheets
    localMap.forEach((score, name) => {
      const sheetsScore = sheetsMap.get(name);
      
      if (!sheetsMap.has(name)) {
        console.log(`Participant ${name} exists locally but not in sheets`);
        differences.push({ name, localScore: score });
      } else if (sheetsScore !== score) {
        console.log(`Score mismatch for ${name}: local=${score}, sheets=${sheetsScore}`);
        differences.push({ 
          name, 
          localScore: score, 
          sheetsScore 
        });
      }
    });
    
    // Check sheets participants against local
    sheetsMap.forEach((score, name) => {
      if (!localMap.has(name)) {
        console.log(`Participant ${name} exists in sheets but not locally`);
        differences.push({ name, sheetsScore: score });
      }
    });
    
    // Log the full list of differences for debugging
    if (differences.length > 0) {
      console.log(`Sync check complete. Found ${differences.length} differences`);
      console.log("First 10 sync differences:", differences.slice(0, 10));
    } else {
      console.log("Sync check complete. Data is in sync.");
    }
    
    return {
      inSync: differences.length === 0,
      localCount: localData.length,
      sheetsCount: sheetsData.length,
      differences
    };
  } catch (error) {
    console.error("Error checking sync status:", error);
    return {
      inSync: false,
      localCount: 0,
      sheetsCount: 0,
      differences: [{ name: "Error checking sync" }]
    };
  }
}

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
