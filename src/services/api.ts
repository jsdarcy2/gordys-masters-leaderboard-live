// Keep any existing imports at the top
import { GolferScore, PoolParticipant } from "@/types";

export const fetchLeaderboardData = async () => {
  try {
    // Get current tournament info
    const tournament = await getCurrentTournament();
    
    if (!tournament || !tournament.tournId) {
      console.warn('No tournament ID available. Falling back to fallback data.');
      return getFallbackData();
    }
    
    // We'll always use the fallback data to avoid requiring an API key
    return getFallbackData();
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return getFallbackData();
  }
};

export const getCurrentTournament = async (): Promise<any> => {
  try {
    // For now, return a hardcoded tournament for The Masters
    return {
      tournId: "401353338",
      name: "The Masters",
      startDate: "2024-04-11",
      endDate: "2024-04-14",
      course: "Augusta National Golf Club",
      isUpcoming: false
    };
  } catch (error) {
    console.error('Error fetching current tournament:', error);
    return null;
  }
};

// Fix the syntax error with 'E' by changing it to 0
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
  ];

  return {
    leaderboard: fallbackLeaderboard,
    lastUpdated: new Date().toISOString()
  };
};

export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // First get the current leaderboard to ensure scores match
    const { leaderboard } = await fetchLeaderboardData();
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScores: Record<string, number> = {};
    leaderboard.forEach(golfer => {
      golferScores[golfer.name] = golfer.score;
    });
    
    // Calculate bonus points for top 10 finishers
    const getBonus = (position: number): number => {
      if (position <= 3) return -3; // Extra -3 points (good) for top 3
      if (position <= 10) return -1; // Extra -1 point (good) for positions 4-10
      return 0; // No bonus for positions outside top 10
    };
    
    // Get the player selections
    const selectionsData = await fetchPlayerSelections();
    const poolParticipants: PoolParticipant[] = [];
    
    // Process each participant's picks
    Object.entries(selectionsData).forEach(([name, data]) => {
      // Initialize pickScores object
      const pickScores: Record<string, number> = {};
      
      // Calculate total score
      let totalScore = 0;
      
      // Process each pick
      data.picks.forEach(golferName => {
        // Get current score for this golfer (or 0 if not found)
        const golferScore = golferScores[golferName] !== undefined ? golferScores[golferName] : 0;
        pickScores[golferName] = golferScore;
        
        // Add to total score
        totalScore += golferScore;
        
        // Apply bonus points for top finishers
        const golfer = leaderboard.find(g => g.name === golferName);
        if (golfer) {
          totalScore += getBonus(golfer.position);
        }
      });
      
      // Add this participant to the pool
      poolParticipants.push({
        position: 0, // Will be calculated after sorting
        name: name,
        totalScore: totalScore,
        totalPoints: totalScore, // For compatibility
        paid: Math.random() > 0.1, // 90% chance of being paid
        picks: data.picks,
        pickScores: pickScores
      });
    });
    
    // Sort by total score (lowest/best score first, golf scoring)
    poolParticipants.sort((a, b) => a.totalScore - b.totalScore);
    
    // Update positions based on the sorted order
    poolParticipants.forEach((participant, index) => {
      participant.position = index + 1;
    });
    
    return poolParticipants;
  } catch (error) {
    console.error('Error fetching pool standings:', error);
    return [];
  }
};

export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return the actual team data
    return {
      "Ben Applebaum": {
        picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
        roundScores: [-7, -4, -1, -3, +13],
        tiebreakers: [273, 68]
      },
      "Elia Ayaz": {
        picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"],
        roundScores: [0, -5, +5, +16, +11],
        tiebreakers: [275, 70]
      },
      "Mike Baker": {
        picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"],
        roundScores: [-7, -10, +12, +7, +11],
        tiebreakers: [278, 71]
      },
      "Louis Baker": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"],
        roundScores: [-10, -8, -1, +11, +10],
        tiebreakers: [276, 69]
      },
      "Ross Baker": {
        picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"],
        roundScores: [0, -7, -2, +1, +7],
        tiebreakers: [277, 70]
      },
      "Peter Bassett": {
        picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"],
        roundScores: [+11, -5, +12, +18, -7],
        tiebreakers: [274, 68]
      },
      "Ted Beckman": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"],
        roundScores: [-10, -5, +15, +15, +16],
        tiebreakers: [279, 71]
      },
      "Hilary Beckman": {
        picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"],
        roundScores: [-7, -8, +1, +12, +9],
        tiebreakers: [276, 69]
      },
      "Oliver Beckman": {
        picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"],
        roundScores: [-7, 0, +10, +1, +14],
        tiebreakers: [280, 72]
      },
      "Jimmy Beltz": {
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        roundScores: [-10, -7, +6, +5, +10],
        tiebreakers: [275, 69]
      },
      "Peter Beugg": {
        picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"],
        roundScores: [+8, +4, -7, 0, -3],
        tiebreakers: [277, 70]
      },
      "James Carlson": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"],
        roundScores: [-10, -5, -3, +6, -1],
        tiebreakers: [278, 71]
      }
    };
  } catch (error) {
    console.error('Error fetching player selections:', error);
    return {};
  }
};

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
    return false;
  }
};
