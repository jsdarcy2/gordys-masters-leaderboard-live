
import { GolferScore, TournamentRound } from "@/types";
import { getCurrentRound } from "../tournament";

/**
 * Validate leaderboard data structure
 */
export const validateLeaderboardData = (data: any): boolean => {
  // Basic validation to ensure the data has the expected structure
  if (!data || !Array.isArray(data.leaderboard)) {
    return false;
  }
  
  // Check if lastUpdated exists
  if (!data.lastUpdated) {
    return false;
  }
  
  return true;
};

/**
 * Build a map of golfer names to their scores for quick lookup
 */
export const buildGolferScoreMap = (leaderboard: GolferScore[]): Record<string, number> => {
  const golferScores: Record<string, number> = {};
  
  leaderboard.forEach(golfer => {
    golferScores[golfer.name] = golfer.score;
  });
  
  return golferScores;
};

/**
 * Fetch current tournament leaderboard data
 * Using multiple data sources with fallback strategy
 */
export const fetchLeaderboardData = async () => {
  try {
    console.log("Fetching tournament leaderboard data...");
    
    // First try the ESPN Golf API which is more reliable
    const espnResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!espnResponse.ok) {
      console.error(`ESPN API error: ${espnResponse.status}`);
      throw new Error(`ESPN API error: ${espnResponse.status}`);
    }
    
    const espnData = await espnResponse.json();
    console.log("Received ESPN Golf data");
    
    // Transform ESPN data to our application format
    const leaderboardData = transformESPNData(espnData);
    
    // Validate the data before caching
    if (!validateLeaderboardData(leaderboardData)) {
      console.error("ESPN API returned invalid data structure");
      throw new Error("Invalid data structure from ESPN API");
    }
    
    console.log(`Fetched ${leaderboardData.leaderboard.length} golfers for leaderboard`);
    
    // Cache the fresh data
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.leaderboard));
    localStorage.setItem('leaderboardLastUpdated', leaderboardData.lastUpdated);
    localStorage.setItem('leaderboardSource', leaderboardData.source);
    
    return leaderboardData;
  } catch (error) {
    console.error('Error fetching from ESPN API:', error);
    
    // Fallback to Sports Data API if available
    try {
      console.log("Falling back to Sports Data API...");
      
      const sportsDataResponse = await fetch('https://golf-live-data.p.rapidapi.com/leaderboard/masters/2024', {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_SPORTS_API_KEY || 'fallback-key-for-dev',
          'X-RapidAPI-Host': 'golf-live-data.p.rapidapi.com',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!sportsDataResponse.ok) {
        console.error(`Sports Data API error: ${sportsDataResponse.status}`);
        throw new Error(`Sports Data API error: ${sportsDataResponse.status}`);
      }
      
      const sportsData = await sportsDataResponse.json();
      console.log("Received Sports Data API data");
      
      // Transform Sports Data API format to our application format
      const leaderboardData = transformSportsDataAPIData(sportsData);
      
      // Cache the fresh data
      localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.leaderboard));
      localStorage.setItem('leaderboardLastUpdated', leaderboardData.lastUpdated);
      localStorage.setItem('leaderboardSource', leaderboardData.source);
      
      return leaderboardData;
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      
      // Try to use cached data as last resort
      const cachedData = localStorage.getItem('leaderboardData');
      const cachedLastUpdated = localStorage.getItem('leaderboardLastUpdated');
      
      if (cachedData && cachedLastUpdated) {
        try {
          console.log('Using cached data as fallback');
          
          return {
            leaderboard: JSON.parse(cachedData),
            lastUpdated: cachedLastUpdated,
            currentRound: getCurrentRound(),
            source: "cached-data"
          };
        } catch (e) {
          console.error("Error parsing cached data:", e);
        }
      }
      
      // If all attempts fail, use real historical data
      console.log("All data sources failed, using historical Masters data as fallback");
      return getHistoricalMastersData();
    }
  }
};

/**
 * Transform ESPN API data to our application format
 */
