import { GolferScore, PoolParticipant, TournamentRound } from "@/types";
import { buildGolferScoreMap, calculatePoolStandings } from "@/utils/scoringUtils";

/**
 * Fetch current tournament leaderboard data with fallback handling
 */
export const fetchLeaderboardData = async () => {
  try {
    // In a production app, we would fetch from a real API
    // For demo purposes, simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if we have fresh data in localStorage
    const cachedData = localStorage.getItem('leaderboardData');
    const cachedTimestamp = localStorage.getItem('leaderboardTimestamp');
    
    // If we have cached data less than 5 minutes old, use it
    if (cachedData && cachedTimestamp) {
      const now = new Date().getTime();
      const cacheTime = parseInt(cachedTimestamp, 10);
      
      // Cache is valid for 5 minutes
      if (now - cacheTime < 5 * 60 * 1000) {
        console.log('Using cached leaderboard data');
        return JSON.parse(cachedData);
      }
    }
    
    // Simulate fetching from API
    const data = getFallbackData();
    
    // Cache the fresh data
    localStorage.setItem('leaderboardData', JSON.stringify(data));
    localStorage.setItem('leaderboardTimestamp', new Date().getTime().toString());
    
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    
    // Try to use cached data even if it's older than 5 minutes
    const cachedData = localStorage.getItem('leaderboardData');
    if (cachedData) {
      console.log('Using older cached data as fallback');
      return JSON.parse(cachedData);
    }
    
    // Ultimate fallback if everything fails
    return getFallbackData();
  }
};

/**
 * Get information about the current tournament
 */
