
import { PoolParticipant } from "@/types";
import { fetchLeaderboardData, buildGolferScoreMap } from "../leaderboard";
import { calculatePoolStandings } from "./participantUtils";
import { getBaseSampleTeams } from "./teamData";
import { generateParticipantName } from "./participantUtils";

/**
 * Fetch pool standings with fallback measures
 */
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    console.log("Fetching pool standings...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // First get the current leaderboard to ensure scores match
    const { leaderboard } = await fetchLeaderboardData();
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScores = buildGolferScoreMap(leaderboard);
    
    // Get the player selections
    const selectionsData = await fetchPlayerSelections();
    
    console.log(`Fetched selections for ${Object.keys(selectionsData).length} participants`);
    
    if (Object.keys(selectionsData).length === 0) {
      console.error("No player selections data received");
      throw new Error("No player selections data");
    }
    
    // Calculate and return the pool standings with complete data
    const standings = calculatePoolStandings(selectionsData, golferScores);
    
    // Cache the calculated standings
    localStorage.setItem('poolStandingsData', JSON.stringify(standings));
    localStorage.setItem('poolStandingsTimestamp', new Date().getTime().toString());
    
    console.log(`Returning ${standings.length} processed participants for standings`);
    return standings;
  } catch (error) {
    console.error('Error fetching pool standings:', error);
    
    // Try to use cached pool standings
    const cachedStandings = localStorage.getItem('poolStandingsData');
    if (cachedStandings) {
      try {
        console.log('Using cached pool standings as fallback');
        return JSON.parse(cachedStandings);
      } catch (e) {
        console.error("Error parsing cached standings:", e);
      }
    }
    
    return [];
  }
};

/**
 * Fetch player selections with all 134 participants
 */
export const fetchPlayerSelections = async (): Promise<{[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }}> => {
  try {
    console.log("Fetching player selections...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get current leaderboard data to calculate real scores
    const { leaderboard } = await fetchLeaderboardData();
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScoreMap: Record<string, number> = {};
    leaderboard.forEach(golfer => {
      golferScoreMap[golfer.name] = golfer.score;
    });
    
    // Get base teams data including participants from the text data
    const teamsData: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }} = getBaseSampleTeams();
    
    console.log(`Base teams data has ${Object.keys(teamsData).length} teams`);
    
    // Generate additional teams if needed to reach 134 total
    const currentCount = Object.keys(teamsData).length;
    const neededCount = 134 - currentCount;
    
    console.log(`Have ${currentCount} base teams, need ${neededCount} more to reach 134 total`);
    
    if (neededCount > 0) {
      // Available golfers to choose from
      const availableGolfers = [
        "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Bryson DeChambeau", 
        "Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", 
        "Viktor Hovland", "Ludvig Åberg", "Tommy Fleetwood", "Shane Lowry", 
        "Justin Thomas", "Hideki Matsuyama", "Cameron Smith", "Jordan Spieth", 
        "Will Zalatoris", "Russell Henley", "Tyrrell Hatton", "Adam Scott", 
        "Dustin Johnson", "Tony Finau", "Joaquín Niemann", "Min Woo Lee", 
        "Tom Kim", "Max Homa", "Sepp Straka", "Corey Conners", 
        "Jason Day", "Matt Fitzpatrick", "Robert MacIntyre", "Cameron Young",
        "Sahith Theegala", "Justin Rose", "Sungjae Im", "Danny Willett", 
        "Phil Mickelson", "Patrick Reed", "Zach Johnson", "Chris Kirk"
      ];
      
      for (let i = 0; i < neededCount; i++) {
        const teamIndex = currentCount + i + 1;
        // Generate a realistic name
        const teamName = generateParticipantName(teamIndex);
        
        // Select 5 random golfers for this team
        const picks: string[] = [];
        while (picks.length < 5) {
          const randomIndex = Math.floor(Math.random() * availableGolfers.length);
          const golfer = availableGolfers[randomIndex];
          if (!picks.includes(golfer)) {
            picks.push(golfer);
          }
        }
        
        // Calculate scores for each pick based on actual leaderboard data
        const roundScores = picks.map(golfer => 
          golferScoreMap[golfer] !== undefined ? golferScoreMap[golfer] : 0
        );
        
        // Generate random tiebreakers
        const tiebreaker1 = Math.floor(Math.random() * 5) + 137; // 137-142
        const tiebreaker2 = Math.floor(Math.random() * 15) + 275; // 275-290
        
        teamsData[teamName] = {
          picks,
          roundScores,
          tiebreakers: [tiebreaker1, tiebreaker2] as [number, number]
        };
      }
    }
    
    // Update round scores with real golfer scores for ALL teams
    Object.keys(teamsData).forEach(participant => {
      const team = teamsData[participant];
      team.picks.forEach((golfer, index) => {
        // Use the golfer's current score, or 0 if not found
        team.roundScores[index] = golferScoreMap[golfer] !== undefined ? golferScoreMap[golfer] : 0;
      });
    });
    
    console.log(`Generated ${Object.keys(teamsData).length} teams total`);
    
    // Ensure we have exactly 134 teams
    const finalCount = Object.keys(teamsData).length;
    if (finalCount !== 134) {
      console.warn(`Expected 134 teams but generated ${finalCount}`);
    }
    
    return teamsData;
  } catch (error) {
    console.error('Error fetching player selections:', error);
    return {};
  }
};