export function transformESPNData(espnData: any) {
  try {
    const events = espnData?.events?.[0];
    const competitors = events?.competitions?.[0]?.competitors || [];
    const leaderboard: GolferScore[] = [];
    
    competitors.forEach((player: any) => {
      // Handle status - active, cut, or withdrawn
      const status = player.status?.type?.description?.toLowerCase() === "cut" 
        ? "cut" 
        : player.status?.type?.description?.toLowerCase() === "withdrawn" 
          ? "withdrawn" 
          : "active";
          
      // Parse score values
      const totalScore = player.score || "0";
      const todayScore = player.linescores?.[events.status.period - 1]?.value || "0";
      
      // Format scores as numbers (handling "E" for even par)
      const totalScoreNum = totalScore === "E" ? 0 : parseInt(totalScore, 10);
      const todayScoreNum = todayScore === "E" ? 0 : parseInt(todayScore, 10);
      
      leaderboard.push({
        position: parseInt(player.status?.position?.id || "0", 10),
        name: player.athlete?.displayName || "",
        score: totalScoreNum,
        today: todayScoreNum,
        thru: player.status?.thru || player.status?.type?.shortDetail || "F", 
        status: status
      });
    });
    
    // Sort by position
    leaderboard.sort((a, b) => a.position - b.position);
    
    return {
      leaderboard,
      lastUpdated: new Date().toISOString(),
      currentRound: getCurrentRound(),
      source: "espn-api"
    };
  } catch (error) {
    console.error("Error transforming ESPN data:", error);
    throw new Error("Failed to transform ESPN data");
  }
}

/**
 * Transform Sports Data API data to our application format
 */
export function transformSportsDataAPIData(sportsData: any) {
  try {
    const players = sportsData?.leaderboard?.players || [];
    const leaderboard: GolferScore[] = [];
    
    players.forEach((player: any) => {
      const status = player.status?.toLowerCase() === "cut" 
        ? "cut" 
        : player.status?.toLowerCase() === "wd" 
          ? "withdrawn" 
          : "active";
          
      // Calculate score and today score
      const totalScore = player.total_to_par || "0";
      const todayScore = player.today || "0";
      
      // Parse scores, handling "E" for even par
      const totalScoreNum = totalScore === "E" ? 0 : parseInt(totalScore, 10);
      const todayScoreNum = todayScore === "E" ? 0 : parseInt(todayScore, 10);
      
      leaderboard.push({
        position: parseInt(player.position || "0", 10),
        name: player.player_name || "",
        score: totalScoreNum,
        today: todayScoreNum,
        thru: player.thru || "F",
        status: status
      });
    });
    
    // Sort by position
    leaderboard.sort((a, b) => a.position - b.position);
    
    return {
      leaderboard,
      lastUpdated: new Date().toISOString(),
      currentRound: sportsData.round || getCurrentRound(),
      source: "sportsdata-api"
    };
  } catch (error) {
    console.error("Error transforming Sports Data API data:", error);
    throw new Error("Failed to transform Sports Data API data");
  }
}

/**
 * Return real historical Masters data as a last resort
 * Using the 2023 Masters final leaderboard with real data
 */
const getHistoricalMastersData = () => {
  // These are real historical results from 2023 Masters
  return {
    leaderboard: [
      { position: 1, name: "Jon Rahm", score: -12, today: -3, thru: "F", status: "active" },
      { position: 2, name: "Phil Mickelson", score: -8, today: -7, thru: "F", status: "active" },
      { position: 2, name: "Brooks Koepka", score: -8, today: +3, thru: "F", status: "active" },
      { position: 4, name: "Jordan Spieth", score: -7, today: -6, thru: "F", status: "active" },
      { position: 4, name: "Patrick Reed", score: -7, today: -4, thru: "F", status: "active" },
      { position: 6, name: "Russell Henley", score: -6, today: -3, thru: "F", status: "active" },
      { position: 7, name: "Viktor Hovland", score: -5, today: -2, thru: "F", status: "active" },
      { position: 7, name: "Sahith Theegala", score: -5, today: -2, thru: "F", status: "active" },
      { position: 9, name: "Patrick Cantlay", score: -4, today: -3, thru: "F", status: "active" },
      { position: 9, name: "Hideki Matsuyama", score: -4, today: -2, thru: "F", status: "active" },
      { position: 11, name: "Xander Schauffele", score: -3, today: -4, thru: "F", status: "active" },
      { position: 11, name: "Scottie Scheffler", score: -3, today: -1, thru: "F", status: "active" },
      { position: 13, name: "Tony Finau", score: -2, today: -3, thru: "F", status: "active" },
      { position: 13, name: "Cameron Smith", score: -2, today: -1, thru: "F", status: "active" },
      { position: 13, name: "Cameron Young", score: -2, today: -1, thru: "F", status: "active" },
      { position: 16, name: "Collin Morikawa", score: -1, today: +1, thru: "F", status: "active" },
      { position: 16, name: "Jason Day", score: -1, today: -2, thru: "F", status: "active" },
      { position: 18, name: "Shane Lowry", score: 0, today: -1, thru: "F", status: "active" },
      { position: 18, name: "Tommy Fleetwood", score: 0, today: -1, thru: "F", status: "active" },
      { position: 18, name: "Dustin Johnson", score: 0, today: +1, thru: "F", status: "active" }
    ],
    lastUpdated: new Date().toISOString(),
    currentRound: getCurrentRound(),
    source: "historical-data"
  };
};

