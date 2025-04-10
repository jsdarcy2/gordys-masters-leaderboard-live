
import { GolferScore, PoolParticipant, TournamentData } from "@/types";

// In a full implementation, you would fetch from an actual API
// For now, we'll simulate data based on Masters API format
export const fetchLeaderboardData = async (): Promise<TournamentData> => {
  try {
    // In production, replace with actual API endpoint
    // For demo, we'll return mock data to show the structure
    // const response = await fetch('https://api.masters.com/leaderboard');
    // const data = await response.json();
    
    // Simulated delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      lastUpdated: new Date().toISOString(),
      currentRound: 1,
      leaderboard: [
        { position: 1, name: "Scottie Scheffler", score: -7, today: -5, thru: "F" },
        { position: 2, name: "Bryson DeChambeau", score: -6, today: -3, thru: "F" },
        { position: 3, name: "Xander Schauffele", score: -5, today: -4, thru: "F" },
        { position: 4, name: "Collin Morikawa", score: -4, today: -2, thru: "F" },
        { position: 5, name: "Brooks Koepka", score: -3, today: -1, thru: "F" },
        { position: 5, name: "Ludvig Åberg", score: -3, today: -3, thru: "F" },
        { position: 7, name: "Tommy Fleetwood", score: -2, today: -2, thru: "F" },
        { position: 7, name: "Max Homa", score: -2, today: -1, thru: "F" },
        { position: 9, name: "Patrick Cantlay", score: -1, today: -1, thru: "F" },
        { position: 9, name: "Rory McIlroy", score: -1, today: 0, thru: "F" },
        { position: 11, name: "Jon Rahm", score: 0, today: 2, thru: "F" },
        { position: 12, name: "Tiger Woods", score: 1, today: 1, thru: "F" },
        { position: 13, name: "Justin Thomas", score: 2, today: -1, thru: "F" },
        { position: 14, name: "Jordan Spieth", score: 3, today: 3, thru: "F" },
        { position: 15, name: "Viktor Hovland", score: 4, today: 2, thru: "F" },
      ]
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
};

export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // In production, replace with actual API endpoint
    // For demo, we'll return mock data to show the structure
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { 
        name: "John Smith", 
        position: 1, 
        totalPoints: 125, 
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Collin Morikawa", "Tommy Fleetwood"],
        pickScores: { 
          "Scottie Scheffler": -7, 
          "Bryson DeChambeau": -6, 
          "Collin Morikawa": -4, 
          "Tommy Fleetwood": -2
        }
      },
      { 
        name: "Mike Johnson", 
        position: 2, 
        totalPoints: 118, 
        picks: ["Bryson DeChambeau", "Xander Schauffele", "Brooks Koepka", "Max Homa"],
        pickScores: { 
          "Bryson DeChambeau": -6, 
          "Xander Schauffele": -5, 
          "Brooks Koepka": -3, 
          "Max Homa": -2
        }
      },
      { 
        name: "Sarah Williams", 
        position: 3, 
        totalPoints: 110, 
        picks: ["Scottie Scheffler", "Ludvig Åberg", "Rory McIlroy", "Jordan Spieth"],
        pickScores: { 
          "Scottie Scheffler": -7, 
          "Ludvig Åberg": -3, 
          "Rory McIlroy": -1, 
          "Jordan Spieth": 3
        }
      },
      { 
        name: "Tom Davis", 
        position: 4, 
        totalPoints: 105, 
        picks: ["Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
        pickScores: { 
          "Xander Schauffele": -5, 
          "Brooks Koepka": -3, 
          "Patrick Cantlay": -1, 
          "Justin Thomas": 2
        }
      },
      { 
        name: "Jessica Brown", 
        position: 5, 
        totalPoints: 98, 
        picks: ["Collin Morikawa", "Max Homa", "Tiger Woods", "Viktor Hovland"],
        pickScores: { 
          "Collin Morikawa": -4, 
          "Max Homa": -2, 
          "Tiger Woods": 1, 
          "Viktor Hovland": 4
        }
      },
    ];
  } catch (error) {
    console.error("Error fetching pool standings:", error);
    throw new Error("Failed to fetch pool standings");
  }
};

export const fetchPlayerSelections = async (): Promise<{[participant: string]: string[]}> => {
  try {
    // In production, replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      "John Smith": ["Scottie Scheffler", "Bryson DeChambeau", "Collin Morikawa", "Tommy Fleetwood"],
      "Mike Johnson": ["Bryson DeChambeau", "Xander Schauffele", "Brooks Koepka", "Max Homa"],
      "Sarah Williams": ["Scottie Scheffler", "Ludvig Åberg", "Rory McIlroy", "Jordan Spieth"],
      "Tom Davis": ["Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
      "Jessica Brown": ["Collin Morikawa", "Max Homa", "Tiger Woods", "Viktor Hovland"],
      "David Wilson": ["Jon Rahm", "Rory McIlroy", "Jordan Spieth", "Tiger Woods"],
      "Emily Clark": ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Justin Thomas"],
      "Ryan Murphy": ["Bryson DeChambeau", "Brooks Koepka", "Tommy Fleetwood", "Jordan Spieth"],
      "Laura White": ["Xander Schauffele", "Ludvig Åberg", "Max Homa", "Viktor Hovland"],
      "Kevin Martin": ["Scottie Scheffler", "Jon Rahm", "Rory McIlroy", "Tiger Woods"]
    };
  } catch (error) {
    console.error("Error fetching player selections:", error);
    throw new Error("Failed to fetch player selections");
  }
};
