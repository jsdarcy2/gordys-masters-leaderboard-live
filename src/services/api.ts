import { GolferScore, PoolParticipant, TournamentData } from "@/types";

// Function to fetch leaderboard data from Masters API or GitHub alternative
export const fetchLeaderboardData = async (): Promise<TournamentData> => {
  try {
    // First try the GitHub alternative API
    const response = await fetch('https://raw.githubusercontent.com/loisaidasam/the-masters-api/master/data/leaderboard.json');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our application's structure
    const transformedData: TournamentData = {
      lastUpdated: new Date().toISOString(),
      currentRound: determineCurrentRound(data),
      leaderboard: transformLeaderboardData(data)
    };
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    
    // Fallback to our mock data if API fails
    console.warn("Falling back to mock data due to API error");
    return getFallbackLeaderboardData();
  }
};

// Helper function to transform API data to our app format
const transformLeaderboardData = (apiData: any): GolferScore[] => {
  try {
    // Handle different API response formats
    const players = apiData.players || apiData.data || apiData.leaderboard || apiData;
    
    return players.map((player: any) => {
      // Extract player data based on available fields
      // The GitHub API has different field names than our app
      return {
        position: player.position || player.pos || player.place || parseInt(player.pos_num || '0'),
        name: player.name || player.player_name || player.player_bio?.first_name + ' ' + player.player_bio?.last_name || player.player_bio?.name || '',
        score: calculateScore(player),
        today: calculateTodayScore(player),
        thru: player.thru || player.thru_num || player.today_round?.thru || 'F',
        status: determineStatus(player)
      };
    }).filter((player: any) => player.name); // Filter out entries without names
  } catch (err) {
    console.error("Error transforming leaderboard data:", err);
    return [];
  }
};

// Helper function to calculate total score
const calculateScore = (player: any): number => {
  // Handle different score formats from APIs
  if (typeof player.total_to_par !== 'undefined') return player.total_to_par;
  if (typeof player.score !== 'undefined') return parseInt(player.score);
  if (typeof player.topar !== 'undefined') return parseInt(player.topar);
  
  // If no direct score is available, try to calculate it
  return 0; // Default to 0 if we can't determine
};

// Helper function to calculate today's score
const calculateTodayScore = (player: any): number => {
  // Handle different formats for today's score
  if (typeof player.today !== 'undefined') return player.today;
  if (player.today_round?.strokes_to_par) return player.today_round.strokes_to_par;
  if (typeof player.round_score !== 'undefined') return parseInt(player.round_score);
  
  return 0; // Default to 0 if we can't determine
};

// Helper function to determine player status
const determineStatus = (player: any): 'cut' | 'active' | 'withdrawn' | undefined => {
  const status = player.status || player.player_status;
  if (!status) return 'active';
  
  if (status.toLowerCase().includes('cut')) return 'cut';
  if (status.toLowerCase().includes('wd')) return 'withdrawn';
  
  return 'active';
};

// Helper function to determine current round
const determineCurrentRound = (data: any): 1 | 2 | 3 | 4 => {
  // Try to extract current round from API data
  const round = data.current_round || data.round || 1;
  
  // Ensure we return a valid round number (1-4)
  if (round >= 1 && round <= 4) {
    return round as 1 | 2 | 3 | 4;
  }
  
  return 1; // Default to round 1
};

