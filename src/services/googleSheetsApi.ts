
/**
 * Google Sheets API integration for Masters Pool data
 * 
 * This service handles fetching and parsing data from a Google Sheets document
 * containing Masters Pool standings and player information.
 */

import { PoolParticipant, GolferScore } from "@/types";
import { getBestFourGolfers } from "@/utils/scoringUtils";

// Google Sheets document ID from the URL
const SHEETS_DOC_ID = "1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o";
const API_KEY = "AIzaSyB4Oi-rkrDPGfgWjyPZkZVhvuBGK1ryhVU"; // Updated API key for Google Sheets

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA_FALLBACK = true;

/**
 * Fetches data from a specific sheet in the Google Sheets document
 */
async function fetchSheetData(sheetName: string): Promise<any[][]> {
  try {
    // Using the sheets.spreadsheets.values.get API endpoint
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_DOC_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
    console.log(`Fetching Google Sheets data from: ${sheetName}`);
    
    // Add query parameters to avoid caching
    const requestUrl = `${url}&_nocache=${new Date().getTime()}`;
    
    const response = await fetch(requestUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Sheets API error: ${response.status} ${errorText}`);
      throw new Error(`Failed to fetch sheet data: ${response.status} ${errorText ? errorText : ''}`);
    }
    
    const data = await response.json();
    
    if (!data.values || !Array.isArray(data.values) || data.values.length === 0) {
      console.warn(`No data found in sheet: ${sheetName}`);
      return [];
    }
    
    // Log a small sample of the data for debugging
    console.log(`Retrieved ${data.values.length} rows from ${sheetName}. Sample:`, 
      data.values.slice(0, 2));
    
    return data.values;
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    
    if (USE_MOCK_DATA_FALLBACK) {
      console.log("Using mock data fallback for sheet:", sheetName);
      return getMockDataForSheet(sheetName);
    }
    
    throw error;
  }
}

/**
 * Provides mock data for testing when API is unavailable
 */
function getMockDataForSheet(sheetName: string): any[][] {
  if (sheetName.toLowerCase() === "leaderboard") {
    return [
      ["position", "name", "score", "today", "thru", "status", "strokes"],
      ["1", "Scottie Scheffler", "-9", "-3", "F", "active", "279"],
      ["2", "Collin Morikawa", "-6", "-2", "F", "active", "282"],
      ["3", "Max Homa", "-4", "-3", "F", "active", "284"],
      ["4", "Ludvig Åberg", "-3", "-1", "F", "active", "285"],
      ["5", "Tommy Fleetwood", "-2", "-1", "F", "active", "286"],
      ["6", "Bryson DeChambeau", "-1", "0", "F", "active", "287"],
      ["7", "Xander Schauffele", "E", "+1", "F", "active", "288"],
      ["8", "Patrick Cantlay", "+1", "+2", "F", "active", "289"],
      ["9", "Cameron Smith", "+2", "+3", "F", "active", "290"],
      ["10", "Rory McIlroy", "+3", "+1", "F", "active", "291"],
      ["11", "Tiger Woods", "+4", "+2", "F", "active", "292"],
      ["51", "Jordan Spieth", "+10", "+2", "F", "cut", "298"],
      ["52", "Justin Thomas", "+11", "+3", "F", "cut", "299"]
    ];
  } else if (sheetName.toLowerCase() === "pool standings") {
    return [
      ["position", "name", "total score", "total points", "pick 1", "pick 1 score", "pick 2", "pick 2 score", "pick 3", "pick 3 score", "pick 4", "pick 4 score", "pick 5", "pick 5 score", "tiebreaker 1", "tiebreaker 2", "paid"],
      ["1", "John Doe", "-14", "1000", "Scottie Scheffler", "-9", "Collin Morikawa", "-6", "Xander Schauffele", "E", "Rory McIlroy", "+3", "Jordan Spieth", "+10", "275", "68", "yes"],
      ["2", "Jane Smith", "-12", "900", "Scottie Scheffler", "-9", "Collin Morikawa", "-6", "Max Homa", "-4", "Cameron Smith", "+2", "Tiger Woods", "+4", "276", "69", "yes"],
      ["3", "Bob Johnson", "-9", "800", "Scottie Scheffler", "-9", "Tommy Fleetwood", "-2", "Bryson DeChambeau", "-1", "Patrick Cantlay", "+1", "Justin Thomas", "+11", "277", "70", "yes"],
      ["4", "Alice Brown", "-6", "700", "Collin Morikawa", "-6", "Max Homa", "-4", "Ludvig Åberg", "-3", "Xander Schauffele", "E", "Tiger Woods", "+4", "278", "71", "no"],
      ["5", "Charlie Davis", "-5", "600", "Max Homa", "-4", "Ludvig Åberg", "-3", "Bryson DeChambeau", "-1", "Cameron Smith", "+2", "Rory McIlroy", "+3", "279", "72", "yes"]
    ];
  }
  
  // Default empty response
  return [["No mock data available"]];
}

/**
 * Extracts column indices from header row
 */
function getColumnIndices(headers: string[], columnNames: string[]): Record<string, number> {
  const indices: Record<string, number> = {};
  
  columnNames.forEach(name => {
    indices[name] = headers.indexOf(name.toLowerCase());
  });
  
  return indices;
}

/**
 * Fetches and parses pool standings data from the Google Sheet
 */
export async function fetchPoolStandingsFromGoogleSheets(): Promise<PoolParticipant[]> {
  try {
    const sheetName = "Pool Standings";
    const rowData = await fetchSheetData(sheetName);
    
    if (!rowData || rowData.length < 2) {
      throw new Error("Invalid or empty pool standings data");
    }
    
    // Extract header row to identify column indices
    const headers = rowData[0].map(header => header.toLowerCase());
    const indices = getColumnIndices(headers, [
      "position", "name", "total score", "total points",
      "tiebreaker 1", "tiebreaker 2", "paid"
    ]);
    
    // Find pick columns (looking for pick 1, pick 2, pick 3, pick 4, pick 5)
    const pickIndices: number[] = [];
    const pickScoreIndices: number[] = [];
    
    for (let i = 1; i <= 5; i++) {
      const pickIndex = headers.indexOf(`pick ${i}`);
      if (pickIndex !== -1) {
        pickIndices.push(pickIndex);
      }
      
      const pickScoreIndex = headers.indexOf(`pick ${i} score`);
      if (pickScoreIndex !== -1) {
        pickScoreIndices.push(pickScoreIndex);
      }
    }
    
    // Map row data to PoolParticipant objects
    const standings: PoolParticipant[] = rowData.slice(1).map(row => {
      // Get all 5 picks
      const picks: string[] = [];
      pickIndices.forEach(index => {
        if (row[index] && row[index].trim() !== "") {
          picks.push(row[index]);
        }
      });
      
      // Get all pick scores
      const pickScores: Record<string, number> = {};
      
      // Match pick names with their scores
      picks.forEach((pick, i) => {
        if (pickScoreIndices[i] !== undefined && row[pickScoreIndices[i]] !== undefined) {
          const scoreVal = parseInt(row[pickScoreIndices[i]], 10);
          pickScores[pick] = isNaN(scoreVal) ? 0 : scoreVal;
        } else {
          pickScores[pick] = 0;
        }
      });
      
      // Calculate best 4 golfers
      const bestFourGolfers = getBestFourGolfers(pickScores);
      
      return {
        position: parseInt(row[indices["position"]], 10) || 0,
        name: row[indices["name"]] || "Unknown",
        totalScore: parseInt(row[indices["total score"]], 10) || 0,
        totalPoints: parseInt(row[indices["total points"]], 10) || 0,
        picks,
        pickScores,
        tiebreaker1: row[indices["tiebreaker 1"]] ? parseInt(row[indices["tiebreaker 1"]], 10) : undefined,
        tiebreaker2: row[indices["tiebreaker 2"]] ? parseInt(row[indices["tiebreaker 2"]], 10) : undefined,
        paid: row[indices["paid"]]?.toLowerCase() === "true" || row[indices["paid"]]?.toLowerCase() === "yes" || false,
        bestFourGolfers
      };
    });
    
    // Sort by position
    return standings.sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error("Error parsing pool standings from Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetches and parses leaderboard data from the Google Sheet
 */
export async function fetchLeaderboardFromGoogleSheets(): Promise<GolferScore[]> {
  try {
    console.log("Fetching leaderboard data...");
    
    const sheetName = "Leaderboard";
    const rowData = await fetchSheetData(sheetName);
    
    if (!rowData || rowData.length < 2) {
      throw new Error("Invalid or empty leaderboard data");
    }
    
    // Extract header row to identify column indices
    const headers = rowData[0].map(header => header.toLowerCase());
    const indices = getColumnIndices(headers, [
      "position", "name", "score", "today", "thru", "status", "strokes"
    ]);
    
    // Log any rows that might be skipped due to invalid data
    rowData.slice(1).forEach((row, index) => {
      if (!row[indices["name"]] || row[indices["name"]].trim() === "") {
        console.log(`Skipping row ${index + 1} due to missing name`);
      }
    });
    
    // Map row data to GolferScore objects
    const leaderboard: GolferScore[] = rowData.slice(1)
      .filter(row => row[indices["name"]] && row[indices["name"]].trim() !== "")
      .map(row => {
        return {
          position: parseInt(row[indices["position"]], 10) || 0,
          name: row[indices["name"]] || "Unknown",
          score: parseInt(row[indices["score"]], 10) || 0,
          today: parseInt(row[indices["today"]], 10) || 0,
          thru: row[indices["thru"]] || "F",
          status: (row[indices["status"]]?.toLowerCase() || "active") as "active" | "cut" | "withdrawn",
          strokes: row[indices["strokes"]] ? parseInt(row[indices["strokes"]], 10) : undefined
        };
      });
    
    // Sort by position
    return leaderboard.sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error("Error parsing leaderboard from Google Sheets:", error);
    throw error;
  }
}

/**
 * Checks if the Google Sheets API is available and the document is accessible
 */
export async function checkGoogleSheetsAvailability(): Promise<boolean> {
  try {
    // Try to fetch a small amount of data to check availability
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_DOC_ID}/values/A1:A1?key=${API_KEY}`;
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Google Sheets API check failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    console.log("Google Sheets API is available:", data);
    return true;
  } catch (error) {
    console.error("Google Sheets API not available:", error);
    return false;
  }
}

// Function to force refresh from Google Sheets
export async function forceRefreshFromGoogleSheets(): Promise<boolean> {
  try {
    // Clear any cached data
    localStorage.removeItem('googleSheetsCache');
    
    // Test if we can access the API
    return await checkGoogleSheetsAvailability();
  } catch (error) {
    console.error("Force refresh from Google Sheets failed:", error);
    return false;
  }
}

// Export a test function that can be called from the console for debugging
(window as any).testGoogleSheetsConnection = async () => {
  try {
    const available = await checkGoogleSheetsAvailability();
    console.log("Google Sheets available:", available);
    
    if (available) {
      const sheetName = "Pool Standings";
      const data = await fetchSheetData(sheetName);
      console.log(`Test data from ${sheetName}:`, data.slice(0, 5));
    }
    
    return available;
  } catch (error) {
    console.error("Test connection failed:", error);
    return false;
  }
};

// Debug function - can be called to test the mock data
(window as any).testMockData = () => {
  const leaderboardMock = getMockDataForSheet("Leaderboard");
  const standingsMock = getMockDataForSheet("Pool Standings");
  
  console.log("Mock Leaderboard Data:", leaderboardMock);
  console.log("Mock Pool Standings Data:", standingsMock);
  
  return {
    leaderboard: leaderboardMock,
    standings: standingsMock
  };
};
