
import { TournamentRound } from "@/types";

/**
 * Check if the tournament is currently in progress
 */
export const isTournamentInProgress = async (): Promise<boolean> => {
  try {
    // For demo purposes, we'll simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, we would check the tournament dates and current time
    // For this demo, we'll determine if the tournament is active based on today's date
    const today = new Date();
    const tournamentStart = new Date('2024-04-11');
    const tournamentEnd = new Date('2024-04-14');
    
    // Add time to the end date to include the full day
    tournamentEnd.setHours(23, 59, 59, 999);
    
    // Check if today is between start and end dates
    const isActive = today >= tournamentStart && today <= tournamentEnd;
    
    console.log("Tournament active status:", isActive);
    return isActive;
  } catch (error) {
    console.error('Error checking tournament status:', error);
    return false; // Default to inactive if there's an error
  }
};

/**
 * Get information about the current tournament
 */
export const getCurrentTournament = async (): Promise<any> => {
  try {
    // Attempt to fetch from ESPN API
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract tournament info from ESPN data
    const event = data?.events?.[0] || {};
    
    return {
      tournId: event.id || "401353338",
      name: event.name || "The Masters",
      startDate: event.competitions?.[0]?.date || "2024-04-11",
      endDate: calculateEndDate(event.competitions?.[0]?.date || "2024-04-11"),
      course: event.competitions?.[0]?.venue?.fullName || "Augusta National Golf Club",
      isUpcoming: false,
      currentRound: getCurrentRound()
    };
  } catch (error) {
    console.error('Error fetching current tournament:', error);
    
    // Try to get tournament info from Masters.com as fallback
    try {
      console.log("Attempting to fetch tournament info from Masters.com as fallback...");
      const mastersData = await fetchMastersTournamentInfo();
      return mastersData;
    } catch (mastersError) {
      console.error("Error fetching from Masters.com:", mastersError);
      
      // Ultimate fallback with basic info
      return {
        tournId: "401353338",
        name: "The Masters",
        startDate: "2024-04-11",
        endDate: "2024-04-14",
        course: "Augusta National Golf Club",
        isUpcoming: false,
        currentRound: 1 as TournamentRound
      };
    }
  }
};

/**
 * Fallback function to fetch tournament info from the official Masters website
 */
const fetchMastersTournamentInfo = async () => {
  // This is a placeholder for actual scraping logic
  // In a real app, you would fetch and parse the tournament info page
  
  // For now, return basic Masters tournament info
  return {
    tournId: "masters2024",
    name: "The Masters",
    startDate: "2024-04-11",
    endDate: "2024-04-14",
    course: "Augusta National Golf Club",
    isUpcoming: false,
    currentRound: getCurrentRound() as TournamentRound,
    source: "masters.com"
  };
};

/**
 * Calculate end date based on start date (tournament is typically 4 days)
 */
export const calculateEndDate = (startDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 3); // 4-day tournament
  return end.toISOString().split('T')[0];
};

/**
 * Calculate current tournament round based on date
 */
export const getCurrentRound = (): TournamentRound => {
  const today = new Date();
  const tournamentStart = new Date('2024-04-11');
  
  const diffDays = Math.floor((today.getTime() - tournamentStart.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (diffDays) {
    case 0: return 1;
    case 1: return 2;
    case 2: return 3;
    case 3: return 4;
    default: return 1;
  }
};
