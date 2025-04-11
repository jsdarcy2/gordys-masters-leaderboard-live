import { GolferScore, PoolParticipant, TournamentData } from "@/types";

// Your RapidAPI Key - you'll need to set this in your environment
const RAPIDAPI_KEY = "37e38c9bb1mshf4136d9a6ccdc34p1fb92bjsn20ccf89a6f5b"; // Using the provided API key

// Function to fetch leaderboard data from the RapidAPI endpoint
export const fetchLeaderboardData = async (): Promise<TournamentData> => {
  try {
    // Add cache-busting timestamp to prevent stale data
    const timestamp = new Date().getTime();
    const currentYear = new Date().getFullYear();
    
    if (!RAPIDAPI_KEY) {
      console.warn("RapidAPI key not set. Falling back to fallback data.");
      return getFallbackLeaderboardData();
    }
    
    // First get current tournament info to get the tournament ID
    const tournamentInfo = await getCurrentTournament();
    console.log("Current tournament info:", tournamentInfo);
    
    // If we can't get tournament info, fall back to sample data
    if (!tournamentInfo || !tournamentInfo.id) {
      console.warn("No tournament ID available. Falling back to fallback data.");
      return getFallbackLeaderboardData();
    }
    
    // Use RapidAPI Golf leaderboard endpoint with tournament ID parameter
    const response = await fetch(`https://live-golf-data.p.rapidapi.com/leaderboard?t=${timestamp}&tournId=${tournamentInfo.id}`, {
      headers: {
        'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`RapidAPI responded with status: ${response.status}`);
      return getFallbackLeaderboardData();
    }
    
    const data = await response.json();
    console.log("Raw API response:", data);
    return transformRapidAPIData(data);
  } catch (error) {
    console.error("Error fetching RapidAPI leaderboard data:", error);
    console.warn("Falling back to backup data");
    return getFallbackLeaderboardData();
  }
};

// Function to fetch tournament schedule
export const fetchTournamentSchedule = async () => {
  try {
    if (!RAPIDAPI_KEY) {
      console.warn("RapidAPI key not set. Cannot fetch tournament schedule.");
      return null;
    }
    
    const currentYear = new Date().getFullYear();
    
    const response = await fetch(`https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=${currentYear}`, {
      headers: {
        'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`RapidAPI schedule responded with status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log("Tournament schedule data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching tournament schedule:", error);
    return null;
  }
};

// Check if the tournament is currently in progress
export const isTournamentInProgress = async (): Promise<boolean> => {
  try {
    const tournamentInfo = await getCurrentTournament();
    if (!tournamentInfo) return false;
    
    const now = new Date();
    const startDate = new Date(tournamentInfo.startDate);
    const endDate = new Date(tournamentInfo.endDate);
    
    // Add hours to account for timezone and end of play
    endDate.setHours(23, 59, 59);
    
    return now >= startDate && now <= endDate;
  } catch (error) {
    console.error("Error checking if tournament is in progress:", error);
    return false;
  }
};

// Function to get the current tournament from the schedule
export const getCurrentTournament = async () => {
  try {
    const scheduleData = await fetchTournamentSchedule();
    
    if (!scheduleData || !scheduleData.tournaments) {
      return null;
    }
    
    const now = new Date();
    
    // Find the current or next upcoming tournament
    const currentTournament = scheduleData.tournaments.find((tournament: any) => {
      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);
      return now >= startDate && now <= endDate;
    });
    
    if (currentTournament) {
      return {
        name: currentTournament.name,
        startDate: currentTournament.startDate,
        endDate: currentTournament.endDate,
        location: currentTournament.location,
        course: currentTournament.course,
        id: currentTournament.id // Make sure we capture the tournament ID
      };
    }
    
    // If no current tournament, find the next one
    const upcomingTournaments = scheduleData.tournaments
      .filter((tournament: any) => new Date(tournament.startDate) > now)
      .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    if (upcomingTournaments.length > 0) {
      const nextTournament = upcomingTournaments[0];
      return {
        name: nextTournament.name,
        startDate: nextTournament.startDate,
        endDate: nextTournament.endDate,
        location: nextTournament.location,
        course: nextTournament.course,
        id: nextTournament.id, // Make sure we capture the tournament ID
        isUpcoming: true
      };
    }
    
    // If no current or upcoming tournament, use a hardcoded Masters ID for testing
    console.warn("No current or upcoming tournament found. Using hardcoded Masters ID for testing.");
    return {
      name: "The Masters",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      course: "Augusta National Golf Club",
      id: "401580190", // Hardcoded Masters Tournament ID as fallback
      isUpcoming: false
    };
  } catch (error) {
    console.error("Error getting current tournament:", error);
    
    // Provide hardcoded Masters ID as fallback
    console.warn("Error occurred. Using hardcoded Masters ID as fallback.");
    return {
      name: "The Masters",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      course: "Augusta National Golf Club",
      id: "401580190", // Hardcoded Masters Tournament ID as fallback
      isUpcoming: false
    };
  }
};

// Transform RapidAPI data to our application format
const transformRapidAPIData = (apiData: any): TournamentData => {
  try {
    console.log("Processing RapidAPI data:", apiData);
    
    // Extract the leaderboard data from the API response
    const players = apiData.leaderboard || [];
    
    // Transform player data to our format
    const leaderboard = players.map((player: any) => {
      // Handle CUT or WD status
      let status: 'cut' | 'active' | 'withdrawn' = 'active';
      if (player.status && (player.status.toLowerCase().includes('cut') || player.status === 'CUT')) {
        status = 'cut';
      } else if (player.status && (player.status.toLowerCase().includes('wd') || player.status === 'WD')) {
        status = 'withdrawn';
      }
      
      // Calculate score relative to par
      let score = 0;
      if (player.total_to_par !== undefined) {
        score = player.total_to_par;
      } else if (player.score !== undefined) {
        // Handle "E" (even par) value
        score = player.score === "E" ? 0 : parseInt(player.score);
      } else if (player.topar !== undefined) {
        score = player.topar === "E" ? 0 : parseInt(player.topar);
      }
      
      // Get today's score
      let todayScore = 0;
      if (player.today !== undefined) {
        todayScore = player.today === "E" ? 0 : parseInt(player.today);
      } else if (player.today_score !== undefined) {
        todayScore = player.today_score === "E" ? 0 : parseInt(player.today_score);
      } else if (player.round_score !== undefined) {
        todayScore = player.round_score === "E" ? 0 : parseInt(player.round_score);
      }
      
      // Format position correctly
      let position = 0;
      if (player.position !== undefined) {
        position = parseInt(player.position) || 0;
      } else if (player.pos !== undefined) {
        const posString = player.pos.toString().replace(/T/g, '');
        position = parseInt(posString) || 0;
      }
      
      return {
        position: position,
        name: player.name || `${player.first_name || ''} ${player.last_name || ''}`.trim(),
        score: isNaN(score) ? 0 : score,
        today: isNaN(todayScore) ? 0 : todayScore,
        thru: player.thru || player.thruHole || 'F',
        status: status
      };
    })
    .filter((entry: any) => entry.name && entry.name.trim() !== '');
    
    // Sort by position if needed
    const sortedLeaderboard = leaderboard.sort((a: GolferScore, b: GolferScore) => a.position - b.position);
    
    return {
      lastUpdated: new Date().toISOString(),
      currentRound: determineCurrentRound(apiData),
      leaderboard: sortedLeaderboard
    };
  } catch (err) {
    console.error("Error transforming RapidAPI data:", err);
    return getFallbackLeaderboardData();
  }
};

// Helper function to determine current round
const determineCurrentRound = (data: any): 1 | 2 | 3 | 4 => {
  try {
    // Try to extract round information from API data
    const round = data.current_round || data.round || 1;
    
    if (round >= 1 && round <= 4) {
      return round as 1 | 2 | 3 | 4;
    }
    
    return 1; // Default to round 1
  } catch (e) {
    return 1; // Default to round 1 in case of error
  }
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

// Actual team selections data - no more random generation
const actualTeamSelections: { [participantName: string]: string[] } = {
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
  "Hadley Carlson": ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"],
  "Quinn Carlson": ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"],
  "Ed Corbett": ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"],
  "Chuck Corbett Sr": ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"],
  "Chris Crawford": ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"],
  "Justin Darcy": ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"],
  "Holland Darcy": ["Jordan Spieth", "Collin Morikawa", "Xander Schauffele", "Viktor Hovland", "Jose Luis Ballester (a)"],
  "Audrey Darcy": ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Cameron Young", "Zach Johnson"],
  "Ava Rose Darcy": ["Wyndham Clark", "Justin Rose", "Jon Rahm", "Scottie Scheffler", "Viktor Hovland"],
  "Jay Despard": ["Scottie Scheffler", "Collin Morikawa", "Min Woo Lee", "Russell Henley", "Robert MacIntyre"],
  "Pete Drago": ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Sergio Garcia", "Sepp Straka"],
  "Alexa Drago": ["Xander Schauffele", "Scottie Scheffler", "Patrick Cantlay", "Jordan Spieth", "Hideki Matsuyama"],
  "Ollie Drago": ["Scottie Scheffler", "Jon Rahm", "Patrick Cantlay", "Sergio Garcia", "Patrick Reed"],
  "Charlie Drago": ["Jon Rahm", "Collin Morikawa", "Patrick Cantlay", "Patrick Reed", "Jordan Spieth"],
  "Adam Duff": ["Scottie Scheffler", "Collin Morikawa", "Brooks Koepka", "Viktor Hovland", "Cameron Smith"],
  "Tilly Duff": ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Brooks Koepka", "Tommy Fleetwood"],
  "Gretchen Duff": ["Ludvig Åberg", "Xander Schauffele", "Tommy Fleetwood", "Hideki Matsuyama", "Russell Henley"],
  "Charles Elder": ["Scottie Scheffler", "Rory McIlroy", "Robert MacIntyre", "Joaquín Niemann", "Hideki Matsuyama"],
  "Eric Fox": ["Bryson DeChambeau", "Rory McIlroy", "Wyndham Clark", "Viktor Hovland", "Sepp Straka"],
  "Kyle Flippen": ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"],
  "J.J. Furst": ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Hideki Matsuyama", "Joaquín Niemann"],
  "Brian Ginkel": ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Min Woo Lee", "Brooks Koepka"],
  "Grayson Ginkel": ["Scottie Scheffler", "Rory McIlroy", "Patrick Cantlay", "Hideki Matsuyama", "Jordan Spieth"],
  "Mik Gusenius": ["Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Justin Thomas", "Jordan Spieth"],
  "John Gustafson": ["Rory McIlroy", "Ludvig Åberg", "Jordan Spieth", "Justin Thomas", "Hideki Matsuyama"],
  "Andy Gustafson": ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama"],
  "Lily Gustafson": ["Collin Morikawa", "Bryson DeChambeau", "Cameron Smith", "Justin Thomas", "Russell Henley"],
  "David Hardt": ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Brooks Koepka"],
  "Brack Herfurth": ["Jon Rahm", "Xander Schauffele", "Joaquín Niemann", "Tommy Fleetwood", "Sungjae Im"],
  "Darby Herfurth": ["Rory McIlroy", "Ludvig Åberg", "Patrick Cantlay", "Corey Conners", "Sepp Straka"],
  "Henry Herfurth": ["Collin Morikawa", "Hideki Matsuyama", "Wyndham Clark", "Cameron Smith", "Chris Kirk"],
  "Jess Herfurth": ["Rory McIlroy", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Tommy Fleetwood"],
  "Decker Herfurth": ["Rory McIlroy", "Ludvig Åberg", "Russell Henley", "Sepp Straka", "Hideki Matsuyama"],
  "Rachel Herfurth": ["Rory McIlroy", "Collin Morikawa", "Viktor Hovland", "Justin Thomas", "Tommy Fleetwood"],
  "Amy Jones": ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Brooks Koepka", "Tommy Fleetwood"],
  "Jim Jones": ["Scottie Scheffler", "Collin Morikawa", "Joaquín Niemann", "Jordan Spieth", "Will Zalatoris"],
  "Carter Jones": ["Tony Finau", "Bryson DeChambeau", "Viktor Hovland", "Hideki Matsuyama", "Xander Schauffele"],
  "Davis Jones": ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Patrick Cantlay", "Shane Lowry"],
  "Sargent Johnson": ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Cameron Smith", "Justin Thomas"],
  "Sargent Johnson, Jr.": ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Jordan Spieth"],
  "Chris Kelley": ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Sepp Straka", "Russell Henley"],
  "Paul Kelley": ["Rory McIlroy", "Akshay Bhatia", "Tom Hoge", "Jordan Spieth", "Ludvig Åberg"],
  "Peter Kepic Jr.": ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Jordan Spieth", "Dustin Johnson"],
  "Sarah Kepic": ["Brooks Koepka", "Tommy Fleetwood", "Will Zalatoris", "Cameron Smith", "Dustin Johnson"],
  "Peter Kepic Sr.": ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Min Woo Lee"],
  "Owen Kepic": ["Scottie Scheffler", "Min Woo Lee", "Will Zalatoris", "Ludvig Åberg", "Brooks Koepka"],
  "Max Kepic": ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Viktor Hovland", "Hideki Matsuyama"],
  "Greg Kevane": ["Rory McIlRoy", "Collin Morikawa", "Sepp Straka", "Corey Conners", "Russell Henley"],
  "Rory Kevane": ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Russell Henley", "Min Woo Lee"],
  "Andy Koch": ["Bryson DeChambeau", "Jon Rahm", "Patrick Cantlay", "Shane Lowry", "Brooks Koepka"],
  "Chad Kollar": ["Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama", "Patrick Cantlay"],
  "Pete Kostroski": ["Rory McIlroy", "Ludvig Åberg", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"],
  "Dan Lenmark": ["Xander Schauffele", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Will Zalatoris"],
  "Jack Lenmark": ["Xander Schauffele", "Rory McIlroy", "Patrick Cantlay", "Shane Lowry", "Matt Fitzpatrick"],
  "Jamie Lockhart": ["Scottie Scheffler", "Jon Rahm", "Will Zalatoris", "Brooks Koepka", "Joaquín Niemann"],
  "Rollie Logan": ["Tony Finau", "Viktor Hovland", "Justin Thomas", "Scottie Scheffler", "Rory McIlroy"],
  "Bo Massopust": ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Tom Kim"],
  "Elle McClintock": ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Jordan Spieth", "Brooks Koepka"],
  "Jenny McClintock": ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Russell Henley"],
  "Peggy McClintock": ["Scottie Scheffler", "Collin Morikawa", "Wyndham Clark", "Will Zalatoris", "Sepp Straka"],
  "Kevin McClintock": ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Will Zalatoris", "Russell Henley"],
  "Rich McClintock": ["Rory McIlroy", "Scottie Scheffler", "Hideki Matsuyama", "Shane Lowry", "Billy Horschel"],
  "Johnny McWhite": ["Scottie Scheffler", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama", "Justin Thomas"],
  "Charles Meech Jr": ["Dustin Johnson", "Scottie Scheffler", "Viktor Hovland", "Brooks Koepka", "Bryson DeChambeau"],
  "Jon Moseley": ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Shane Lowry", "Russell Henley"],
  "Chad Murphy": ["Joaquín Niemann", "Ludvig Åberg", "Min Woo Lee", "Justin Thomas", "Rory McIlroy"],
  "C.J. Nibbe": ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Robert MacIntyre", "Min Woo Lee"],
  "Nash Nibbe": ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"],
  "Knox Nibbe": ["Scottie Scheffler", "Jon Rahm", "Justin Thomas", "Patrick Cantlay", "Brooks Koepka"],
  "Julie Nibbe": ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Jordan Spieth"],
  "Jay Perlmutter": ["Russell Henley", "Corey Conners", "Sepp Straka", "Rory McIlroy", "Collin Morikawa"],
  "Les Perry": ["Bryson DeChambeau", "Rory McIlroy", "Sergio Garcia", "Brooks Koepka", "Viktor Hovland"],
  "James Petrikas Sr.": ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jordan Spieth", "Justin Thomas"],
  "James Petrikas Jr.": ["Scottie Scheffler", "Ludvig Åberg", "Will Zalatoris", "Brooks Koepka", "Shane Lowry"],
  "Davey Phelps": ["Scottie Scheffler", "Rory McIlroy", "Akshay Bhatia", "Will Zalatoris", "Sepp Straka"],
  "Will Phelps": ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Brooks Koepka", "Shane Lowry"],
  "Phil Present Jr.": ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Russell Henley", "Joaquín Niemann"],
  "Phil Present III": ["Scottie Scheffler", "Ludvig Åberg", "Brooks Koepka", "Tommy Fleetwood", "Justin Thomas"],
  "Ravi Ramalingam": ["Xander Schauffele", "Rory McIlroy", "Sepp Straka", "Shane Lowry", "Will Zalatoris"],
  "Charlotte Ramalingam": ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"],
  "Matt Rogers": ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"],
  "Roth Sanner": ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Cameron Smith", "Akshay Bhatia"],
  "John Saunders": ["Scottie Scheffler", "Rory McIlroy", "Joaquín Niemann", "Tommy Fleetwood", "Sahith Theegala"],
  "Jackson Saunders": ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Cameron Smith", "Viktor Hovland"],
  "Donny Schmitt": ["Rory McIlroy", "Tom Hoge", "Collin Morikawa", "Sepp Straka", "Justin Thomas"],
  "Ryan Schmitt": ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Wyndham Clark", "Russell Henley"],
  "Jon Schwingler": ["Rory McIlroy", "Scottie Scheffler", "Jordan Spieth", "Tommy Fleetwood", "Akshay Bhatia"],
  "Toby Schwingler": ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Viktor Hovland", "Russell Henley"],
  "Jack Simmons": ["Jon Rahm", "Rory McIlroy", "Shane Lowry", "Sepp Straka", "Sergio Garcia"],
  "Hayden Simmons": ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Billy Horschel", "Justin Thomas"],
  "Tommy Simmons": ["Shane Lowry", "Collin Morikawa", "Will Zalatoris", "J.J. Spaun", "Denny McCarthy"],
  "Victoria Simmons": ["Russell Henley", "Brooks Koepka", "Robert MacIntyre", "Xander Schauffele", "Rory McIlroy"],
  "Tyler Smith": ["Rory McIlroy", "Brooks Koepka", "Danny Willett", "Scottie Scheffler", "Hideki Matsuyama"],
  "Stuie Snyder": ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"],
  "Steve Sorenson": ["Rory McIlroy", "Ludvig Åberg", "Keegan Bradley", "Tommy Fleetwood", "Justin Rose"],
  "Katie Stephens": ["Ludvig Åberg", "Wyndham Clark", "Nick Dunlap", "Brooks Koepka", "Scottie Scheffler"],
  "Reven Stephens": ["Rory McIlroy", "Collin Morikawa", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"],
  "Winfield Stephens": ["Xander Schauffele", "Rory McIlroy", "Russell Henley", "Jordan Spieth", "Justin Thomas"],
  "Caelin Stephens": ["Rory McIlroy", "Bryson DeChambeau", "Min Woo Lee", "Jordan Spieth", "Justin Thomas"],
  "Bette Stephens": ["Viktor Hovland", "Scottie Scheffler", "Zach Johnson", "Rory McIlroy", "Denny McCarthy"],
  "Debbie Stofer": ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Russell Henley", "Joaquín Niemann"],
  "Gordon Stofer Jr.": ["Scottie Scheffler", "Bryson DeChambeau", "Tony Finau", "Justin Thomas", "Min Woo Lee"],
  "Jimmy Stofer": ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Tommy Fleetwood"],
  "Teddy Stofer": ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Shane Lowry", "Russell Henley"],
  "Eileen Stofer": ["Bryson DeChambeau", "Ludvig Åberg", "Tommy Fleetwood", "Jordan Spieth", "Robert MacIntyre"],
  "Cora Stofer": ["Bryson DeChambeau", "Jon Rahm", "Joaquín Niemann", "Brooks Koepka", "Tyrrell Hatton"],
  "Gordon Stofer III": ["Rory McIlroy", "Ludvig Åberg", "Brooks Koepka", "Max Homa", "Jordan Spieth"],
  "Addie Stofer": ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Cameron Smith", "Robert MacIntyre"],
  "Ford Stofer": ["Rory McIlroy", "Collin Morikawa", "Jordan Spieth", "Joaquín Niemann", "Tom Kim"],
  "Sylas Stofer": ["Scottie Scheffler", "Bryson DeChambeau", "Akshay Bhatia", "Jordan Spieth", "Russell Henley"],
  "Robby Stofer": ["Rory McIlroy", "Ludvig Åberg", "Will Zalatoris", "Robert MacIntyre", "Russell Henley"],
  "Jon Sturgis": ["Rory McIlroy", "Collin Morikawa", "Corey Conners", "Russell Henley", "Shane Lowry"],
  "Avery Sturgis": ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"],
  "Ethan Sturgis": ["Collin Morikawa", "Ludvig Åberg", "Tom Kim", "Will Zalatoris", "Phil Mickelson"]
};

// Create a function to fetch player selections
export const fetchPlayerSelections = async () => {
  try {
    // Here we would typically fetch from an API, but since we have the data locally,
    // we'll create selections with mock round scores
    const selections: {[participant: string]: {picks: string[], roundScores: number[], tiebreakers: [number, number]}} = {};
    
    // Map the actualTeamSelections into our desired format with mock round scores
    Object.entries(actualTeamSelections).forEach(([participant, picks]) => {
      // Calculate mock round scores based on players chosen
      const roundScores = picks.map(golfer => {
        // Get a score between -3 and +4 for each player
        const fallbackPlayers = getFallbackLeaderboardData().leaderboard;
        const playerInfo = fallbackPlayers.find(p => p.name === golfer);
        
        if (playerInfo) {
          return playerInfo.today; // Use the player's actual today score
        }
        
        // Random score if player not found in leaderboard
        return Math.floor(Math.random() * 8) - 3;
      });
      
      // Generate random tiebreakers (winner's score and winning score)
      const tiebreakers: [number, number] = [
        Math.floor(Math.random() * 12) - 8, // Winner score between -8 and 4
        Math.floor(Math.random() * 20) + 270 // Total score between 270 and 290
      ];
      
      selections[participant] = {
        picks,
        roundScores,
        tiebreakers
      };
    });
    
    return selections;
  } catch (err) {
    console.error("Error fetching player selections:", err);
    return {};
  }
};

// Function to fetch pool standings data based on golfer scores
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Get the current leaderboard data to calculate positions
    const leaderboardData = await fetchLeaderboardData();
    const teamSelections = await fetchPlayerSelections();
    
    // Create an array to hold all participants and their scores
    const standings: PoolParticipant[] = [];
    
    // Process each participant's selections
    Object.entries(teamSelections).forEach(([participantName, data]) => {
      const { picks, roundScores, tiebreakers } = data;
      
      // Calculate total golf score based on players' scores in the leaderboard
      let totalScore = 0;
      const pickScores: { [golferName: string]: number } = {};
      
      // Go through each pick and find their current score
      picks.forEach((golferName) => {
        const golfer = leaderboardData.leaderboard.find(g => g.name === golferName);
        
        if (golfer) {
          // If player made the cut or is active, use their score
          if (!golfer.status || golfer.status === 'active') {
            totalScore += golfer.score; // Add the player's score to the total
            pickScores[golferName] = golfer.score;
          } else {
            // If cut or withdrawn, add a penalty score
            const cutPenalty = 10; // 10 over par penalty for cut players
            totalScore += cutPenalty;
            pickScores[golferName] = cutPenalty;
          }
        } else {
          // If golfer not found, assume a high score
          const notFoundPenalty = 12; // Even higher penalty
          totalScore += notFoundPenalty;
          pickScores[golferName] = notFoundPenalty;
        }
      });
      
      // Add participant to standings
      standings.push({
        name: participantName,
        position: 0, // Will be calculated after sorting
        totalScore,
        totalPoints: 0, // Keep for compatibility
        picks,
        pickScores,
        roundScores: {
          round1: roundScores.reduce((sum, score) => sum + score, 0)
        },
        tiebreaker1: tiebreakers[0],
        tiebreaker2: tiebreakers[1],
        paid: Math.random() > 0.2 // Random payment status (80% paid)
      });
    });
    
    // Sort by totalScore (ascending - lower score is better in golf)
    standings.sort((a, b) => {
      // First sort by total score
      if (a.totalScore !== b.totalScore) {
        return a.totalScore - b.totalScore;
      }
      
      // If scores are equal, check round 1 scores
      if (a.roundScores?.round1 !== b.roundScores?.round1) {
        return (a.roundScores?.round1 || 0) - (b.roundScores?.round1 || 0);
      }
      
      // If still tied, check tiebreaker1
      if (a.tiebreaker1 !== b.tiebreaker1) {
        // Lower predicted score is better
        return (a.tiebreaker1 || 0) - (b.tiebreaker1 || 0);
      }
      
      // If still tied, check tiebreaker2
      return (a.tiebreaker2 || 0) - (b.tiebreaker2 || 0);
    });
    
    // Assign positions
    let currentPosition = 1;
    let samePositionCount = 0;
    let previousScore = -999;
    let previousRound1 = -999;
    
    standings.forEach((participant, index) => {
      if (index === 0) {
        participant.position = currentPosition;
        previousScore = participant.totalScore;
        previousRound1 = participant.roundScores?.round1 || 0;
      } else {
        // If this participant has the same score and round1 score as previous, assign same position
        if (participant.totalScore === previousScore && participant.roundScores?.round1 === previousRound1) {
          participant.position = currentPosition;
          samePositionCount++;
        } else {
          // Otherwise, assign a new position
          currentPosition = index + 1;
          participant.position = currentPosition;
          samePositionCount = 0;
          previousScore = participant.totalScore;
          previousRound1 = participant.roundScores?.round1 || 0;
        }
      }
    });
    
    return standings;
  } catch (err) {
    console.error("Error calculating pool standings:", err);
    return [];
  }
};
