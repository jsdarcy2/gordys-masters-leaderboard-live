
import { GolferScore, PoolParticipant, TournamentData } from "@/types";

// Your RapidAPI Key - you'll need to set this in your environment
const RAPIDAPI_KEY = "37e38c9bb1mshf4136d9a6ccdc34p1fb92bjsn20ccf89a6f5b"; // Using the provided API key

// Function to fetch leaderboard data from the RapidAPI endpoint
export const fetchLeaderboardData = async (): Promise<TournamentData> => {
  try {
    // Add cache-busting timestamp to prevent stale data
    const timestamp = new Date().getTime();
    
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "YOUR_API_KEY") {
      console.warn("RapidAPI key not set. Falling back to fallback data.");
      return getFallbackLeaderboardData();
    }
    
    // Use RapidAPI Golf leaderboard endpoint
    const response = await fetch(`https://live-golf-data.p.rapidapi.com/leaderboard?t=${timestamp}`, {
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
    return transformRapidAPIData(data);
  } catch (error) {
    console.error("Error fetching RapidAPI leaderboard data:", error);
    console.warn("Falling back to backup data");
    return getFallbackLeaderboardData();
  }
};

// Function to fetch current tournament schedule
export const fetchTournamentSchedule = async () => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "YOUR_API_KEY") {
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
    return data;
  } catch (error) {
    console.error("Error fetching tournament schedule:", error);
    return null;
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
        course: currentTournament.course
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
        isUpcoming: true
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current tournament:", error);
    return null;
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
  "Ethan Sturgis": ["Collin Morikawa", "Ludvig Åberg", "Tom Kim", "Will Zalatoris", "Phil Mickelson"],
  "Sarah Sturgis": ["Bryson DeChambeau", "Scottie Scheffler", "Shane Lowry", "Brooks Koepka", "Jordan Spieth"],
  "Scott Tande": ["Scottie Scheffler", "Collin Morikawa", "Russell Henley", "Justin Thomas", "Sepp Straka"],
  "Jess Troyak": ["Rory McIlroy", "Ludvig Åberg", "Hideki Matsuyama", "Will Zalatoris", "Akshay Bhatia"],
  "Chris Willette": ["Collin Morikawa", "Ludvig Åberg", "Justin Thomas", "Joaquín Niemann", "Russell Henley"]
};

// Calculate pool standings based on current leaderboard
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    const leaderboardData = await fetchLeaderboardData();
    
    const golferScoreMap = new Map<string, GolferScore>();
    leaderboardData.leaderboard.forEach(golfer => {
      golferScoreMap.set(golfer.name, golfer);
    });
    
    const participants: PoolParticipant[] = Object.entries(actualTeamSelections).map(([name, picks]) => {
      return {
        position: 0,
        name,
        totalPoints: 0,
        picks,
        pickScores: {},
        roundScores: {},
        tiebreaker1: Math.floor(Math.random() * 5) - 12,
        tiebreaker2: Math.floor(Math.random() * 5),
        paid: true
      };
    });
    
    participants.forEach(participant => {
      let totalScore = 0;
      const round1Score = { value: 0 };
      
      participant.pickScores = {};
      
      participant.picks.forEach(golferName => {
        // Try to find an exact match first
        let golfer = golferScoreMap.get(golferName);
        
        // If not found, try a more flexible match (to handle name variations)
        if (!golfer) {
          for (const [key, value] of golferScoreMap.entries()) {
            if (key.toLowerCase().includes(golferName.toLowerCase()) || 
                golferName.toLowerCase().includes(key.toLowerCase())) {
              golfer = value;
              break;
            }
          }
        }
        
        if (golfer) {
          participant.pickScores![golferName] = golfer.score;
          totalScore += golfer.score;
          
          if (leaderboardData.currentRound >= 1) {
            round1Score.value += golfer.score;
          }
        } else {
          // Player not found in leaderboard, use 0 as a fallback
          participant.pickScores![golferName] = 0;
        }
      });
      
      participant.totalPoints = totalScore;
      
      participant.roundScores = {
        round1: round1Score.value
      };
    });
    
    // Sort participants by total score (lower is better)
    participants.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return a.totalPoints - b.totalPoints;
      }
      
      if (a.tiebreaker1 !== b.tiebreaker1) {
        return a.tiebreaker1 - b.tiebreaker1;
      }
      
      return a.tiebreaker2 - b.tiebreaker2;
    });
    
    // Assign positions
    let currentPosition = 1;
    let currentScore = participants[0]?.totalPoints ?? 0;
    let currentTiebreaker1 = participants[0]?.tiebreaker1 ?? 0;
    let currentTiebreaker2 = participants[0]?.tiebreaker2 ?? 0;
    
    participants.forEach((participant, index) => {
      if (index === 0) {
        participant.position = currentPosition;
      } else {
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
    const poolStandingsData = await fetchPoolStandings();
    
    const playerSelections: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }} = {};
    
    poolStandingsData.forEach(participant => {
      const picks = participant.picks;
      
      const roundScores: number[] = [];
      
      if (participant.pickScores) {
        participant.picks.forEach(golfer => {
          const score = participant.pickScores?.[golfer] || 0;
          roundScores.push(score);
        });
      }
      
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
