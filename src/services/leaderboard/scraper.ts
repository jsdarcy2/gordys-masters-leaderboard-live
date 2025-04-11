
import { GolferScore } from "@/types";

/**
 * Scrape leaderboard data from masters.com website
 * This is used as a fallback when APIs are not available
 */
export const scrapeMastersWebsite = async (): Promise<GolferScore[]> => {
  try {
    console.log("Attempting to scrape Masters.com leaderboard...");
    
    // Fetch the masters.com leaderboard page
    const response = await fetch("https://www.masters.com/en_US/scores/index.html", {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Masters.com scraping failed with status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log("Successfully fetched Masters.com HTML content");
    
    return parseMastersHtml(html);
  } catch (error) {
    console.error("Error scraping Masters.com:", error);
    throw new Error(`Scraper error: ${error}`);
  }
};

/**
 * Parse HTML content from masters.com to extract leaderboard data
 */
const parseMastersHtml = (html: string): GolferScore[] => {
  const leaderboard: GolferScore[] = [];
  
  try {
    // Create a DOM parser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Find the leaderboard table
    const leaderboardTable = doc.querySelector('.leaderboard-table') || 
                             doc.querySelector('.leaderboard') || 
                             doc.querySelector('table');
    
    if (!leaderboardTable) {
      console.error("Could not find leaderboard table in Masters.com HTML");
      throw new Error("Leaderboard table not found in HTML");
    }
    
    // Find all player rows in the table
    const playerRows = leaderboardTable.querySelectorAll('tr:not(.header)');
    console.log(`Found ${playerRows.length} player rows in the leaderboard table`);
    
    if (playerRows.length === 0) {
      // Try alternative selectors if the main one doesn't work
      const altRows = doc.querySelectorAll('.player-row') || 
                     doc.querySelectorAll('.player-data');
      
      if (altRows.length > 0) {
        console.log(`Found ${altRows.length} player rows using alternative selector`);
        // Process alternative rows
        altRows.forEach((row, index) => {
          const playerData = extractPlayerDataFromAltRow(row);
          if (playerData) {
            leaderboard.push(playerData);
          }
        });
      } else {
        throw new Error("No player rows found in HTML");
      }
    } else {
      // Process regular table rows
      playerRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const position = parsePosition(cells[0].textContent || "");
          
          if (!isNaN(position)) {
            // Extract player name
            const nameElement = cells[1].querySelector('.player-name') || cells[1];
            const playerName = nameElement.textContent?.trim() || "";
            
            // Extract score
            const scoreText = cells[2].textContent?.trim() || "E";
            const score = parseScore(scoreText);
            
            // Extract today's score
            const todayText = cells[3].textContent?.trim() || "E";
            const today = parseScore(todayText);
            
            // Extract thru
            const thruText = cells.length > 4 ? cells[4].textContent?.trim() || "F" : "F";
            
            leaderboard.push({
              position: position,
              name: playerName,
              score: score,
              today: today,
              thru: thruText,
              status: "active"
            });
          }
        }
      });
    }
    
    if (leaderboard.length === 0) {
      // If we didn't extract any data from tables, try a more generic approach
      // This looks for any elements that might have player information
      const playerElements = doc.querySelectorAll('[data-player-id], .player, .competitor');
      
      if (playerElements.length > 0) {
        console.log(`Found ${playerElements.length} player elements using generic selector`);
        processGenericPlayerElements(playerElements, leaderboard);
      }
    }
    
    // Sort leaderboard by position
    leaderboard.sort((a, b) => a.position - b.position);
    
    console.log(`Successfully extracted ${leaderboard.length} players from Masters.com`);
    return leaderboard;
  } catch (error) {
    console.error("Error parsing Masters.com HTML:", error);
    return [];
  }
};

/**
 * Extract player data from alternative row format
 */
const extractPlayerDataFromAltRow = (row: Element): GolferScore | null => {
  try {
    // Extract position
    const posElement = row.querySelector('.position') || 
                      row.querySelector('[data-position]');
    const positionText = posElement?.textContent || 
                         row.getAttribute('data-position') || 
                         "";
    const position = parsePosition(positionText);
    
    if (isNaN(position)) {
      return null;
    }
    
    // Extract player name
    const nameElement = row.querySelector('.player-name') || 
                       row.querySelector('.name') ||
                       row.querySelector('[data-player-name]');
    const playerName = nameElement?.textContent?.trim() || 
                       row.getAttribute('data-player-name') || 
                       "";
    
    // Extract score
    const scoreElement = row.querySelector('.score') || 
                         row.querySelector('.total-score') || 
                         row.querySelector('[data-score]');
    const scoreText = scoreElement?.textContent?.trim() || 
                      row.getAttribute('data-score') || 
                      "E";
    const score = parseScore(scoreText);
    
    // Extract today's score
    const todayElement = row.querySelector('.today') || 
                         row.querySelector('.round-score') || 
                         row.querySelector('[data-today]');
    const todayText = todayElement?.textContent?.trim() || 
                      row.getAttribute('data-today') || 
                      "E";
    const today = parseScore(todayText);
    
    // Extract thru
    const thruElement = row.querySelector('.thru') || 
                        row.querySelector('.hole') || 
                        row.querySelector('[data-thru]');
    const thruText = thruElement?.textContent?.trim() || 
                     row.getAttribute('data-thru') || 
                     "F";
    
    return {
      position: position,
      name: playerName,
      score: score,
      today: today,
      thru: thruText,
      status: "active"
    };
  } catch (error) {
    console.error("Error extracting player data from alt row:", error);
    return null;
  }
};

/**
 * Process player elements with a generic approach
 */
const processGenericPlayerElements = (elements: NodeListOf<Element>, leaderboard: GolferScore[]) => {
  elements.forEach((element, index) => {
    try {
      const position = index + 1;
      const playerName = element.getAttribute('data-player-name') || 
                        element.textContent?.trim() || 
                        `Player ${index + 1}`;
      
      // Look for any text that could represent a score
      const allText = element.textContent || "";
      
      // Try to find score patterns like "-5", "+2", "E", etc.
      const scoreMatch = allText.match(/([+-]\d+|E)/);
      const scoreText = scoreMatch ? scoreMatch[0] : "E";
      const score = parseScore(scoreText);
      
      // Default values for unavailable data
      leaderboard.push({
        position: position,
        name: playerName,
        score: score,
        today: 0,
        thru: "F",
        status: "active"
      });
    } catch (error) {
      console.error("Error processing generic player element:", error);
    }
  });
};

/**
 * Parse position text to number
 */
const parsePosition = (posText: string): number => {
  // Remove any non-numeric characters, except for "T" for ties
  const cleaned = posText.replace(/[^\dT]/g, '').replace('T', '');
  return parseInt(cleaned, 10);
};

/**
 * Parse score text to number
 */
const parseScore = (scoreText: string): number => {
  if (!scoreText) return 0;
  
  // Handle "E" for even par
  if (scoreText.trim() === "E") return 0;
  
  // Extract the number with + or - sign
  const scoreMatch = scoreText.match(/([+-]?\d+)/);
  if (scoreMatch) {
    return parseInt(scoreMatch[0], 10);
  }
  
  return 0;
};
