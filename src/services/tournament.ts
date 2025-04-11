
import { TournamentRound } from "@/types";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";

// Cache keys
const TOURNAMENT_INFO_CACHE_KEY = "tournamentInfo";
const TOURNAMENT_STATUS_CACHE_KEY = "tournamentStatus";

// Tournament date constants
const TOURNAMENT_DATES = {
  2025: {
    start: "2025-04-10",
    end: "2025-04-13"
  }
};

// Current tournament year from env or current year
export const TOURNAMENT_YEAR = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();

/**
 * Check if the tournament is currently in progress
 * Uses current date and tournament schedule
 */
export const isTournamentInProgress = async (): Promise<boolean> => {
  try {
    // Check cached status first (valid for 15 minutes)
    const cached = getFromCache<boolean>(TOURNAMENT_STATUS_CACHE_KEY, 15 * 60 * 1000);
    
    if (cached.data !== null) {
      return cached.data;
    }
    
    // For demo or testing, use environment variable if available
    if (import.meta.env.VITE_FORCE_TOURNAMENT_ACTIVE === "true") {
      const isActive = true;
      saveToCache(TOURNAMENT_STATUS_CACHE_KEY, isActive, "env-override");
      return isActive;
    }
    
    // Get tournament dates for current year
    const tournamentDates = TOURNAMENT_DATES[TOURNAMENT_YEAR] || {
      start: `${TOURNAMENT_YEAR}-04-10`,
      end: `${TOURNAMENT_YEAR}-04-13`
    };
    
    const now = new Date();
    const startDate = new Date(tournamentDates.start);
    const endDate = new Date(tournamentDates.end);
    
    // Add time to end date (tournament ends in the evening)
    endDate.setHours(23, 59, 59);
    
    // Check if current date is within tournament dates
    const isActive = now >= startDate && now <= endDate;
    
    // Cache the result
    saveToCache(TOURNAMENT_STATUS_CACHE_KEY, isActive, "date-calculation");
    
    return isActive;
  } catch (error) {
    console.error("Error checking tournament status:", error);
    // Default to inactive if there's an error
    return false;
  }
};

/**
 * Get current tournament round based on date
 */
export const getCurrentRound = (): TournamentRound => {
  try {
    // For testing/demo, use environment variable if available
    if (import.meta.env.VITE_FORCE_TOURNAMENT_ROUND) {
      return Number(import.meta.env.VITE_FORCE_TOURNAMENT_ROUND) as TournamentRound;
    }
    
    // Get tournament dates for current year
    const tournamentDates = TOURNAMENT_DATES[TOURNAMENT_YEAR] || {
      start: `${TOURNAMENT_YEAR}-04-10`,
      end: `${TOURNAMENT_YEAR}-04-13`
    };
    
    const now = new Date();
    const startDate = new Date(tournamentDates.start);
    
    // Check if tournament hasn't started yet
    if (now < startDate) {
      return 1; // Return round 1 instead of 0 to comply with TournamentRound type
    }
    
    // Calculate days since start to determine round
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Map days to rounds (1-4)
    const round = Math.min(Math.max(daysDiff + 1, 1), 4) as TournamentRound;
    
    return round;
  } catch (error) {
    console.error("Error determining current round:", error);
    // Default to round 1 if there's an error
    return 1;
  }
};

/**
 * Get current tournament info including dates, name, and status
 */
export const getCurrentTournament = async () => {
  try {
    // Check cached tournament info (valid for 1 hour)
    const cached = getFromCache(TOURNAMENT_INFO_CACHE_KEY, 60 * 60 * 1000);
    
    if (cached.data !== null) {
      return cached.data;
    }
    
    // Get tournament dates for current year
    const tournamentDates = TOURNAMENT_DATES[TOURNAMENT_YEAR] || {
      start: `${TOURNAMENT_YEAR}-04-10`,
      end: `${TOURNAMENT_YEAR}-04-13`
    };
    
    const now = new Date();
    const startDate = new Date(tournamentDates.start);
    const endDate = new Date(tournamentDates.end);
    
    // Add time to end date (tournament ends in the evening)
    endDate.setHours(23, 59, 59);
    
    // Determine tournament status
    const isActive = now >= startDate && now <= endDate;
    const isUpcoming = now < startDate;
    const isPast = now > endDate;
    
    const tournamentInfo = {
      name: `${TOURNAMENT_YEAR} Masters Tournament`,
      startDate: tournamentDates.start,
      endDate: tournamentDates.end,
      isActive,
      isUpcoming,
      isPast,
      year: TOURNAMENT_YEAR,
      course: "Augusta National Golf Club",
      currentRound: getCurrentRound(),
      source: "date-calculation"
    };
    
    // Cache the tournament info
    saveToCache(TOURNAMENT_INFO_CACHE_KEY, tournamentInfo, "calculation");
    
    return tournamentInfo;
  } catch (error) {
    console.error("Error getting tournament info:", error);
    
    // Return minimal fallback info
    return {
      name: `${TOURNAMENT_YEAR} Masters Tournament`,
      startDate: `${TOURNAMENT_YEAR}-04-10`,
      endDate: `${TOURNAMENT_YEAR}-04-13`,
      isActive: false,
      isUpcoming: true,
      isPast: false,
      year: TOURNAMENT_YEAR,
      course: "Augusta National Golf Club",
      currentRound: 0,
      source: "fallback"
    };
  }
};
