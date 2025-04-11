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

// Implement the missing fetchPoolStandings function
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data for now
    return [
      { position: 1, name: "John Smith", totalScore: -15, paid: true, picks: ["Scottie Scheffler", "Collin Morikawa", "Max Homa", "Xander Schauffele", "Jon Rahm"], pickScores: {"Scottie Scheffler": -10, "Collin Morikawa": -8, "Max Homa": -7, "Xander Schauffele": -4, "Jon Rahm": 0} },
      { position: 2, name: "Emily Johnson", totalScore: -12, paid: true, picks: ["Scottie Scheffler", "Bryson DeChambeau", "Rory McIlroy", "Tommy Fleetwood", "Jordan Spieth"], pickScores: {"Scottie Scheffler": -10, "Bryson DeChambeau": -5, "Rory McIlroy": -1, "Tommy Fleetwood": -3, "Jordan Spieth": +2} },
      { position: 3, name: "Mike Williams", totalScore: -8, paid: true, picks: ["Collin Morikawa", "Brooks Koepka", "Dustin Johnson", "Tiger Woods", "Viktor Hovland"], pickScores: {"Collin Morikawa": -8, "Brooks Koepka": -2, "Dustin Johnson": +4, "Tiger Woods": +5, "Viktor Hovland": +8} },
      { position: 4, name: "Sarah Davis", totalScore: -5, paid: true, picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Patrick Cantlay", "Phil Mickelson"], pickScores: {"Scottie Scheffler": -10, "Ludvig Åberg": -6, "Justin Thomas": +1, "Patrick Cantlay": +3, "Phil Mickelson": +10} },
      { position: 5, name: "Robert Jones", totalScore: -2, paid: true, picks: ["Max Homa", "Bryson DeChambeau", "Rory McIlroy", "Brooks Koepka", "Tiger Woods"], pickScores: {"Max Homa": -7, "Bryson DeChambeau": -5, "Rory McIlroy": -1, "Brooks Koepka": -2, "Tiger Woods": +5} },
      { position: 6, name: "Jessica Brown", totalScore: +1, paid: false, picks: ["Collin Morikawa", "Ludvig Åberg", "Tommy Fleetwood", "Jon Rahm", "Justin Thomas"], pickScores: {"Collin Morikawa": -8, "Ludvig Åberg": -6, "Tommy Fleetwood": -3, "Jon Rahm": 0, "Justin Thomas": +1} },
      { position: 7, name: "David Miller", totalScore: +3, paid: true, picks: ["Scottie Scheffler", "Xander Schauffele", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama"], pickScores: {"Scottie Scheffler": -10, "Xander Schauffele": -4, "Jon Rahm": 0, "Jordan Spieth": +2, "Hideki Matsuyama": +6} },
      { position: 8, name: "Lisa Wilson", totalScore: +5, paid: true, picks: ["Max Homa", "Xander Schauffele", "Tommy Fleetwood", "Rory McIlroy", "Cameron Smith"], pickScores: {"Max Homa": -7, "Xander Schauffele": -4, "Tommy Fleetwood": -3, "Rory McIlroy": -1, "Cameron Smith": +7} },
      { position: 9, name: "Kevin Taylor", totalScore: +8, paid: true, picks: ["Bryson DeChambeau", "Brooks Koepka", "Jon Rahm", "Dustin Johnson", "Shane Lowry"], pickScores: {"Bryson DeChambeau": -5, "Brooks Koepka": -2, "Jon Rahm": 0, "Dustin Johnson": +4, "Shane Lowry": +9} },
      { position: 10, name: "Jennifer Anderson", totalScore: +10, paid: false, picks: ["Ludvig Åberg", "Xander Schauffele", "Rory McIlroy", "Justin Thomas", "Patrick Cantlay"], pickScores: {"Ludvig Åberg": -6, "Xander Schauffele": -4, "Rory McIlroy": -1, "Justin Thomas": +1, "Patrick Cantlay": +3} }
    ];
  } catch (error) {
    console.error('Error fetching pool standings:', error);
    return [];
  }
};

// Implement the missing fetchPlayerSelections function
export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data for now
    return {
      "John Smith": {
        picks: ["Scottie Scheffler", "Collin Morikawa", "Max Homa", "Xander Schauffele", "Jon Rahm"],
        roundScores: [-4, -2, -1, -2, +2],
        tiebreakers: [273, 68]
      },
      "Emily Johnson": {
        picks: ["Scottie Scheffler", "Bryson DeChambeau", "Rory McIlroy", "Tommy Fleetwood", "Jordan Spieth"],
        roundScores: [-4, -2, +1, -2, +2],
        tiebreakers: [275, 70]
      },
      "Mike Williams": {
        picks: ["Collin Morikawa", "Brooks Koepka", "Dustin Johnson", "Tiger Woods", "Viktor Hovland"],
        roundScores: [-3, -1, +2, +3, +3],
        tiebreakers: [278, 71]
      },
      "Sarah Davis": {
        picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Patrick Cantlay", "Phil Mickelson"],
        roundScores: [-4, -3, +1, +2, +4],
        tiebreakers: [276, 69]
      },
      "Robert Jones": {
        picks: ["Max Homa", "Bryson DeChambeau", "Rory McIlroy", "Brooks Koepka", "Tiger Woods"],
        roundScores: [-2, -2, +1, -1, +3],
        tiebreakers: [277, 70]
      },
      "Jessica Brown": {
        picks: ["Collin Morikawa", "Ludvig Åberg", "Tommy Fleetwood", "Jon Rahm", "Justin Thomas"],
        roundScores: [-3, -3, -2, +2, +1],
        tiebreakers: [274, 68]
      },
      "David Miller": {
        picks: ["Scottie Scheffler", "Xander Schauffele", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama"],
        roundScores: [-4, -2, +2, +2, +3],
        tiebreakers: [279, 71]
      },
      "Lisa Wilson": {
        picks: ["Max Homa", "Xander Schauffele", "Tommy Fleetwood", "Rory McIlroy", "Cameron Smith"],
        roundScores: [-2, -2, -2, +1, +4],
        tiebreakers: [276, 69]
      },
      "Kevin Taylor": {
        picks: ["Bryson DeChambeau", "Brooks Koepka", "Jon Rahm", "Dustin Johnson", "Shane Lowry"],
        roundScores: [-2, -1, +2, +2, +5],
        tiebreakers: [280, 72]
      },
      "Jennifer Anderson": {
        picks: ["Ludvig Åberg", "Xander Schauffele", "Rory McIlroy", "Justin Thomas", "Patrick Cantlay"],
        roundScores: [-3, -2, +1, +1, +2],
        tiebreakers: [275, 69]
      }
    };
  } catch (error) {
    console.error('Error fetching player selections:', error);
    return {};
  }
};

// Implement the missing isTournamentInProgress function
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
