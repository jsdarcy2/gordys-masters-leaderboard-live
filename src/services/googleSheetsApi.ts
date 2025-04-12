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
const API_KEY = "AIzaSyDa_J9wM1OZJ3CMHXWRYzf5u1vIBr6SBcI"; // Updated API key

/**
 * Fetches data from a specific sheet in the Google Sheets document
 */
async function fetchSheetData(sheetName: string): Promise<any[][]> {
  try {
    // Using the sheets.spreadsheets.values.get API endpoint
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_DOC_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.values || !Array.isArray(data.values) || data.values.length === 0) {
      console.warn(`No data found in sheet: ${sheetName}`);
      return [];
    }
    
    return data.values;
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
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
    const positionIndex = headers.indexOf("position");
    const nameIndex = headers.indexOf("name");
    const scoreIndex = headers.indexOf("total score");
    const pointsIndex = headers.indexOf("total points");
    
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
    
    const tiebreaker1Index = headers.indexOf("tiebreaker 1");
    const tiebreaker2Index = headers.indexOf("tiebreaker 2");
    const paidIndex = headers.indexOf("paid");
    
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
        position: parseInt(row[positionIndex], 10) || 0,
        name: row[nameIndex] || "Unknown",
        totalScore: parseInt(row[scoreIndex], 10) || 0,
        totalPoints: parseInt(row[pointsIndex], 10) || 0,
        picks,
        pickScores,
        tiebreaker1: row[tiebreaker1Index] ? parseInt(row[tiebreaker1Index], 10) : undefined,
        tiebreaker2: row[tiebreaker2Index] ? parseInt(row[tiebreaker2Index], 10) : undefined,
        paid: row[paidIndex]?.toLowerCase() === "true" || row[paidIndex]?.toLowerCase() === "yes" || false,
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
    const sheetName = "Leaderboard";
    const rowData = await fetchSheetData(sheetName);
    
    if (!rowData || rowData.length < 2) {
      throw new Error("Invalid or empty leaderboard data");
    }
    
    // Extract header row to identify column indices
    const headers = rowData[0].map(header => header.toLowerCase());
    const positionIndex = headers.indexOf("position");
    const nameIndex = headers.indexOf("name");
    const scoreIndex = headers.indexOf("score");
    const todayIndex = headers.indexOf("today");
    const thruIndex = headers.indexOf("thru");
    const statusIndex = headers.indexOf("status");
    const strokesIndex = headers.indexOf("strokes");
    
    // Map row data to GolferScore objects
    const leaderboard: GolferScore[] = rowData.slice(1).map(row => {
      return {
        position: parseInt(row[positionIndex], 10) || 0,
        name: row[nameIndex] || "Unknown",
        score: parseInt(row[scoreIndex], 10) || 0,
        today: parseInt(row[todayIndex], 10) || 0,
        thru: row[thruIndex] || "F",
        status: (row[statusIndex]?.toLowerCase() || "active") as "active" | "cut" | "withdrawn",
        strokes: row[strokesIndex] ? parseInt(row[strokesIndex], 10) : undefined
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
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_DOC_ID}/values/A1:A1?key=${API_KEY}`
    );
    
    return response.ok;
  } catch (error) {
    console.error("Google Sheets API not available:", error);
    return false;
  }
}