// Fallback data in case API fails
const getFallbackLeaderboardData = (): TournamentData => {
  return {
    lastUpdated: new Date().toISOString(),
    currentRound: 1,
    leaderboard: [
      { position: 1, name: "Scottie Scheffler", score: -4, today: -4, thru: "F" },
      { position: 2, name: "Bryson DeChambeau", score: -3, today: -3, thru: "F" },
      { position: 2, name: "Ludvig Åberg", score: -3, today: -3, thru: "F" },
      { position: 2, name: "Rory McIlroy", score: -2, today: -2, thru: "F" },
      { position: 5, name: "Shane Lowry", score: -1, today: -1, thru: "F" },
      { position: 5, name: "Min Woo Lee", score: -1, today: -1, thru: "F" },
      { position: 5, name: "Cameron Smith", score: -1, today: -1, thru: "F" },
      { position: 5, name: "Tyrrell Hatton", score: -3, today: -3, thru: "F" },
      { position: 5, name: "Justin Rose", score: -7, today: -7, thru: "F" },
      { position: 5, name: "Denny McCarthy", score: -1, today: -1, thru: "F" },
      { position: 5, name: "Corey Conners", score: -4, today: -4, thru: "F" },
      { position: 5, name: "Brian Harman", score: -1, today: -1, thru: "F" },
      { position: 5, name: "Jason Day", score: -2, today: -2, thru: "F" },
      { position: 14, name: "Collin Morikawa", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Sergio Garcia", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Joaquín Niemann", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Viktor Hovland", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Tom Hoge", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Akshay Bhatia", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Cameron Young", score: 0, today: 0, thru: "F" },
      { position: 14, name: "Zach Johnson", score: 0, today: 0, thru: "F" },
      { position: 22, name: "Brooks Koepka", score: 2, today: 2, thru: "F" },
      { position: 22, name: "Tommy Fleetwood", score: 1, today: 1, thru: "F" },
      { position: 22, name: "Justin Thomas", score: 1, today: 1, thru: "F" },
      { position: 22, name: "Jordan Spieth", score: 1, today: 1, thru: "F" },
      { position: 22, name: "Tom Kim", score: 1, today: 1, thru: "F" },
      { position: 27, name: "Xander Schauffele", score: 1, today: 1, thru: "F" },
      { position: 27, name: "Patrick Cantlay", score: 2, today: 2, thru: "F" },
      { position: 27, name: "Will Zalatoris", score: 2, today: 2, thru: "F" },
      { position: 27, name: "Wyndham Clark", score: 3, today: 3, thru: "F" },
      { position: 27, name: "Keegan Bradley", score: 2, today: 2, thru: "F" },
      { position: 27, name: "Dustin Johnson", score: 2, today: 2, thru: "F" },
      { position: 27, name: "J.J. Spaun", score: 2, today: 2, thru: "F" },
      { position: 34, name: "Jon Rahm", score: 3, today: 3, thru: "F" },
      { position: 34, name: "Tony Finau", score: 3, today: 3, thru: "F" },
      { position: 34, name: "Robert MacIntyre", score: 3, today: 3, thru: "F" },
      { position: 34, name: "Danny Willett", score: 3, today: 3, thru: "F" },
      { position: 34, name: "Chris Kirk", score: 3, today: 3, thru: "F" },
      { position: 39, name: "Russell Henley", score: 6, today: 6, thru: "F" },
      { position: 39, name: "Phil Mickelson", score: 3, today: 3, thru: "F" },
      { position: 41, name: "Sepp Straka", score: 6, today: 6, thru: "F" },
      { position: 41, name: "Billy Horschel", score: 5, today: 5, thru: "F" },
      { position: 43, name: "Matthieu Pavon", score: 6, today: 6, thru: "F" },
      { position: 44, name: "Nick Dunlap", score: 18, today: 18, thru: "F" },
      { position: 45, name: "Jose Luis Ballester", score: 4, today: 4, thru: "F" },
      { position: 46, name: "Hideki Matsuyama", score: 1, today: 1, thru: "F" },
      { position: 47, name: "Max Homa", score: 2, today: 2, thru: "F" },
      { position: 48, name: "Matt Fitzpatrick", score: -1, today: -1, thru: "F" },
      { position: 49, name: "Adam Scott", score: 4, today: 4, thru: "F" },
      { position: 50, name: "Brian Harman", score: -1, today: -1, thru: "F" },
      { position: 51, name: "Sahith Theegala", score: 0, today: 0, thru: "F" },
      { position: 52, name: "Sungjae Im", score: 0, today: 0, thru: "F" },
    ]
  };
};

export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // In production, replace with actual API endpoint
    // For demo, we'll return the real data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This now uses real data from the dataset
    return [
      { 
        position: 1, 
        name: "Charlotte Ramalingam", 
        totalPoints: -14,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -2, 
          "Jordan Spieth": 1, 
          "Justin Thomas": 1,
          "Justin Rose": -7
        },
        roundScores: {
          round1: -14
        },
        tiebreaker1: -11,
        tiebreaker2: 0,
        paid: true
      },
      { 
        position: 2, 
        name: "Chris Crawford", 
        totalPoints: -12,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -2, 
          "Justin Thomas": 1, 
          "Cameron Smith": -1,
          "Tyrrell Hatton": -3
        },
        roundScores: {
          round1: -12
        },
        tiebreaker1: -11,
        tiebreaker2: 2,
        paid: true
      },
      { 
        position: 3, 
        name: "Stuie Snyder", 
        totalPoints: -10,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"],
        pickScores: { 
          "Rory McIlroy": -2, 
          "Scottie Scheffler": -4, 
          "Cameron Smith": -1, 
          "Justin Thomas": 1,
          "Denny McCarthy": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -13,
        tiebreaker2: 3,
        paid: true
      },
      { 
        position: 4, 
        name: "Jimmy Beltz", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -2, 
          "Hideki Matsuyama": 1, 
          "Cameron Smith": -1,
          "Min Woo Lee": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -11,
        tiebreaker2: 1,
        paid: true
      },
      { 
        position: 5, 
        name: "Nash Nibbe", 
        totalPoints: -10,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"],
        pickScores: { 
          "Rory McIlroy": -2, 
          "Scottie Scheffler": -4, 
          "Min Woo Lee": -1, 
          "Shane Lowry": -1,
          "Viktor Hovland": 0
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -14,
        tiebreaker2: 3,
        paid: true
      },
      { 
        position: 6, 
        name: "Kyle Flippen", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -2, 
          "Min Woo Lee": -1, 
          "Jordan Spieth": 1,
          "Brian Harman": -1
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -16,
        tiebreaker2: -1,
        paid: true
      },
      { 
        position: 7, 
        name: "Avery Sturgis", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Rory McIlroy": -2, 
          "Hideki Matsuyama": 1, 
          "Sergio Garcia": 0,
          "Jason Day": -2
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -12,
        tiebreaker2: 1,
        paid: true
      },
      { 
        position: 8, 
        name: "Matt Rogers", 
        totalPoints: -10,
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"],
        pickScores: { 
          "Scottie Scheffler": -4, 
          "Bryson DeChambeau": -3, 
          "Shane Lowry": -1, 
          "Jason Day": -2,
          "Dustin Johnson": 2
        },
        roundScores: {
          round1: -10
        },
        tiebreaker1: -9,
        tiebreaker2: 1,
        paid: false
      },
    ];
  } catch (error) {
    console.error("Error fetching pool standings:", error);
    throw new Error("Failed to fetch pool standings");
  }
};

