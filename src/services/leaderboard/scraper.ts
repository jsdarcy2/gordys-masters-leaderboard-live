import { GolferScore } from "@/types";

/**
 * Parse a golf score value that might be text like "E" (even), "+2", "-4"
 */
const parseScoreValue = (scoreText: string): number => {
  if (!scoreText) return 0;
  
  const trimmed = scoreText.trim();
  
  if (trimmed === 'E' || trimmed === 'EV' || trimmed === 'EVEN') {
    return 0;
  }
  
  if (trimmed.startsWith('+')) {
    return parseInt(trimmed.substring(1), 10) || 0;
  }
  
  if (trimmed.startsWith('-')) {
    return -1 * (parseInt(trimmed.substring(1), 10) || 0);
  }
  
  return parseInt(trimmed, 10) || 0;
};

/**
 * Extract plain text content from an HTML string
 */
const extractTextContent = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Scrape leaderboard data from the Masters.com website
 * This is our final fallback when APIs fail
 */
export const scrapeMastersWebsite = async (): Promise<GolferScore[]> => {
  try {
    console.log("Attempting to scrape Masters.com leaderboard...");
    
    // First try the main Masters.com leaderboard page
    const response = await fetch("https://www.masters.com/en_US/scores/index.html", {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Masters.com response error: ${response.status}`);
      throw new Error(`Masters.com response error: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract leaderboard data from HTML
    // We'll look for the leaderboard table structure
    const leaderboard: GolferScore[] = [];
    
    // Simple HTML parsing approach (more robust than regex for structured data)
    const tableMatches = html.match(/<table[^>]*class="[^"]*leaderboard[^"]*"[^>]*>([\s\S]*?)<\/table>/gi);
    
    if (!tableMatches || tableMatches.length === 0) {
      // If table isn't found, try looking for JSON data that might be embedded
      const jsonDataMatch = html.match(/window\.LEADERBOARD_DATA\s*=\s*({[\s\S]*?});/i);
      
      if (jsonDataMatch && jsonDataMatch[1]) {
        try {
          const jsonData = JSON.parse(jsonDataMatch[1]);
          
          // Process the JSON data based on its structure
          if (jsonData.players && Array.isArray(jsonData.players)) {
            jsonData.players.forEach((player: any, index: number) => {
              // Convert from whatever structure is found to our GolferScore type
              const score = parseScoreValue(player.score || player.total || '0');
              const today = parseScoreValue(player.today || player.round || '0');
              
              // Use type assertion to enforce the correct status type
              let playerStatus: "active" | "cut" | "withdrawn" = "active";
              
              // Determine the status based on player data
              if (player.status) {
                const statusText = String(player.status).toLowerCase();
                if (statusText.includes('cut')) {
                  playerStatus = "cut";
                } else if (statusText.includes('wd') || statusText.includes('withdrawn')) {
                  playerStatus = "withdrawn";
                }
              }
              
              leaderboard.push({
                position: parseInt(player.position || (index + 1).toString(), 10),
                name: player.name || player.playerName || 'Unknown',
                score: score,
                today: today,
                thru: player.thru || player.through || 'F',
                status: playerStatus
              });
            });
          }
        } catch (jsonError) {
          console.error("Error parsing embedded JSON data:", jsonError);
        }
      }
      
      // If we still don't have data, try falling back to the ESPN website
      if (leaderboard.length === 0) {
        console.log("Table not found in Masters.com. Trying ESPN as fallback...");
        return await scrapeESPNWebsite();
      }
    } else {
      // Process table HTML
      const tableHTML = tableMatches[0];
      const rowMatches = tableHTML.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
      
      if (rowMatches && rowMatches.length > 1) {
        // Skip header row
        for (let i = 1; i < rowMatches.length; i++) {
          const row = rowMatches[i];
          const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
          
          if (cellMatches && cellMatches.length >= 4) {
            // Extract cell content, removing HTML tags
            const position = extractTextContent(cellMatches[0]);
            const name = extractTextContent(cellMatches[1]);
            const scoreText = extractTextContent(cellMatches[2]);
            const todayText = extractTextContent(cellMatches[3]);
            const thruText = cellMatches.length > 4 ? extractTextContent(cellMatches[4]) : 'F';
            
            // Handle status (cut or withdrawn)
            let playerStatus: "active" | "cut" | "withdrawn" = "active";
            
            if (row.toLowerCase().includes('cut') || row.toLowerCase().includes('mc')) {
              playerStatus = "cut";
            } else if (row.toLowerCase().includes('wd') || row.toLowerCase().includes('withdrawn')) {
              playerStatus = "withdrawn";
            }
            
            // Parse scores, handling text like "E" (even), "+2", "-4"
            const score = parseScoreValue(scoreText);
            const today = parseScoreValue(todayText);
            
            leaderboard.push({
              position: parseInt(position.replace(/\D/g, '')) || i,
              name: name.trim(),
              score: score,
              today: today,
              thru: thruText.trim() || 'F',
              status: playerStatus
            });
          }
        }
      }
    }
    
    // If we successfully extracted data, return it
    if (leaderboard.length > 0) {
      console.log(`Successfully scraped ${leaderboard.length} players from Masters.com`);
      
      // Sort by position
      return leaderboard.sort((a, b) => a.position - b.position);
    }
    
    // If we couldn't extract data, try ESPN as fallback
    console.log("Failed to extract leaderboard data from Masters.com. Trying ESPN...");
    return await scrapeESPNWebsite();
  } catch (error) {
    console.error("Error scraping Masters.com:", error);
    
    // Try ESPN as last resort
    try {
      return await scrapeESPNWebsite();
    } catch (espnError) {
      console.error("ESPN scraping also failed:", espnError);
      throw new Error(`Scraper error: ${error}`);
    }
  }
};

/**
 * Attempt to scrape leaderboard data from ESPN as a fallback
 */
const scrapeESPNWebsite = async (): Promise<GolferScore[]> => {
  try {
    console.log("Attempting to scrape ESPN Golf leaderboard...");
    
    const year = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear();
    const url = `https://www.espn.com/golf/${year}/masters/leaderboard`;
    
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`ESPN response error: ${response.status}`);
      throw new Error(`ESPN response error: ${response.status}`);
    }
    
    const html = await response.text();
    const leaderboard: GolferScore[] = [];
    
    // Look for player data in different possible formats
    // 1. Try to find embedded JSON data first (most reliable)
    const scriptMatches = html.match(/<script[^>]*>window\.__INITIAL_STATE__\s*=\s*([^<]*)<\/script>/i);
    
    if (scriptMatches && scriptMatches[1]) {
      try {
        const cleanJson = scriptMatches[1].replace(/;$/, '');
        const jsonData = JSON.parse(cleanJson);
        
        // Navigate the JSON structure to find competitors
        let competitors = null;
        
        // Search for the leaderboard data in various possible locations
        if (jsonData.page && jsonData.page.content && jsonData.page.content.leaderboard) {
          const events = jsonData.page.content.leaderboard.events;
          if (events && events.length > 0 && events[0].competitions && events[0].competitions.length > 0) {
            competitors = events[0].competitions[0].competitors;
          }
        }
        
        if (competitors && Array.isArray(competitors)) {
          competitors.forEach((player: any) => {
            // Extract player data based on ESPN's structure
            const score = parseScoreValue(player.score);
            const todayRound = player.linescores ? player.linescores[player.linescores.length - 1] : null;
            const today = todayRound ? parseScoreValue(todayRound.value) : 0;
            
            // Handle status - active, cut, or withdrawn
            let playerStatus: "active" | "cut" | "withdrawn" = "active";
            
            if (player.status && player.status.type) {
              const statusType = player.status.type.description.toLowerCase();
              if (statusType.includes('cut')) {
                playerStatus = "cut";
              } else if (statusType.includes('wd') || statusType.includes('withdrawn')) {
                playerStatus = "withdrawn";
              }
            }
            
            leaderboard.push({
              position: parseInt(player.status && player.status.position ? player.status.position.id : '0', 10) || 0,
              name: player.athlete ? player.athlete.displayName : 'Unknown',
              score: score,
              today: today,
              thru: player.status && player.status.thru ? player.status.thru : 'F',
              status: playerStatus
            });
          });
        }
      } catch (jsonError) {
        console.error("Error parsing ESPN JSON data:", jsonError);
      }
    }
    
    // 2. If we couldn't extract from JSON, try parsing the HTML directly
    if (leaderboard.length === 0) {
      // Look for a table with class containing "leaderboard"
      const tableMatches = html.match(/<table[^>]*class="[^"]*leaderboard[^"]*"[^>]*>([\s\S]*?)<\/table>/gi);
      
      if (tableMatches && tableMatches.length > 0) {
        const tableHTML = tableMatches[0];
        const rowMatches = tableHTML.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
        
        if (rowMatches && rowMatches.length > 1) {
          // Skip header row
          for (let i = 1; i < rowMatches.length; i++) {
            const row = rowMatches[i];
            const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
            
            if (cellMatches && cellMatches.length >= 3) {
              // Extract basic data
              const position = extractTextContent(cellMatches[0]);
              const nameCell = cellMatches[1];
              const name = extractTextContent(nameCell);
              const scoreText = cellMatches.length > 2 ? extractTextContent(cellMatches[2]) : '0';
              const todayText = cellMatches.length > 3 ? extractTextContent(cellMatches[3]) : '0';
              const thruText = cellMatches.length > 4 ? extractTextContent(cellMatches[4]) : 'F';
              
              // Handle status
              let playerStatus: "active" | "cut" | "withdrawn" = "active";
              if (row.toLowerCase().includes('cut') || row.toLowerCase().includes('mc')) {
                playerStatus = 'cut';
              } else if (row.toLowerCase().includes('wd') || row.toLowerCase().includes('withdrawn')) {
                playerStatus = 'withdrawn';
              }
              
              // Parse scores
              const score = parseScoreValue(scoreText);
              const today = parseScoreValue(todayText);
              
              leaderboard.push({
                position: parseInt(position.replace(/\D/g, '')) || i,
                name: name.trim(),
                score: score,
                today: today,
                thru: thruText.trim() || 'F',
                status: playerStatus
              });
            }
          }
        }
      }
    }
    
    if (leaderboard.length > 0) {
      console.log(`Successfully scraped ${leaderboard.length} players from ESPN`);
      
      // Sort by position
      return leaderboard.sort((a, b) => a.position - b.position);
    }
    
    console.error("Failed to extract leaderboard data from ESPN");
    return [];
  } catch (error) {
    console.error("Error scraping ESPN:", error);
    return [];
  }
};