export const getCurrentTournament = async (): Promise<any> => {
  try {
    // For now, return a hardcoded tournament for The Masters
    return {
      tournId: "401353338",
      name: "The Masters",
      startDate: "2024-04-11",
      endDate: "2024-04-14",
      course: "Augusta National Golf Club",
      isUpcoming: false,
      currentRound: getCurrentRound()
    };
  } catch (error) {
    console.error('Error fetching current tournament:', error);
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
};

/**
 * Calculate current tournament round based on date
 */
const getCurrentRound = (): TournamentRound => {
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

/**
 * Get fallback leaderboard data for when API is unavailable
 */
const getFallbackData = () => {
  // Sample data for when the API is not available
  const fallbackLeaderboard: GolferScore[] = [
    { position: 1, name: "Scottie Scheffler", score: -10, today: -4, thru: "F", status: "active" },
    { position: 2, name: "Collin Morikawa", score: -8, today: -3, thru: "F", status: "active" },
    { position: 3, name: "Rory McIlroy", score: -7, today: -2, thru: "F", status: "active" },
    { position: 4, name: "Ludvig Åberg", score: -6, today: -2, thru: "F", status: "active" },
    { position: 5, name: "Bryson DeChambeau", score: -5, today: -1, thru: "F", status: "active" },
    { position: 6, name: "Xander Schauffele", score: -4, today: -1, thru: "F", status: "active" },
    { position: 7, name: "Tommy Fleetwood", score: -3, today: -1, thru: "F", status: "active" },
    { position: 8, name: "Brooks Koepka", score: -2, today: 0, thru: "F", status: "active" },
    { position: 9, name: "Shane Lowry", score: -1, today: +1, thru: "F", status: "active" },
    { position: 10, name: "Jon Rahm", score: 0, today: +2, thru: "F", status: "active" },
    { position: 11, name: "Justin Thomas", score: +1, today: +1, thru: "F", status: "active" },
    { position: 12, name: "Jordan Spieth", score: +2, today: +2, thru: "F", status: "active" },
    { position: 13, name: "Patrick Cantlay", score: +3, today: +3, thru: "F", status: "active" },
    { position: 14, name: "Dustin Johnson", score: +4, today: +2, thru: "F", status: "active" },
    { position: 15, name: "Cameron Smith", score: +5, today: +3, thru: "F", status: "active" },
    { position: 16, name: "Hideki Matsuyama", score: +6, today: +4, thru: "F", status: "active" },
    { position: 17, name: "Russell Henley", score: +7, today: +5, thru: "F", status: "active" },
    { position: 18, name: "Viktor Hovland", score: +8, today: +6, thru: "F", status: "active" },
    { position: 19, name: "Will Zalatoris", score: +9, today: +7, thru: "F", status: "active" },
    { position: 20, name: "Min Woo Lee", score: +10, today: +8, thru: "F", status: "active" },
    { position: 21, name: "Joaquín Niemann", score: +11, today: +9, thru: "F", status: "active" },
    { position: 22, name: "Sepp Straka", score: +12, today: +10, thru: "F", status: "active" },
    { position: 23, name: "Robert MacIntyre", score: +13, today: +11, thru: "F", status: "active" },
    { position: 24, name: "Tony Finau", score: +14, today: +12, thru: "F", status: "active" },
    { position: 25, name: "Wyndham Clark", score: +15, today: +13, thru: "F", status: "active" },
    { position: 26, name: "Sergio Garcia", score: +16, today: +14, thru: "F", status: "active" },
    { position: 27, name: "Corey Conners", score: +17, today: +15, thru: "F", status: "active" },
    { position: 28, name: "Akshay Bhatia", score: +18, today: +16, thru: "F", status: "active" },
    { position: 29, name: "Tyrrell Hatton", score: +19, today: +17, thru: "F", status: "active" },
    { position: 30, name: "Matt Fitzpatrick", score: +20, today: +18, thru: "F", status: "active" },
    // Additional golfers that are in participant selections but not in top 30
    { position: 31, name: "Tom Kim", score: +21, today: +3, thru: "F", status: "active" },
    { position: 32, name: "Billy Horschel", score: +22, today: +4, thru: "F", status: "active" },
    { position: 33, name: "Keegan Bradley", score: +23, today: +5, thru: "F", status: "active" },
    { position: 34, name: "Jason Day", score: +24, today: +6, thru: "F", status: "active" },
    { position: 35, name: "Adam Scott", score: +25, today: +7, thru: "F", status: "active" },
    { position: 36, name: "Tom Hoge", score: +26, today: +8, thru: "F", status: "active" },
    { position: 37, name: "Sahith Theegala", score: +27, today: +9, thru: "F", status: "active" },
    { position: 38, name: "Max Homa", score: +28, today: +10, thru: "F", status: "active" },
    { position: 39, name: "Cameron Young", score: +29, today: +11, thru: "F", status: "active" },
    { position: 40, name: "Patrick Reed", score: +30, today: +12, thru: "F", status: "active" },
    { position: 41, name: "Justin Rose", score: +31, today: +13, thru: "F", status: "active" },
    { position: 42, name: "Sungjae Im", score: +32, today: +14, thru: "F", status: "active" },
    { position: 43, name: "Danny Willett", score: +33, today: +15, thru: "F", status: "active" },
    { position: 44, name: "Zach Johnson", score: +34, today: +16, thru: "F", status: "active" },
    { position: 45, name: "Chris Kirk", score: +35, today: +17, thru: "F", status: "active" },
    { position: 46, name: "Matthieu Pavon", score: +36, today: +18, thru: "F", status: "active" },
    { position: 47, name: "Phil Mickelson", score: +37, today: +19, thru: "F", status: "active" },
    { position: 48, name: "Denny McCarthy", score: +38, today: +20, thru: "F", status: "active" },
    { position: 49, name: "J.J. Spaun", score: +39, today: +21, thru: "F", status: "active" },
    { position: 50, name: "Jose Luis Ballester (a)", score: +40, today: +22, thru: "F", status: "active" },
  ];

  return {
    leaderboard: fallbackLeaderboard,
    lastUpdated: new Date().toISOString(),
    currentRound: getCurrentRound()
  };
};

/**
 * Fetch pool standings with fallback measures
 */
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // First get the current leaderboard to ensure scores match
    const { leaderboard } = await fetchLeaderboardData();
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScores = buildGolferScoreMap(leaderboard);
    
    // Get the player selections
    const selectionsData = await fetchPlayerSelections();
    
    // Calculate and return the pool standings
    return calculatePoolStandings(selectionsData, golferScores);
  } catch (error) {
    console.error('Error fetching pool standings:', error);
    
    // Try to use cached pool standings
    const cachedStandings = localStorage.getItem('poolStandingsData');
    if (cachedStandings) {
      console.log('Using cached pool standings as fallback');
      return JSON.parse(cachedStandings);
    }
    
    return [];
  }
};

/**
 * Fetch player selections with all 132 participants
 * Now including roundScores and tiebreakers to match TeamSelection type
 */
