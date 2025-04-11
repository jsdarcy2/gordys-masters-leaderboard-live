
import { DataSource, GolferScore, TournamentRound } from "@/types";
import { getCurrentRound } from "../tournament";
import { scrapeMastersWebsite } from "./scraper";

// Export the scraper function so it can be re-exported by the api module
export { scrapeMastersWebsite };

// Get the current year for API requests
const getCurrentYear = (): string => {
  // Use environment variable if available, otherwise use the current year
  return import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();
};

// Current tournament year for all API requests
const TOURNAMENT_YEAR = getCurrentYear();

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
 * Uses multiple sources with fallbacks
 */
export const fetchLeaderboardData = async () => {
  try {
    console.log(`Fetching tournament leaderboard data for ${TOURNAMENT_YEAR} Masters...`);
    
    // First try the ESPN Golf API which is more reliable
    // Using year-specific endpoint to ensure current data
    const espnResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard/events/${TOURNAMENT_YEAR}/masters/leaderboard`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!espnResponse.ok) {
      // Fallback to the general leaderboard which should show current tournament
      console.log("Year-specific ESPN API failed, trying general endpoint...");
      const generalEspnResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!generalEspnResponse.ok) {
        console.error(`ESPN API error: ${generalEspnResponse.status}`);
        throw new Error(`ESPN API error: ${generalEspnResponse.status}`);
      }
      
      const espnData = await generalEspnResponse.json();
      console.log("Received ESPN Golf data from general endpoint");
      
      // Verify this is the current year's tournament
      const tournamentYear = new Date(espnData?.events?.[0]?.date).getFullYear().toString();
      if (tournamentYear !== TOURNAMENT_YEAR) {
        console.warn(`Warning: ESPN API returned ${tournamentYear} tournament data instead of ${TOURNAMENT_YEAR}`);
        // We no longer want historical data, so throw an error
        throw new Error(`ESPN API returned data for ${tournamentYear} instead of ${TOURNAMENT_YEAR}`);
      }
      
      // Transform ESPN data to our application format
      const leaderboardData = transformESPNData(espnData);
      leaderboardData.year = tournamentYear;
      
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
      localStorage.setItem('leaderboardYear', leaderboardData.year);
      
      return leaderboardData;
    } else {
      const espnData = await espnResponse.json();
      console.log(`Received ESPN Golf data for ${TOURNAMENT_YEAR} Masters`);
      
      // Transform ESPN data to our application format
      const leaderboardData = transformESPNData(espnData);
      leaderboardData.year = TOURNAMENT_YEAR;
      
      // Validate the data before caching
      if (!validateLeaderboardData(leaderboardData)) {
        console.error("ESPN API returned invalid data structure");
        throw new Error("Invalid data structure from ESPN API");
      }
      
      console.log(`Fetched ${leaderboardData.leaderboard.length} golfers for leaderboard`);
      
      // Cache the fresh data with year information
      localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.leaderboard));
      localStorage.setItem('leaderboardLastUpdated', leaderboardData.lastUpdated);
      localStorage.setItem('leaderboardSource', leaderboardData.source);
      localStorage.setItem('leaderboardYear', TOURNAMENT_YEAR);
      
      return leaderboardData;
    }
  } catch (espnError) {
    console.error('Error fetching from ESPN API:', espnError);
    
    // Fallback to Sports Data API if available
    try {
      console.log(`Falling back to Sports Data API for ${TOURNAMENT_YEAR} Masters...`);
      
      const sportsDataResponse = await fetch(`https://golf-live-data.p.rapidapi.com/leaderboard/masters/${TOURNAMENT_YEAR}`, {
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
      console.log(`Received Sports Data API data for ${TOURNAMENT_YEAR} Masters`);
      
      // Verify this is data for the current year's tournament
      if (sportsData.year && sportsData.year.toString() !== TOURNAMENT_YEAR) {
        console.warn(`Warning: Sports Data API returned ${sportsData.year} tournament data instead of ${TOURNAMENT_YEAR}`);
        // We no longer want historical data, so throw an error
        throw new Error(`Sports Data API returned data for ${sportsData.year} instead of ${TOURNAMENT_YEAR}`);
      }
      
      // Transform Sports Data API format to our application format
      const leaderboardData = transformSportsDataAPIData(sportsData);
      leaderboardData.year = sportsData.year?.toString() || TOURNAMENT_YEAR;
      
      // Cache the fresh data with year information
      localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.leaderboard));
      localStorage.setItem('leaderboardLastUpdated', leaderboardData.lastUpdated);
      localStorage.setItem('leaderboardSource', leaderboardData.source);
      localStorage.setItem('leaderboardYear', leaderboardData.year);
      
      return leaderboardData;
    } catch (sportsDataError) {
      console.error('Sports Data API failed:', sportsDataError);
      
      // Final fallback: Try scraping Masters.com website
      try {
        console.log("All APIs failed. Attempting to scrape Masters.com website...");
        const scrapedLeaderboard = await scrapeMastersWebsite();
        
        if (scrapedLeaderboard && scrapedLeaderboard.length > 0) {
          console.log(`Successfully scraped ${scrapedLeaderboard.length} players from Masters.com`);
          
          const leaderboardData = {
            leaderboard: scrapedLeaderboard,
            lastUpdated: new Date().toISOString(),
            currentRound: getCurrentRound(),
            source: "masters-scraper" as DataSource,
            year: TOURNAMENT_YEAR
          };
          
          // Cache the scraped data
          localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.leaderboard));
          localStorage.setItem('leaderboardLastUpdated', leaderboardData.lastUpdated);
          localStorage.setItem('leaderboardSource', leaderboardData.source);
          localStorage.setItem('leaderboardYear', leaderboardData.year);
          
          return leaderboardData;
        } else {
          throw new Error("Masters.com scraping returned no data");
        }
      } catch (scrapeError) {
        console.error('All data sources failed, including scraping:', scrapeError);
        
        // Return an empty leaderboard with error
        return {
          leaderboard: [],
          lastUpdated: new Date().toISOString(),
          currentRound: getCurrentRound(),
          source: "no-data" as DataSource,
          year: TOURNAMENT_YEAR
        };
      }
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
    
    // Get tournament year from ESPN data
    const tournamentYear = events?.date ? new Date(events.date).getFullYear().toString() : TOURNAMENT_YEAR;
    
    return {
      leaderboard,
      lastUpdated: new Date().toISOString(),
      currentRound: getCurrentRound(),
      source: "espn-api",
      year: tournamentYear
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
      source: "sportsdata-api",
      year: sportsData.year?.toString() || TOURNAMENT_YEAR
    };
  } catch (error) {
    console.error("Error transforming Sports Data API data:", error);
    throw new Error("Failed to transform Sports Data API data");
  }
}

/**
 * Return empty leaderboard with error message instead of historical data
 * This ensures we don't show historical data when real-time data is expected
 */
const getEmptyLeaderboard = (year: string) => {
  return {
    leaderboard: [],
    lastUpdated: new Date().toISOString(),
    currentRound: getCurrentRound(),
    source: "no-data" as DataSource,
    year: year
  };
};
