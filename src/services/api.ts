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

// Helper function to generate random picks for participants
const generateRandomPicks = (): string[] => {
  const allPossibleGolfers = [
    "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Brooks Koepka", "Xander Schauffele",
    "Collin Morikawa", "Bryson DeChambeau", "Jordan Spieth", "Justin Thomas", "Dustin Johnson",
    "Cameron Smith", "Viktor Hovland", "Hideki Matsuyama", "Adam Scott", "Patrick Cantlay",
    "Tony Finau", "Shane Lowry", "Tommy Fleetwood", "Matt Fitzpatrick", "Justin Rose",
    "Joaquin Niemann", "Tyrrell Hatton", "Corey Conners", "Cameron Young", "Min Woo Lee",
    "Ludvig Åberg", "Brian Harman", "Tom Kim", "Jason Day", "Sahith Theegala",
    "Sepp Straka", "Sungjae Im", "Will Zalatoris", "Phil Mickelson", "Sergio Garcia"
  ];
  
  // Generate 5 random golfers without duplicates
  const picks: string[] = [];
  while (picks.length < 5) {
    const randomIndex = Math.floor(Math.random() * allPossibleGolfers.length);
    const pick = allPossibleGolfers[randomIndex];
    if (!picks.includes(pick)) {
      picks.push(pick);
    }
  }
  
  return picks;
};

// Helper function to generate random pick scores
const generateRandomPickScores = (): { [golferName: string]: number } => {
  const picks = generateRandomPicks();
  const pickScores: { [golferName: string]: number } = {};
  
  picks.forEach(pick => {
    // Generate scores between -4 and 5
    pickScores[pick] = Math.floor(Math.random() * 10) - 4;
  });
  
  return pickScores;
};

// Get the participants' raw data (without calculated scores)
const getParticipantsBaseData = async (): Promise<PoolParticipant[]> => {
  try {
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would fetch from a database
    const participants: PoolParticipant[] = [
      { 
        position: 0, // Position will be calculated later 
        name: "Charlotte Ramalingam", 
        totalPoints: 0, // Points will be calculated from picks
        picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"],
        pickScores: {}, // Will be filled in dynamically
        roundScores: {},
        tiebreaker1: -11,
        tiebreaker2: 0,
        paid: true
      },
      { 
        position: 0,
        name: "Chris Crawford", 
        totalPoints: 0,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -11,
        tiebreaker2: 2,
        paid: true
      },
      { 
        position: 0,
        name: "Stuie Snyder", 
        totalPoints: 0,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -11,
        tiebreaker2: 2,
        paid: true
      },
      { 
        position: 0,
        name: "Jimmy Beltz", 
        totalPoints: 0,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -11,
        tiebreaker2: 1,
        paid: true
      },
      { 
        position: 0,
        name: "Nash Nibbe", 
        totalPoints: 0,
        picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -12,
        tiebreaker2: 1,
        paid: true
      },
      { 
        position: 0,
        name: "Kyle Flippen", 
        totalPoints: 0,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -13,
        tiebreaker2: 0,
        paid: true
      },
      { 
        position: 0,
        name: "Avery Sturgis", 
        totalPoints: 0,
        picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -12,
        tiebreaker2: 1,
        paid: true
      },
      { 
        position: 0,
        name: "Matt Rogers", 
        totalPoints: 0,
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"],
        pickScores: {},
        roundScores: {},
        tiebreaker1: -10,
        tiebreaker2: 2,
        paid: true
      },
    ];

    // Add more random participants to match the original dataset
    const additionalParticipants = [
      "Steve Sorenson", "Brian Ginkel", "Sylas Stofer", "Owen Kepic", "Max Kepic", 
      "Roth Sanner", "Gordon Stofer Jr.", "James Carlson", "Adam Duff", "Darby Herfurth", 
      "Davis Jones", "Paul Kelley", "Charles Meech Jr", "James Petrikas Jr.",
      "Phil Present III", "Bette Stephens", "Sarah Sturgis"
    ];
    
    // Add additional participants with random picks
    additionalParticipants.forEach(name => {
      if (!participants.some(p => p.name === name)) {
        participants.push({
          position: 0,
          name,
          totalPoints: 0,
          picks: generateRandomPicks(),
          pickScores: {},
          roundScores: {},
          tiebreaker1: Math.floor(Math.random() * 5) - 12,
          tiebreaker2: Math.floor(Math.random() * 5),
          paid: Math.random() > 0.1
        });
      }
    });
    
    return participants;
  } catch (error) {
    console.error("Error fetching participants base data:", error);
    throw new Error("Failed to load participant data. Please try again later.");
  }
};

