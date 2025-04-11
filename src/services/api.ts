// Keep any existing imports at the top
import { GolferScore, PoolParticipant } from "@/types";

export const fetchLeaderboardData = async (apiKey: string | null = null) => {
  try {
    // Get current tournament info
    const tournament = await getCurrentTournament();
    
    if (!tournament || !tournament.tournId) {
      console.warn('No tournament ID available. Falling back to fallback data.');
      return getFallbackData();
    }
    
    const url = `https://live-golf-data.p.rapidapi.com/leaderboard?tournId=${tournament.tournId}`;
    
    // Set headers with the provided API key or fallback to sample data
    const headers: HeadersInit = {
      'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com',
    };
    
    // Add the API key if it's provided
    if (apiKey) {
      headers['X-RapidAPI-Key'] = apiKey;
    } else {
      console.warn('No API key provided. Using sample data.');
      return getFallbackData();
    }
    
    const response = await fetch(url, { 
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      console.error('API returned an error:', response.status);
      return getFallbackData();
    }
    
    const data = await response.json();
    
    // Process the leaderboard data
    const leaderboard = data.leaderboard.map((player: any) => ({
      position: player.position,
      name: `${player.firstName} ${player.lastName}`,
      score: player.total,
      today: player.today,
      thru: player.thru === 'F' ? 'F' : player.thru,
      status: player.status || 'active'
    }));
    
    return {
      leaderboard,
      lastUpdated: new Date().toISOString()
    };
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

// Update the fetchPoolStandings function to correctly calculate scores based on the rules
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
    
    // Build pool participants with updated scoring logic based on the rules
    const poolParticipants: PoolParticipant[] = [
      { 
        position: 1, 
        name: "John Smith", 
        totalScore: 0,  // Will be calculated
        totalPoints: 0, // Will be calculated 
        paid: true, 
        picks: ["Scottie Scheffler", "Collin Morikawa", "Max Homa", "Xander Schauffele"], 
        pickScores: {"Scottie Scheffler": -10, "Collin Morikawa": -8, "Max Homa": -7, "Xander Schauffele": -4} 
      },
      { 
        position: 2, 
        name: "Emily Johnson", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Rory McIlroy", "Tommy Fleetwood"], 
        pickScores: {"Scottie Scheffler": -10, "Bryson DeChambeau": -5, "Rory McIlroy": -1, "Tommy Fleetwood": -3}
      },
      { 
        position: 3, 
        name: "Mike Williams", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Collin Morikawa", "Brooks Koepka", "Dustin Johnson", "Tiger Woods"], 
        pickScores: {"Collin Morikawa": -8, "Brooks Koepka": -2, "Dustin Johnson": +4, "Tiger Woods": +5}
      },
      { 
        position: 4, 
        name: "Sarah Davis", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Patrick Cantlay"], 
        pickScores: {"Scottie Scheffler": -10, "Ludvig Åberg": -6, "Justin Thomas": +1, "Patrick Cantlay": +3}
      },
      { 
        position: 5, 
        name: "Robert Jones", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Max Homa", "Bryson DeChambeau", "Rory McIlroy", "Brooks Koepka"], 
        pickScores: {"Max Homa": -7, "Bryson DeChambeau": -5, "Rory McIlroy": -1, "Brooks Koepka": -2}
      },
      { 
        position: 6, 
        name: "Jessica Brown", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: false, 
        picks: ["Collin Morikawa", "Ludvig Åberg", "Tommy Fleetwood", "Jon Rahm"], 
        pickScores: {"Collin Morikawa": -8, "Ludvig Åberg": -6, "Tommy Fleetwood": -3, "Jon Rahm": 0}
      },
      { 
        position: 7, 
        name: "David Miller", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Scottie Scheffler", "Xander Schauffele", "Jon Rahm", "Jordan Spieth"], 
        pickScores: {"Scottie Scheffler": -10, "Xander Schauffele": -4, "Jon Rahm": 0, "Jordan Spieth": +2}
      },
      { 
        position: 8, 
        name: "Lisa Wilson", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Max Homa", "Xander Schauffele", "Tommy Fleetwood", "Rory McIlroy"], 
        pickScores: {"Max Homa": -7, "Xander Schauffele": -4, "Tommy Fleetwood": -3, "Rory McIlroy": -1}
      },
      { 
        position: 9, 
        name: "Kevin Taylor", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: true, 
        picks: ["Bryson DeChambeau", "Brooks Koepka", "Jon Rahm", "Dustin Johnson"], 
        pickScores: {"Bryson DeChambeau": -5, "Brooks Koepka": -2, "Jon Rahm": 0, "Dustin Johnson": +4}
      },
      { 
        position: 10, 
        name: "Jennifer Anderson", 
        totalScore: 0, 
        totalPoints: 0, 
        paid: false, 
        picks: ["Ludvig Åberg", "Xander Schauffele", "Rory McIlroy", "Justin Thomas"], 
        pickScores: {"Ludvig Åberg": -6, "Xander Schauffele": -4, "Rory McIlroy": -1, "Justin Thomas": +1}
      }
    ];
    
    // Update the pickScores and calculate totalScore for each participant
    poolParticipants.forEach(participant => {
      let totalScore = 0;
      
      // Update each pick's score to match the current leaderboard
      participant.picks.forEach(golferName => {
        if (golferScores[golferName] !== undefined) {
          participant.pickScores[golferName] = golferScores[golferName];
        }
        
        // Add the golfer's score to the total
        totalScore += participant.pickScores[golferName];
        
        // Apply bonus points for top finishers
        const golfer = leaderboard.find(g => g.name === golferName);
        if (golfer) {
          totalScore += getBonus(golfer.position);
        }
      });
      
      // Update the totalScore and totalPoints
      participant.totalScore = totalScore;
      participant.totalPoints = totalScore; // Keep totalPoints same as totalScore for consistency
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

// Keep the fetchPlayerSelections function with updated data to match the 4-golfer rule
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

// Keep the isTournamentInProgress function unchanged
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
