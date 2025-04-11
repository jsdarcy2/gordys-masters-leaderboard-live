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
    { position: 3, name: "Max Homa", score: -7, today: -2, thru: "F", status: "active" },
    { position: 4, name: "Ludvig Åberg", score: -6, today: -2, thru: "F", status: "active" },
    { position: 5, name: "Bryson DeChambeau", score: -5, today: -1, thru: "F", status: "active" },
    { position: 6, name: "Xander Schauffele", score: -4, today: -1, thru: "F", status: "active" },
    { position: 7, name: "Tommy Fleetwood", score: -3, today: -1, thru: "F", status: "active" },
    { position: 8, name: "Brooks Koepka", score: -2, today: 0, thru: "F", status: "active" },
    { position: 9, name: "Rory McIlroy", score: -1, today: +1, thru: "F", status: "active" },
    { position: 10, name: "Jon Rahm", score: 0, today: +2, thru: "F", status: "active" },
    { position: 11, name: "Justin Thomas", score: +1, today: +1, thru: "F", status: "active" },
    { position: 12, name: "Jordan Spieth", score: +2, today: +2, thru: "F", status: "active" },
    { position: 13, name: "Patrick Cantlay", score: +3, today: +3, thru: "F", status: "active" },
    { position: 14, name: "Dustin Johnson", score: +4, today: +2, thru: "F", status: "active" },
    { position: 15, name: "Tiger Woods", score: +5, today: +3, thru: "F", status: "active" },
    { position: 16, name: "Hideki Matsuyama", score: +6, today: +4, thru: "F", status: "active" },
    { position: 17, name: "Cameron Smith", score: +7, today: +5, thru: "F", status: "active" },
    { position: 18, name: "Viktor Hovland", score: +8, today: +6, thru: "F", status: "active" },
    { position: 19, name: "Shane Lowry", score: +9, today: +7, thru: "F", status: "active" },
    { position: 20, name: "Phil Mickelson", score: +10, today: +8, thru: "F", status: "active" },
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
    
    // Generate 134 pool participants with random names and picks
    const poolParticipants: PoolParticipant[] = [];
    
    // Include the original 10 participants first
    const originalParticipants = [
      { 
        name: "John Smith", 
        paid: true, 
        picks: ["Scottie Scheffler", "Collin Morikawa", "Max Homa", "Xander Schauffele"]
      },
      { 
        name: "Emily Johnson", 
        paid: true, 
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Rory McIlroy", "Tommy Fleetwood"]
      },
      { 
        name: "Mike Williams", 
        paid: true, 
        picks: ["Collin Morikawa", "Brooks Koepka", "Dustin Johnson", "Tiger Woods"]
      },
      { 
        name: "Sarah Davis", 
        paid: true, 
        picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Patrick Cantlay"]
      },
      { 
        name: "Robert Jones", 
        paid: true, 
        picks: ["Max Homa", "Bryson DeChambeau", "Rory McIlroy", "Brooks Koepka"]
      },
      { 
        name: "Jessica Brown", 
        paid: false, 
        picks: ["Collin Morikawa", "Ludvig Åberg", "Tommy Fleetwood", "Jon Rahm"]
      },
      { 
        name: "David Miller", 
        paid: true, 
        picks: ["Scottie Scheffler", "Xander Schauffele", "Jon Rahm", "Jordan Spieth"]
      },
      { 
        name: "Lisa Wilson", 
        paid: true, 
        picks: ["Max Homa", "Xander Schauffele", "Tommy Fleetwood", "Rory McIlroy"]
      },
      { 
        name: "Kevin Taylor", 
        paid: true, 
        picks: ["Bryson DeChambeau", "Brooks Koepka", "Jon Rahm", "Dustin Johnson"]
      },
      { 
        name: "Jennifer Anderson", 
        paid: false, 
        picks: ["Ludvig Åberg", "Xander Schauffele", "Rory McIlroy", "Justin Thomas"]
      }
    ];
    
    // Add the original participants
    for (const participant of originalParticipants) {
      // Initialize pickScores object
      const pickScores: Record<string, number> = {};
      
      // Calculate total score
      let totalScore = 0;
      
      // Process each pick
      participant.picks.forEach(golferName => {
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
        name: participant.name,
        totalScore: totalScore,
        totalPoints: totalScore, // For compatibility
        paid: participant.paid,
        picks: participant.picks,
        pickScores: pickScores
      });
    }
    
    // Generate additional random participants to reach 134
    const firstNames = ["Alex", "Taylor", "Jordan", "Casey", "Morgan", "Jamie", "Pat", "Riley", "Avery", "Cameron"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", 
                      "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Clark"];
    
    const availableGolfers = leaderboard.map(g => g.name);
    
    // Generate additional 124 participants (to make 134 total)
    for (let i = 0; i < 124; i++) {
      // Generate a random name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}-${i+1}`;
      
      // Select 4 random golfers as picks
      const picks: string[] = [];
      while (picks.length < 4) {
        const randomIndex = Math.floor(Math.random() * availableGolfers.length);
        const golfer = availableGolfers[randomIndex];
        if (!picks.includes(golfer)) {
          picks.push(golfer);
        }
      }
      
      // Initialize pickScores object
      const pickScores: Record<string, number> = {};
      
      // Calculate total score
      let totalScore = 0;
      
      // Process each pick
      picks.forEach(golferName => {
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
        picks: picks,
        pickScores: pickScores
      });
    }
    
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
    
    // Return mock data with each participant having 4 golfers (as per the rules)
    return {
      "John Smith": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Max Homa", "Xander Schauffele"],
        roundScores: [-4, -2, -1, -2],
        tiebreakers: [273, 68]
      },
      "Emily Johnson": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Rory McIlroy", "Tommy Fleetwood"],
        roundScores: [-4, -2, +1, -2],
        tiebreakers: [275, 70]
      },
      "Mike Williams": {
        picks: ["Collin Morikawa", "Brooks Koepka", "Dustin Johnson", "Tiger Woods"],
        roundScores: [-3, -1, +2, +3],
        tiebreakers: [278, 71]
      },
      "Sarah Davis": {
        picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Patrick Cantlay"],
        roundScores: [-4, -3, +1, +2],
        tiebreakers: [276, 69]
      },
      "Robert Jones": {
        picks: ["Max Homa", "Bryson DeChambeau", "Rory McIlroy", "Brooks Koepka"],
        roundScores: [-2, -2, +1, -1],
        tiebreakers: [277, 70]
      },
      "Jessica Brown": {
        picks: ["Collin Morikawa", "Ludvig Åberg", "Tommy Fleetwood", "Jon Rahm"],
        roundScores: [-3, -3, -2, +2],
        tiebreakers: [274, 68]
      },
      "David Miller": {
        picks: ["Scottie Scheffler", "Xander Schauffele", "Jon Rahm", "Jordan Spieth"],
        roundScores: [-4, -2, +2, +2],
        tiebreakers: [279, 71]
      },
      "Lisa Wilson": {
        picks: ["Max Homa", "Xander Schauffele", "Tommy Fleetwood", "Rory McIlroy"],
        roundScores: [-2, -2, -2, +1],
        tiebreakers: [276, 69]
      },
      "Kevin Taylor": {
        picks: ["Bryson DeChambeau", "Brooks Koepka", "Jon Rahm", "Dustin Johnson"],
        roundScores: [-2, -1, +2, +2],
        tiebreakers: [280, 72]
      },
      "Jennifer Anderson": {
        picks: ["Ludvig Åberg", "Xander Schauffele", "Rory McIlroy", "Justin Thomas"],
        roundScores: [-3, -2, +1, +1],
        tiebreakers: [275, 69]
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
