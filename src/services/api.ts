
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
        { position: 1, name: "Scottie Scheffler", score: -4, today: -4, thru: "F" },
        { position: 2, name: "Bryson DeChambeau", score: -2, today: -2, thru: "F" },
        { position: 2, name: "Ludvig Åberg", score: -2, today: -2, thru: "F" },
        { position: 2, name: "Rory McIlroy", score: -4, today: -4, thru: "F" },
        { position: 5, name: "Shane Lowry", score: -1, today: -1, thru: "F" },
        { position: 5, name: "Min Woo Lee", score: -1, today: -1, thru: "F" },
        { position: 5, name: "Cameron Smith", score: -1, today: -1, thru: "F" },
        { position: 5, name: "Tyrrell Hatton", score: -3, today: -3, thru: "F" },
        { position: 5, name: "Justin Rose", score: -7, today: -7, thru: "F" },
        { position: 5, name: "Denny McCarthy", score: -1, today: -1, thru: "F" },
        { position: 11, name: "Corey Conners", score: -4, today: -4, thru: "F" },
        { position: 12, name: "Patrick Reed", score: -1, today: -1, thru: "F" },
        { position: 13, name: "Jason Day", score: -2, today: -2, thru: "F" },
        { position: 14, name: "Collin Morikawa", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Sergio Garcia", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Joaquín Niemann", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Viktor Hovland", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Tom Hoge", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Akshay Bhatia", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Cameron Young", score: 0, today: 0, thru: "F" },
        { position: 14, name: "Zach Johnson", score: 0, today: 0, thru: "F" },
        { position: 22, name: "Brooks Koepka", score: 1, today: 1, thru: "F" },
        { position: 22, name: "Tommy Fleetwood", score: 1, today: 1, thru: "F" },
        { position: 22, name: "Justin Thomas", score: 1, today: 1, thru: "F" },
        { position: 22, name: "Jordan Spieth", score: 1, today: 1, thru: "F" },
        { position: 22, name: "Tom Kim", score: 1, today: 1, thru: "F" },
        { position: 27, name: "Xander Schauffele", score: 2, today: 2, thru: "F" },
        { position: 27, name: "Patrick Cantlay", score: 2, today: 2, thru: "F" },
        { position: 27, name: "Will Zalatoris", score: 2, today: 2, thru: "F" },
        { position: 27, name: "Wyndham Clark", score: 2, today: 2, thru: "F" },
        { position: 27, name: "Keegan Bradley", score: 2, today: 2, thru: "F" },
        { position: 27, name: "Dustin Johnson", score: 2, today: 2, thru: "F" },
        { position: 27, name: "J.J. Spaun", score: 2, today: 2, thru: "F" },
        { position: 34, name: "Jon Rahm", score: 3, today: 3, thru: "F" },
        { position: 34, name: "Tony Finau", score: 3, today: 3, thru: "F" },
        { position: 34, name: "Robert MacIntyre", score: 3, today: 3, thru: "F" },
        { position: 34, name: "Danny Willett", score: 3, today: 3, thru: "F" },
        { position: 34, name: "Chris Kirk", score: 3, today: 3, thru: "F" },
        { position: 39, name: "Russell Henley", score: 4, today: 4, thru: "F" },
        { position: 39, name: "Phil Mickelson", score: 3, today: 3, thru: "F" },
        { position: 41, name: "Sepp Straka", score: 5, today: 5, thru: "F" },
        { position: 41, name: "Billy Horschel", score: 5, today: 5, thru: "F" },
        { position: 43, name: "Matthieu Pavon", score: 6, today: 6, thru: "F" },
        { position: 44, name: "Nick Dunlap", score: 18, today: 18, thru: "F" },
        { position: 45, name: "Jose Luis Ballester", score: 4, today: 4, thru: "F" },
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
    // For demo, we'll return the real data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { 
        position: 1, 
        name: "Ben Applebaum", 
        totalPoints: -2,
        picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
        pickScores: { 
          "Rory McIlroy": -4, 
          "Xander Schauffele": 2, 
          "Shane Lowry": -1, 
          "Tommy Fleetwood": 1,
          "Robert MacIntyre": 3
        },
        roundScores: {
          round1: -2
        },
        tiebreaker1: -12,
        tiebreaker2: 0
      },
      { 
        position: 2, 
        name: "Jimmy Beltz", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -4, 
          "Hideki Matsuyama": 1, 
          "Cameron Smith": -1,
          "Min Woo Lee": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -11,
        tiebreaker2: 1
      },
      { 
        position: 3, 
        name: "Charlotte Ramalingam", 
        totalPoints: -14,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -4, 
          "Jordan Spieth": 1, 
          "Justin Thomas": 1,
          "Justin Rose": -7
        },
        roundScores: {
          round1: -14
        },
        tiebreaker1: -11,
        tiebreaker2: 0
      },
      { 
        position: 4, 
        name: "Kyle Flippen", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -4, 
          "Min Woo Lee": -1, 
          "Jordan Spieth": 1,
          "Brian Harman": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -16,
        tiebreaker2: -1
      },
      { 
        position: 5, 
        name: "Chris Crawford", 
        totalPoints: -12,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -4, 
          "Justin Thomas": 1, 
          "Cameron Smith": -1,
          "Tyrrell Hatton": -3
        },
        roundScores: {
          round1: -12
        },
        tiebreaker1: -11,
        tiebreaker2: 2
      },
      { 
        position: 6, 
        name: "Nash Nibbe", 
        totalPoints: -10,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"],
        pickScores: { 
          "Rory McIlroy": -4, 
          "Scottie Scheffler": -4, 
          "Min Woo Lee": -1, 
          "Shane Lowry": -1,
          "Viktor Hovland": 0
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -14,
        tiebreaker2: 3
      },
      { 
        position: 7, 
        name: "Stuie Snyder", 
        totalPoints: -10,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"],
        pickScores: { 
          "Rory McIlroy": -4, 
          "Scottie Scheffler": -4, 
          "Cameron Smith": -1, 
          "Justin Thomas": 1,
          "Denny McCarthy": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -13,
        tiebreaker2: 3
      },
      { 
        position: 8, 
        name: "Avery Sturgis", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -4, 
          "Hideki Matsuyama": 1, 
          "Sergio Garcia": 0,
          "Jason Day": -2
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -12,
        tiebreaker2: 1
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
    
    // This now uses real data from the dataset
    return {
      "Ben Applebaum": ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
      "Elia Ayaz": ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"],
      "Mike Baker": ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"],
      "Louis Baker": ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"],
      "Ross Baker": ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"],
      "Peter Bassett": ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"],
      "Ted Beckman": ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"],
      "Hilary Beckman": ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"],
      "Oliver Beckman": ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"],
      "Jimmy Beltz": ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
      "Peter Beugg": ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"],
      "James Carlson": ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"],
      "Nate Carlson": ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"],
      "Annie Carlson": ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
      "Hadley Carlson": ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"]
    };
  } catch (error) {
    console.error("Error fetching player selections:", error);
    throw new Error("Failed to fetch player selections");
  }
};
