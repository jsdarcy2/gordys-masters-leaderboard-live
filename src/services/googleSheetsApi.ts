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
const API_KEY = "AIzaSyDIWNdmPj7lSWfP8RmK9-I_I2CGOyh2WFc"; // Updated API key for Google Sheets

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
    throw error;
  }
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
