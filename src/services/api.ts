// Keep any existing imports at the top
import { GolferScore } from "@/types";

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
    { position: 8, name: "Brooks Koepka", score: -2, today: E, thru: "F", status: "active" },
    { position: 9, name: "Rory McIlroy", score: -1, today: +1, thru: "F", status: "active" },
    { position: 10, name: "Jon Rahm", score: E, today: +2, thru: "F", status: "active" },
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