// Calculate pool standings based on current leaderboard
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Get current leaderboard data
    const leaderboardData = await fetchLeaderboardData();
    
    // Get base participant data
    const participants = await getParticipantsBaseData();
    
    // Create a Map for quick golfer lookup
    const golferScoreMap = new Map<string, GolferScore>();
    leaderboardData.leaderboard.forEach(golfer => {
      golferScoreMap.set(golfer.name, golfer);
    });
    
    // Calculate scores for each participant based on their picks
    participants.forEach(participant => {
      let totalScore = 0;
      const round1Score = { value: 0 };
      
      // Reset pick scores object
      participant.pickScores = {};
      
      participant.picks.forEach(golferName => {
        const golfer = golferScoreMap.get(golferName);
        
        // If golfer is found in the leaderboard, use their score
        if (golfer) {
          participant.pickScores![golferName] = golfer.score;
          totalScore += golfer.score;
          
          // Add to round 1 score (simplified for demo)
          if (leaderboardData.currentRound >= 1) {
            round1Score.value += golfer.score;
          }
        } else {
          // If golfer not found (e.g., didn't make the cut or typo in name)
          participant.pickScores![golferName] = 0;
        }
      });
      
      // Set total points for the participant
      participant.totalPoints = totalScore;
      
      // Set round scores
      participant.roundScores = {
        round1: round1Score.value
      };
    });
    
    // Sort participants by total points (lowest/best score first)
    participants.sort((a, b) => {
      // Primary sort: total points
      if (a.totalPoints !== b.totalPoints) {
        return a.totalPoints - b.totalPoints;
      }
      
      // Secondary sort: tiebreaker1
      if (a.tiebreaker1 !== b.tiebreaker1) {
        return a.tiebreaker1 - b.tiebreaker1;
      }
      
      // Tertiary sort: tiebreaker2
      return a.tiebreaker2 - b.tiebreaker2;
    });
    
    // Assign positions (handling ties)
    let currentPosition = 1;
    let currentScore = participants[0]?.totalPoints ?? 0;
    let currentTiebreaker1 = participants[0]?.tiebreaker1 ?? 0;
    let currentTiebreaker2 = participants[0]?.tiebreaker2 ?? 0;
    
    participants.forEach((participant, index) => {
      if (index === 0) {
        participant.position = currentPosition;
      } else {
        // Check if tied with previous participant
        if (participant.totalPoints === currentScore && 
            participant.tiebreaker1 === currentTiebreaker1 &&
            participant.tiebreaker2 === currentTiebreaker2) {
          participant.position = currentPosition;
        } else {
          currentPosition = index + 1;
          participant.position = currentPosition;
          currentScore = participant.totalPoints;
          currentTiebreaker1 = participant.tiebreaker1 ?? 0;
          currentTiebreaker2 = participant.tiebreaker2 ?? 0;
        }
      }
    });
    
    return participants;
  } catch (error) {
    console.error("Error calculating pool standings:", error);
    throw new Error("Failed to calculate pool standings. Please try again later.");
  }
};

// Function to fetch player selections data
export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    // Get latest pool standings which have updated scores
    const poolStandingsData = await fetchPoolStandings();
    
    // Convert pool standings data to the format expected by PlayerSelections component
    const playerSelections: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }} = {};
    
    poolStandingsData.forEach(participant => {
      // Extract the five picks and their round scores
      const picks: string[] = [];
      const roundScores: number[] = [];
      
      // Add each pick and its score to our arrays
      if (participant.pickScores) {
        Object.entries(participant.pickScores).forEach(([golfer, score]) => {
          picks.push(golfer);
          roundScores.push(score);
        });
      }
      
      // Ensure we always have exactly 5 picks and scores
      while (picks.length < 5) {
        picks.push(`Golfer ${picks.length + 1}`);
        roundScores.push(0);
      }
      
      // Add this participant's data to our result
      playerSelections[participant.name] = {
        picks,
        roundScores,
        tiebreakers: [participant.tiebreaker1 ?? 0, participant.tiebreaker2 ?? 0]
      };
    });
    
    return playerSelections;
  } catch (error) {
    console.error("Error fetching player selections:", error);
    throw new Error("Failed to load player selections data. Please try again later.");
  }
};
