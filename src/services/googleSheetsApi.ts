
/**
 * Google Sheets API integration for Masters Pool data
 * 
 * This service handles fetching and parsing data from a Google Sheets document
 * containing Masters Pool standings and player information.
 */

import { PoolParticipant, GolferScore } from "@/types";

// Google Sheets document ID from the URL
const SHEETS_DOC_ID = "1UjBLU-_BC-8ieVU0Rj6-Y2jZSHcVnQgIMwvBZzZxw5o";
const API_KEY = "AIzaSyBwGnwRwIzVb6cFM_K3ixpqPAjLaA_hMkk"; // This is a client-side public API key

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
    const pick1Index = headers.indexOf("pick 1");
    const pick2Index = headers.indexOf("pick 2");
    const pick3Index = headers.indexOf("pick 3");
    const pick4Index = headers.indexOf("pick 4");
    const pick1ScoreIndex = headers.indexOf("pick 1 score");
    const pick2ScoreIndex = headers.indexOf("pick 2 score");
    const pick3ScoreIndex = headers.indexOf("pick 3 score");
    const pick4ScoreIndex = headers.indexOf("pick 4 score");
    const tiebreaker1Index = headers.indexOf("tiebreaker 1");
    const tiebreaker2Index = headers.indexOf("tiebreaker 2");
    const paidIndex = headers.indexOf("paid");
    
    // Map row data to PoolParticipant objects
    const standings: PoolParticipant[] = rowData.slice(1).map(row => {
      const picks = [
        row[pick1Index] || "",
        row[pick2Index] || "",
        row[pick3Index] || "",
        row[pick4Index] || ""
      ].filter(pick => pick !== "");
      
      const pickScores: Record<string, number> = {};
      if (row[pick1Index] && row[pick1ScoreIndex]) {
        pickScores[row[pick1Index]] = parseInt(row[pick1ScoreIndex], 10) || 0;
      }
      if (row[pick2Index] && row[pick2ScoreIndex]) {
        pickScores[row[pick2Index]] = parseInt(row[pick2ScoreIndex], 10) || 0;
      }
      if (row[pick3Index] && row[pick3ScoreIndex]) {
        pickScores[row[pick3Index]] = parseInt(row[pick3ScoreIndex], 10) || 0;
      }
      if (row[pick4Index] && row[pick4ScoreIndex]) {
        pickScores[row[pick4Index]] = parseInt(row[pick4ScoreIndex], 10) || 0;
      }
      
      return {
        position: parseInt(row[positionIndex], 10) || 0,
        name: row[nameIndex] || "Unknown",
        totalScore: parseInt(row[scoreIndex], 10) || 0,
        totalPoints: parseInt(row[pointsIndex], 10) || 0,
        picks,
        pickScores,
        tiebreaker1: row[tiebreaker1Index] ? parseInt(row[tiebreaker1Index], 10) : undefined,
        tiebreaker2: row[tiebreaker2Index] ? parseInt(row[tiebreaker2Index], 10) : undefined,
        paid: row[paidIndex]?.toLowerCase() === "true" || row[paidIndex]?.toLowerCase() === "yes" || false
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