export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    // In production, replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return full dataset with accurate team selections
    return {
      "Ben Applebaum": { 
        picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"],
        roundScores: [-2, 1, -1, 1, 3],
        tiebreakers: [-12, 0] 
      },
      "Elia Ayaz": { 
        picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"],
        roundScores: [3, -3, -1, 0, 0],
        tiebreakers: [-11, 2] 
      },
      "Mike Baker": { 
        picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"],
        roundScores: [-2, -4, 6, 6, 0],
        tiebreakers: [-12, 3] 
      },
      "Louis Baker": { 
        picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"],
        roundScores: [-4, 0, -1, 0, -1],
        tiebreakers: [-12, 3] 
      },
      "Ross Baker": { 
        picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"],
        roundScores: [3, -2, 2, 1, 6],
        tiebreakers: [-14, 1] 
      },
      "Peter Bassett": { 
        picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"],
        roundScores: [0, -3, 6, 0, -2],
        tiebreakers: [-13, 2] 
      },
      "Ted Beckman": { 
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"],
        roundScores: [-4, -3, 2, 3, 0],
        tiebreakers: [-12, 3] 
      },
      "Hilary Beckman": { 
        picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"],
        roundScores: [-2, 0, 1, 6, 2],
        tiebreakers: [-10, 4] 
      },
      "Oliver Beckman": { 
        picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"],
        roundScores: [-2, 3, -1, 1, 3],
        tiebreakers: [-12, 3] 
      },
      "Jimmy Beltz": { 
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        roundScores: [-4, -2, 1, -1, -1],
        tiebreakers: [-11, 1] 
      },
      "Peter Beugg": { 
        picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"],
        roundScores: [4, 2, -2, 3, 1],
        tiebreakers: [-11, 2] 
      },
      "James Carlson": { 
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"],
        roundScores: [-4, -3, 1, 1, -1],
        tiebreakers: [-12, 2] 
      },
      "Nate Carlson": { 
        picks: ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"],
        roundScores: [-4, 0, 1, -1, 1],
        tiebreakers: [-12, 2] 
      },
      "Annie Carlson": { 
        picks: ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"],
        roundScores: [-2, 1, 2, 2, 1],
        tiebreakers: [-12, 2] 
      },
      "Hadley Carlson": { 
        picks: ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"],
        roundScores: [-4, -2, 1, -1, 6],
        tiebreakers: [-12, 2] 
      },
      "Quinn Carlson": { 
        picks: ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"],
        roundScores: [-2, -3, 6, 3, 6],
        tiebreakers: [-12, 2] 
      },
      "Ed Corbett": { 
        picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"],
        roundScores: [-4, -2, -1, 2, 6],
        tiebreakers: [-5, 5] 
      },
      "Chuck Corbett Sr": { 
        picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"],
        roundScores: [-2, -4, 2, 0, 1],
        tiebreakers: [-13, -1] 
      },
      "Chris Crawford": { 
        picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
        roundScores: [-4, -2, 1, -1, -3],
        tiebreakers: [-11, 2] 
      },
      "Justin Darcy": { 
        picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"],
        roundScores: [-2, 0, -1, 3, 6],
        tiebreakers: [-14, 4] 
      }
    };
  } catch (error) {
    console.error("Error fetching player selections:", error);
    throw new Error("Failed to fetch player selections");
  }
};