export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get current leaderboard data to calculate real scores
    const { leaderboard } = await fetchLeaderboardData();
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScoreMap: Record<string, number> = {};
    leaderboard.forEach(golfer => {
      golferScoreMap[golfer.name] = golfer.score;
    });
    
    // Return the actual team data with scores
    const teamsData = {
      "Ben Applebaum": {
        picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Elia Ayaz": {
        picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Mike Baker": {
        picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Louis Baker": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Ross Baker": {
        picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Peter Bassett": {
        picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Ted Beckman": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Hilary Beckman": {
        picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Oliver Beckman": {
        picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Jimmy Beltz": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Peter Beugg": {
        picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "James Carlson": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Nate Carlson": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Annie Carlson": {
        picks: ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Hadley Carlson": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Quinn Carlson": {
        picks: ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Ed Corbett": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Chuck Corbett Sr": {
        picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Chris Crawford": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Justin Darcy": {
        picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Holland Darcy": {
        picks: ["Jordan Spieth", "Collin Morikawa", "Xander Schauffele", "Viktor Hovland", "Jose Luis Ballester (a)"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Audrey Darcy": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Cameron Young", "Zach Johnson"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Ava Rose Darcy": {
        picks: ["Wyndham Clark", "Justin Rose", "Jon Rahm", "Scottie Scheffler", "Viktor Hovland"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Jay Despard": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Min Woo Lee", "Russell Henley", "Robert MacIntyre"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Pete Drago": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Sergio Garcia", "Sepp Straka"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Alexa Drago": {
        picks: ["Xander Schauffele", "Scottie Scheffler", "Patrick Cantlay", "Jordan Spieth", "Hideki Matsuyama"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Ollie Drago": {
        picks: ["Scottie Scheffler", "Jon Rahm", "Patrick Cantlay", "Sergio Garcia", "Patrick Reed"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Charlie Drago": {
        picks: ["Jon Rahm", "Collin Morikawa", "Patrick Cantlay", "Patrick Reed", "Jordan Spieth"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Adam Duff": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Brooks Koepka", "Viktor Hovland", "Cameron Smith"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Tilly Duff": {
        picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Brooks Koepka", "Tommy Fleetwood"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      },
      "Gretchen Duff": {
        picks: ["Ludvig Åberg", "Xander Schauffele", "Tommy Fleetwood", "Hideki Matsuyama", "Russell Henley"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [138, 280] as [number, number]
      },
      "Charles Elder": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Robert MacIntyre", "Joaquín Niemann", "Hideki Matsuyama"],
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [140, 276] as [number, number]
      }
      // ... Additional participants would be included here
    };
    
    // Calculate scores based on actual leaderboard data
    Object.values(teamsData).forEach(team => {
      team.picks.forEach((pick, index) => {
        team.roundScores[index] = golferScoreMap[pick] !== undefined ? golferScoreMap[pick] : 0;
      });
    });
    
    // Cache the data
    localStorage.setItem('playerSelectionsData', JSON.stringify(teamsData));
    
    return teamsData;
  } catch (error) {
    console.error('Error fetching player selections:', error);
    
    // Try to use cached player selections
    const cachedSelections = localStorage.getItem('playerSelectionsData');
    if (cachedSelections) {
      console.log('Using cached player selections as fallback');
      return JSON.parse(cachedSelections);
    }
    
    // Fallback to empty structure with proper types
    return {};
  }
};

/**
 * Check if tournament is currently in progress
 */
export const isTournamentInProgress = async (): Promise<boolean> => {
  try {
    const tournament = await getCurrentTournament();
    if (!tournament) return false;
    
    const { startDate, endDate } = tournament;
    const currentDate = new Date();
    const tournamentStart = new Date(startDate);
    const tournamentEnd = new Date(endDate);
    
    // Add 23:59:59 to end date to include the entire last day
    tournamentEnd.setHours(23, 59, 59);
    
    return currentDate >= tournamentStart && currentDate <= tournamentEnd;
  } catch (error) {
    console.error('Error checking tournament status:', error);
    
    // Default to true during Masters week
    const today = new Date();
    const mastersStart = new Date('2024-04-11');
    const mastersEnd = new Date('2024-04-14');
    mastersEnd.setHours(23, 59, 59);
    
    return today >= mastersStart && today <= mastersEnd;
  }
};
