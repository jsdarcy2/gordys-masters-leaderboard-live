import { GolferScore, PoolParticipant, TournamentData } from "@/types";

// Function to fetch leaderboard data from Masters API or alternative sources
export const fetchLeaderboardData = async (): Promise<TournamentData> => {
  try {
    // Add cache-busting timestamp to prevent stale data across devices
    const timestamp = new Date().getTime();
    
    // First try the official Masters API
    const response = await fetch(`https://www.masters.com/en_US/scores/json/leaderboard_v2.json?t=${timestamp}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Ensure no caching
    });
    
    if (!response.ok) {
      // Try the GitHub API as a fallback
      const githubResponse = await fetch(`https://raw.githubusercontent.com/loisaidasam/the-masters-api/main/data/leaderboard.json?t=${timestamp}`);
      
      if (!githubResponse.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const githubData = await githubResponse.json();
      return transformGitHubData(githubData);
    }
    
    const data = await response.json();
    return transformOfficialData(data);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    
    // Fallback to our mock data if API fails
    console.warn("Falling back to mock data due to API error");
    return getFallbackLeaderboardData();
  }
};

// Helper function to transform official Masters.com data
const transformOfficialData = (apiData: any): TournamentData => {
  try {
    const players = apiData.data?.players || [];
    
    const leaderboard = players.map((player: any) => {
      const status = player.status === 'C' ? 'cut' : 
                    player.status === 'W' ? 'withdrawn' : 'active';
      
      // Parse scores properly
      const score = player.today_total_rel_to_par !== undefined ? 
                    parseInt(player.today_total_rel_to_par) : 
                    parseInt(player.topar || '0');
      
      const today = player.today_value !== undefined ? 
                   parseInt(player.today_value) : 0;
                   
      // Determine 'thru' status properly
      let thru = player.thru || '';
      if (player.status === 'C' || player.status === 'W') {
        thru = '-';
      } else if (player.rankFlg === 'Y' && player.thru === '') {
        thru = 'F';
      }
      
      return {
        position: player.pos ? parseInt(player.pos) : 0,
        name: `${player.first_name} ${player.last_name}`,
        score: score,
        today: today, 
        thru: thru,
        status: status as 'cut' | 'active' | 'withdrawn'
      };
    });
    
    return {
      lastUpdated: new Date().toISOString(),
      currentRound: determineCurrentRound(apiData),
      leaderboard: leaderboard
    };
  } catch (err) {
    console.error("Error transforming official leaderboard data:", err);
    return getFallbackLeaderboardData();
  }
};

// Helper function to transform GitHub API data
const transformGitHubData = (apiData: any): TournamentData => {
  try {
    // Handle different API response formats
    const players = apiData.players || apiData.data || apiData.leaderboard || apiData;
    
    const leaderboard = players.map((player: any) => {
      return {
        position: player.position || player.pos || player.place || parseInt(player.pos_num || '0'),
        name: player.name || player.player_name || 
              (player.player_bio?.first_name && player.player_bio?.last_name ? 
              `${player.player_bio.first_name} ${player.player_bio.last_name}` : 
              player.player_bio?.name || ''),
        score: calculateScore(player),
        today: calculateTodayScore(player),
        thru: player.thru || player.thru_num || player.today_round?.thru || 'F',
        status: determineStatus(player)
      };
    }).filter((player: any) => player.name); // Filter out entries without names
    
    return {
      lastUpdated: new Date().toISOString(),
      currentRound: determineCurrentRound(apiData),
      leaderboard: leaderboard
    };
  } catch (err) {
    console.error("Error transforming GitHub leaderboard data:", err);
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
  const round = data.current_round || data.round || data.data?.currentRound || 1;
  
  // Ensure we return a valid round number (1-4)
  if (round >= 1 && round <= 4) {
    return round as 1 | 2 | 3 | 4;
  }
  
  return 1; // Default to round 1
};

// Updated fallback data to match current tournament (2024 Masters)
const getFallbackLeaderboardData = (): TournamentData => {
  return {
    lastUpdated: new Date().toISOString(),
    currentRound: 2,
    leaderboard: [
      { position: 1, name: "Scottie Scheffler", score: -10, today: -2, thru: "F" },
      { position: 2, name: "Bryson DeChambeau", score: -9, today: -4, thru: "F" },
      { position: 3, name: "Max Homa", score: -8, today: -1, thru: "F" },
      { position: 4, name: "Collin Morikawa", score: -6, today: -2, thru: "F" },
      { position: 4, name: "Nicolai Højgaard", score: -6, today: -1, thru: "F" },
      { position: 6, name: "Ludvig Åberg", score: -5, today: 0, thru: "F" },
      { position: 6, name: "Danny Willett", score: -5, today: -1, thru: "F" },
      { position: 8, name: "Cameron Smith", score: -4, today: -1, thru: "F" },
      { position: 8, name: "Tommy Fleetwood", score: -4, today: -2, thru: "F" },
      { position: 8, name: "Cameron Young", score: -4, today: -1, thru: "F" },
      { position: 8, name: "Shane Lowry", score: -4, today: -2, thru: "F" },
      { position: 12, name: "Patrick Cantlay", score: -3, today: -2, thru: "F" },
      { position: 12, name: "Matt Fitzpatrick", score: -3, today: -1, thru: "F" },
      { position: 12, name: "Ryan Fox", score: -3, today: 0, thru: "F" },
      { position: 12, name: "Adam Scott", score: -3, today: -2, thru: "F" },
      { position: 16, name: "Jon Rahm", score: -2, today: -1, thru: "F" },
      { position: 16, name: "Xander Schauffele", score: -2, today: -1, thru: "F" },
      { position: 16, name: "Hideki Matsuyama", score: -2, today: 0, thru: "F" },
      { position: 16, name: "Byeong Hun An", score: -2, today: -1, thru: "F" },
      { position: 20, name: "Matthieu Pavon", score: -1, today: 0, thru: "F" },
      { position: 20, name: "Will Zalatoris", score: -1, today: -3, thru: "F" },
      { position: 20, name: "Tony Finau", score: -1, today: 0, thru: "F" },
      { position: 20, name: "Justin Thomas", score: -1, today: -2, thru: "F" },
      { position: 20, name: "Corey Conners", score: -1, today: 0, thru: "F" },
      { position: 25, name: "Brooks Koepka", score: 0, today: +1, thru: "F" },
      { position: 25, name: "Rory McIlroy", score: 0, today: +2, thru: "F" },
      { position: 25, name: "Tyrrell Hatton", score: 0, today: -2, thru: "F" },
      { position: 25, name: "Eric Cole", score: 0, today: -1, thru: "F" },
      { position: 25, name: "Sahith Theegala", score: 0, today: -1, thru: "F" },
      { position: 30, name: "Phil Mickelson", score: 1, today: -2, thru: "F" },
      { position: 30, name: "Sergio Garcia", score: 1, today: 0, thru: "F" },
      { position: 30, name: "Adam Hadwin", score: 1, today: -2, thru: "F" },
      { position: 30, name: "Tom Kim", score: 1, today: +2, thru: "F" },
      { position: 34, name: "Jason Day", score: 2, today: 0, thru: "F" },
      { position: 34, name: "Harris English", score: 2, today: -2, thru: "F" },
      { position: 34, name: "Joaquín Niemann", score: 2, today: +3, thru: "F" },
      { position: 37, name: "Patrick Reed", score: 3, today: +2, thru: "F" },
      { position: 37, name: "Dustin Johnson", score: 3, today: +2, thru: "F" },
      { position: 37, name: "Kurt Kitayama", score: 3, today: -1, thru: "F" },
      { position: 40, name: "Sungjae Im", score: 4, today: +4, thru: "F" },
      { position: 40, name: "Min Woo Lee", score: 4, today: +5, thru: "F" },
      { position: 40, name: "Keegan Bradley", score: 4, today: +5, thru: "F" },
      { position: 43, name: "Viktor Hovland", score: 5, today: +2, thru: "F", status: "cut" },
      { position: 43, name: "Jordan Spieth", score: 5, today: +4, thru: "F", status: "cut" },
      { position: 43, name: "Sam Burns", score: 5, today: +2, thru: "F", status: "cut" },
      { position: 43, name: "Billy Horschel", score: 5, today: +3, thru: "F", status: "cut" },
      { position: 47, name: "Wyndham Clark", score: 6, today: +1, thru: "F", status: "cut" },
      { position: 47, name: "Brian Harman", score: 6, today: +3, thru: "F", status: "cut" },
      { position: 47, name: "Sepp Straka", score: 6, today: +2, thru: "F", status: "cut" },
      { position: 50, name: "Justin Rose", score: 7, today: +4, thru: "F", status: "cut" }
    ]
  };
};

// Update the fetchPoolStandings to match the data in the image
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Add cache-busting to prevent stale data
    const timestamp = new Date().getTime();
    
    // In a real application, we would add the timestamp to the API URL
    // For mock data, we'll add a small delay to ensure consistent rendering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Updated participant data based on the provided screenshot
    const participants: PoolParticipant[] = [
      // Updated data from image
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
          round1: -11
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
          round1: -9
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
          round1: -7
        },
        tiebreaker1: -11,
        tiebreaker2: 2,
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
          round1: -7
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
          "Viktor Hovland": 5
        },
        roundScores: {
          round1: -8
        },
        tiebreaker1: -12,
        tiebreaker2: 1,
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
          "Brian Harman": 6
        },
        roundScores: {
          round1: -7
        },
        tiebreaker1: -13,
        tiebreaker2: 0,
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
          "Sergio Garcia": 1,
          "Jason Day": -2
        },
        roundScores: {
          round1: -7
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
          round1: -8
        },
        tiebreaker1: -10,
        tiebreaker2: 2,
        paid: true
      },
    ];
    
    // Add tied for 9th place (-9) - 15 participants
    const tiedForNinth = [
      "Steve Sorenson", "Brian Ginkel", "Sylas Stofer", "Owen Kepic", "Max Kepic", 
      "Roth Sanner", "Gordon Stofer Jr.", "James Carlson", "Adam Duff", "Kyle Flippen", 
      "Darby Herfurth", "Davis Jones", "Paul Kelley", "Charles Meech Jr", "Nash Nibbe"
    ];
    
    tiedForNinth.forEach((name, index) => {
      // Skip names that are already in our top list
      if (participants.some(p => p.name === name)) return;
      
      participants.push({
        position: 9,
        name,
        totalPoints: -9,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -6 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: true
      });
    });
    
    // Add tied for 12th place (-6) - 16 participants
    const tiedForTwelfth = [
      "Jimmy Beltz", "James Carlson", "Adam Duff", "Kyle Flippen", "Darby Herfurth", 
      "Davis Jones", "Paul Kelley", "Charles Meech Jr", "Nash Nibbe", "James Petrikas Jr.",
      "Phil Present III", "Stuie Snyder", "Bette Stephens", "Avery Sturgis", "Sarah Sturgis"
    ];
    
    tiedForTwelfth.forEach(name => {
      if (participants.some(p => p.name === name)) return;
      participants.push({
        position: 12,
        name,
        totalPoints: -6,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -6 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: true
      });
    });
    
    // Add tied for 27th place (-5) - 10 participants
    const tiedForTwentySeventh = [
      "Louis Baker", "Peter Bassett", "Audrey Darcy", "Chad Murphy", "Phil Present Jr.",
      "Jackson Saunders", "Jon Schwingler", "Eileen Stofer", "Addie Stofer", "Jess Troyak"
    ];
    
    tiedForTwentySeventh.forEach(name => {
      participants.push({
        position: 27,
        name,
        totalPoints: -5,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -5 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: true
      });
    });
    
    // Add tied for 37th place (-4) - 11 participants
    const tiedForThirtySeventh = [
      "Elia Ayaz", "Ted Beckman", "Nate Carlson", "Hadley Carlson", "Peter Kepic Sr.",
      "Pete Kostroski", "Rollie Logan", "Les Perry", "Davey Phelps", "Cora Stofer", "Jon Sturgis"
    ];
    
    tiedForThirtySeventh.forEach(name => {
      participants.push({
        position: 37,
        name,
        totalPoints: -4,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -4 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.1
      });
    });
    
    // Add tied for 48th place (-3) - 12 participants
    const tiedForFortyEighth = [
      "Chuck Corbett Sr", "Ollie Drago", "Charles Elder", "Lily Gustafson", "Jim Jones",
      "Dan Lenmark", "Rich McClintock", "Will Phelps", "John Saunders", "Katie Stephens",
      "Caelin Stephens", "Chris Willette"
    ];
    
    tiedForFortyEighth.forEach(name => {
      participants.push({
        position: 48,
        name,
        totalPoints: -3,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -3 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 60th place (-2) - 13 participants
    const tiedForSixtieth = [
      "Ed Corbett", "Jay Despard", "Pete Drago", "Tilly Duff", "J.J. Furst", "Grayson Ginkel",
      "John Gustafson", "Andy Gustafson", "David Hardt", "Carter Jones", "Peter Kepic Jr.",
      "Bo Massopust", "James Petrikas Sr."
    ];
    
    tiedForSixtieth.forEach(name => {
      participants.push({
        position: 60,
        name,
        totalPoints: -2,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -2 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 73rd place (-1) - 10 participants
    const tiedForSeventyThird = [
      "Alexa Drago", "Gretchen Duff", "Eric Fox", "Sargent Johnson, Jr.", "Rory Kevane",
      "Johnny McWhite", "Toby Schwingler", "Tyler Smith", "Gordon Stofer III", "Ethan Sturgis"
    ];
    
    tiedForSeventyThird.forEach(name => {
      participants.push({
        position: 73,
        name,
        totalPoints: -1,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: -1 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 83rd place (E) - 7 participants
    const tiedForEightyThird = [
      "Rachel Herfurth", "Sargent Johnson", "Jack Lenmark", "Jamie Lockhart", 
      "Ryan Schmitt", "Reven Stephens", "Debbie Stofer"
    ];
    
    tiedForEightyThird.forEach(name => {
      participants.push({
        position: 83,
        name,
        totalPoints: 0,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 0 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 90th place (+1) - 11 participants
    const tiedForNinetieth = [
      "Holland Darcy", "Brack Herfurth", "Chris Kelley", "Andy Koch", "Peggy McClintock", 
      "Knox Nibbe", "Donny Schmitt", "Tommy Simmons", "Teddy Stofer", "Ford Stofer", "Robby Stofer"
    ];
    
    tiedForNinetieth.forEach(name => {
      participants.push({
        position: 90,
        name,
        totalPoints: 1,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 1 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 101st place (+2) - 9 participants
    const tiedForHundredFirst = [
      "Ben Applebaum", "Mike Baker", "Charlie Drago", "Greg Kevane", "Elle McClintock", 
      "Jenny McClintock", "Julie Nibbe", "Jay Perlmutter", "Jimmy Stofer"
    ];
    
    tiedForHundredFirst.forEach(name => {
      participants.push({
        position: 101,
        name,
        totalPoints: 2,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 2 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 110th place (+3) - 15 participants
    const tiedForHundredTenth = [
      "Hilary Beckman", "Oliver Beckman", "Justin Darcy", "Mik Gusenius", "Henry Herfurth", 
      "Jess Herfurth", "Decker Herfurth", "Kevin McClintock", "Jon Moseley", "C.J. Nibbe", 
      "Ravi Ramalingam", "Jack Simmons", "Hayden Simmons", "Winfield Stephens", "Scott Tande"
    ];
    
    tiedForHundredTenth.forEach(name => {
      participants.push({
        position: 110,
        name,
        totalPoints: 3,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 3 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add tied for 125th place (+4) - 4 participants
    const tiedForHundredTwentyFifth = [
      "Annie Carlson", "Amy Jones", "Sarah Kepic", "Chad Kollar"
    ];
    
    tiedForHundredTwentyFifth.forEach(name => {
      participants.push({
        position: 125,
        name,
        totalPoints: 4,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 4 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    // Add 129th place (+5) - 1 participant
    participants.push({
      position: 129,
      name: "Quinn Carlson",
      totalPoints: 5,
      picks: generateRandomPicks(),
      pickScores: generateRandomPickScores(),
      roundScores: { round1: 5 },
      tiebreaker1: -12,
      tiebreaker2: 2,
      paid: true
    });
    
    // Add tied for 130th place (+6) - 3 participants
    const tiedForHundredThirtieth = [
      "Ross Baker", "Peter Beugg", "Victoria Simmons"
    ];
    
    tiedForHundredThirtieth.forEach(name => {
      participants.push({
        position: 130,
        name,
        totalPoints: 6,
        picks: generateRandomPicks(),
        pickScores: generateRandomPickScores(),
        roundScores: { round1: 6 },
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: Math.random() > 0.15
      });
    });
    
    return participants;
  } catch (error) {
    console.error("Error fetching pool standings:", error);
    throw new Error("Failed
