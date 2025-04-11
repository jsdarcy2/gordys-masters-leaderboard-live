
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
  
  // Check if lastUpdated and currentRound exist
  if (!data.lastUpdated || !data.currentRound) {
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
 * Fetch current tournament leaderboard data from live API
 */
export const fetchLeaderboardData = async () => {
  try {
    console.log("Fetching live leaderboard data from ESPN API...");
    
    // Try to fetch from the ESPN API for live Masters data
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard');
    
    if (!response.ok) {
      throw new Error(`ESPN API responded with status: ${response.status}`);
    }
    
    const espnData = await response.json();
    console.log("Received ESPN data:", espnData);
    
    // Transform ESPN data to our application format
    const leaderboardData = transformESPNData(espnData);
    
    // Validate the data before caching
    if (!validateLeaderboardData(leaderboardData)) {
      console.error("ESPN API returned invalid data structure");
      throw new Error("Invalid data structure from ESPN API");
    }
    
    console.log(`Fetched ${leaderboardData.leaderboard.length} golfers for leaderboard`);
    
    // Cache the fresh data
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
    localStorage.setItem('leaderboardTimestamp', new Date().getTime().toString());
    
    return leaderboardData;
  } catch (error) {
    console.error('Error fetching live leaderboard data from ESPN:', error);
    
    // Try to use cached data as first fallback
    const cachedData = localStorage.getItem('leaderboardData');
    if (cachedData) {
      try {
        console.log('Using cached data as fallback');
        const parsedData = JSON.parse(cachedData);
        
        // Validate the data structure
        if (validateLeaderboardData(parsedData)) {
          return parsedData;
        }
      } catch (e) {
        console.error("Error parsing cached data:", e);
      }
    }
    
    // If ESPN API and cache failed, try to fetch from Masters.com as second fallback
    try {
      console.log("Attempting to fetch data from Masters.com as fallback...");
      return await fetchMastersWebsiteData();
    } catch (mastersError) {
      console.error("Error fetching from Masters.com:", mastersError);
      throw new Error("Failed to fetch leaderboard data from all available sources");
    }
  }
};

/**
 * Fallback function to fetch data from the official Masters website
 */
const fetchMastersWebsiteData = async () => {
  try {
    console.log("Fetching data from Masters.com...");
    
    // We'll use a proxy to avoid CORS issues
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const mastersUrl = 'https://www.masters.com/en_US/scores/index.html';
    
    const response = await fetch(proxyUrl + mastersUrl);
    
    if (!response.ok) {
      throw new Error(`Masters.com responded with status: ${response.status}`);
    }
    
    const htmlText = await response.text();
    console.log("Received HTML from Masters.com");
    
    // Parse the HTML to extract leaderboard data
    // This is a simplified version - in a real app, you'd need more robust parsing
    const leaderboardData = parseMastersHtml(htmlText);
    
    // Cache the data from Masters.com
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
    localStorage.setItem('leaderboardSource', 'masters.com');
    localStorage.setItem('leaderboardTimestamp', new Date().getTime().toString());
    
    return leaderboardData;
  } catch (error) {
    console.error("Failed to fetch from Masters.com:", error);
    throw error;
  }
};

/**
 * Parse HTML from Masters.com to extract leaderboard data
 * This is a simplified implementation - a real scraper would need to be more robust
 */
const parseMastersHtml = (html: string) => {
  // This is a placeholder for actual HTML parsing logic
  // In a real app, you would use a proper DOM parser to extract data
  console.log("Parsing Masters.com HTML...");
  
  // For now, we'll return a basic structure with the current timestamp
  // A real implementation would extract actual data from the HTML
  return {
    leaderboard: [],
    lastUpdated: new Date().toISOString(),
    currentRound: getCurrentRound(),
    source: "masters.com"
  };
};

/**
 * Transform ESPN API data to our application format
 */
export function transformESPNData(espnData: any) {
  try {
    const competitors = espnData?.events?.[0]?.competitions?.[0]?.competitors || [];
    const leaderboard: GolferScore[] = [];
    
    competitors.forEach((competitor: any) => {
      const athlete = competitor.athlete || {};
      const score = competitor.score || "E";
      const scoreValue = score === "E" ? 0 : parseInt(score, 10);
      
      const status = competitor.status?.type?.description?.toLowerCase() === "cut" 
        ? "cut" 
        : competitor.status?.type?.description?.toLowerCase() === "withdrawn" 
          ? "withdrawn" 
          : "active";
          
      const thru = competitor.status?.thru || "F";
      const todayScore = competitor.linescores?.[competitor.linescores.length - 1]?.value || 0;
      
      leaderboard.push({
        position: parseInt(competitor.status?.position?.id || competitor.rankOrder, 10),
        name: athlete.displayName || "",
        score: scoreValue,
        today: todayScore === "E" ? 0 : parseInt(todayScore, 10),
        thru: thru,
        status: status
      });
    });
    
    // Sort by position
    leaderboard.sort((a, b) => a.position - b.position);
    
    return {
      leaderboard,
      lastUpdated: new Date().toISOString(),
      currentRound: getCurrentRound(),
      source: "espn"
    };
  } catch (error) {
    console.error("Error transforming ESPN data:", error);
    throw new Error("Failed to transform ESPN data");
  }
}
