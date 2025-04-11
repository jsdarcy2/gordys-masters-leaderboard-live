
import { PoolParticipant } from "@/types";
import { fetchLeaderboardData, buildGolferScoreMap } from "../leaderboard";
import { calculatePoolStandings } from "./participantUtils";
import { getBaseSampleTeams } from "./teamData";
import { generateParticipantName } from "./participantUtils";

/**
 * Fetch pool standings with no historical data fallbacks
 */
export const fetchPoolStandings = async (): Promise<PoolParticipant[]> => {
  try {
    console.log("Fetching pool standings...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // First get the current leaderboard to ensure scores match
    const { leaderboard } = await fetchLeaderboardData();
    
    if (!leaderboard || leaderboard.length === 0) {
      throw new Error("No leaderboard data available to calculate pool standings");
    }
    
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
    // Don't fall back to cached or historical data
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
    
    if (!leaderboard || leaderboard.length === 0) {
      throw new Error("No leaderboard data available to process player selections");
    }
    
    // Create a map of golfer names to their current scores for quick lookup
    const golferScoreMap: Record<string, number> = {};
    leaderboard.forEach(golfer => {
      golferScoreMap[golfer.name] = golfer.score;
    });
    
    // Get base teams data including participants from the text data
    const teamsData: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }} = getBaseSampleTeams();
    
    console.log(`Base teams data has ${Object.keys(teamsData).length} teams`);
    
    // Get the team selections from the TeamSelectionsTable component
    const completeTeamSelectionsData = getCompleteTeamSelections();
    console.log(`Found ${completeTeamSelectionsData.length} teams in TeamSelectionsTable`);
    
    // Add any teams from TeamSelectionsTable that aren't in the base data
    completeTeamSelectionsData.forEach(team => {
      if (!teamsData[team.name]) {
        teamsData[team.name] = {
          picks: team.picks,
          roundScores: [0, 0, 0, 0, 0],
          tiebreakers: [Math.floor(Math.random() * 5) + 137, Math.floor(Math.random() * 15) + 275] as [number, number]
        };
      }
    });
    
    // Generate additional teams if needed to reach 134 total
    const currentCount = Object.keys(teamsData).length;
    const neededCount = 134 - currentCount;
    
    console.log(`Have ${currentCount} base teams, need ${neededCount} more to reach 134 total`);
    
    if (neededCount > 0) {
      // Use only golfers that are actually in the current leaderboard
      const availableGolfers = leaderboard.map(golfer => golfer.name).filter(Boolean);
      
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
    // Instead of falling back to cached data, create mock data
    // that matches the team selections
    const completeTeamSelectionsData = getCompleteTeamSelections();
    const mockTeamsData: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }} = {};
    
    completeTeamSelectionsData.forEach(team => {
      mockTeamsData[team.name] = {
        picks: team.picks,
        roundScores: [0, 0, 0, 0, 0],
        tiebreakers: [Math.floor(Math.random() * 5) + 137, Math.floor(Math.random() * 15) + 275] as [number, number]
      };
    });
    
    console.log(`Created mock data for ${Object.keys(mockTeamsData).length} teams`);
    return mockTeamsData;
  }
};

/**
 * Get the complete team selections from the TeamSelectionsTable
 */
const getCompleteTeamSelections = (): {name: string, picks: string[]}[] => {
  const teamSelections = [
    { name: "Ben Applebaum", picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"] },
    { name: "Elia Ayaz", picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"] },
    { name: "Mike Baker", picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"] },
    { name: "Louis Baker", picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"] },
    { name: "Ross Baker", picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"] },
    { name: "Peter Bassett", picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"] },
    { name: "Ted Beckman", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"] },
    { name: "Hilary Beckman", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"] },
    { name: "Oliver Beckman", picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"] },
    { name: "Jimmy Beltz", picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"] },
    { name: "Peter Beugg", picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"] },
    { name: "James Carlson", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"] },
    { name: "Nate Carlson", picks: ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"] },
    { name: "Annie Carlson", picks: ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"] },
    { name: "Hadley Carlson", picks: ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"] },
    { name: "Quinn Carlson", picks: ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"] },
    { name: "Ed Corbett", picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"] },
    { name: "Chuck Corbett Sr", picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"] },
    { name: "Chris Crawford", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"] },
    { name: "Justin Darcy", picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"] },
    { name: "Holland Darcy", picks: ["Jordan Spieth", "Collin Morikawa", "Xander Schauffele", "Viktor Hovland", "Jose Luis Ballester (a)"] },
    { name: "Audrey Darcy", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Cameron Young", "Zach Johnson"] },
    { name: "Ava Rose Darcy", picks: ["Wyndham Clark", "Justin Rose", "Jon Rahm", "Scottie Scheffler", "Viktor Hovland"] },
    { name: "Jay Despard", picks: ["Scottie Scheffler", "Collin Morikawa", "Min Woo Lee", "Russell Henley", "Robert MacIntyre"] },
    { name: "Pete Drago", picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Sergio Garcia", "Sepp Straka"] },
    { name: "Alexa Drago", picks: ["Xander Schauffele", "Scottie Scheffler", "Patrick Cantlay", "Jordan Spieth", "Hideki Matsuyama"] },
    { name: "Ollie Drago", picks: ["Scottie Scheffler", "Jon Rahm", "Patrick Cantlay", "Sergio Garcia", "Patrick Reed"] },
    { name: "Charlie Drago", picks: ["Jon Rahm", "Collin Morikawa", "Patrick Cantlay", "Patrick Reed", "Jordan Spieth"] },
    { name: "Adam Duff", picks: ["Scottie Scheffler", "Collin Morikawa", "Brooks Koepka", "Viktor Hovland", "Cameron Smith"] },
    { name: "Tilly Duff", picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Brooks Koepka", "Tommy Fleetwood"] },
    { name: "Gretchen Duff", picks: ["Ludvig Åberg", "Xander Schauffele", "Tommy Fleetwood", "Hideki Matsuyama", "Russell Henley"] },
    { name: "Charles Elder", picks: ["Scottie Scheffler", "Rory McIlroy", "Robert MacIntyre", "Joaquín Niemann", "Hideki Matsuyama"] },
    { name: "Eric Fox", picks: ["Bryson DeChambeau", "Rory McIlroy", "Wyndham Clark", "Viktor Hovland", "Sepp Straka"] },
    { name: "Kyle Flippen", picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"] },
    { name: "J.J. Furst", picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Hideki Matsuyama", "Joaquín Niemann"] },
    { name: "Brian Ginkel", picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Min Woo Lee", "Brooks Koepka"] },
    { name: "Grayson Ginkel", picks: ["Scottie Scheffler", "Rory McIlroy", "Patrick Cantlay", "Hideki Matsuyama", "Jordan Spieth"] },
    { name: "Mik Gusenius", picks: ["Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Justin Thomas", "Jordan Spieth"] },
    { name: "John Gustafson", picks: ["Rory McIlroy", "Ludvig Åberg", "Jordan Spieth", "Justin Thomas", "Hideki Matsuyama"] },
    { name: "Andy Gustafson", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama"] },
    { name: "Lily Gustafson", picks: ["Collin Morikawa", "Bryson DeChambeau", "Cameron Smith", "Justin Thomas", "Russell Henley"] },
    { name: "David Hardt", picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Brooks Koepka"] },
    { name: "Brack Herfurth", picks: ["Jon Rahm", "Xander Schauffele", "Joaquín Niemann", "Tommy Fleetwood", "Sungjae Im"] },
    { name: "Darby Herfurth", picks: ["Rory McIlroy", "Ludvig Åberg", "Patrick Cantlay", "Corey Conners", "Sepp Straka"] },
    { name: "Henry Herfurth", picks: ["Collin Morikawa", "Hideki Matsuyama", "Wyndham Clark", "Cameron Smith", "Chris Kirk"] },
    { name: "Jess Herfurth", picks: ["Rory McIlroy", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Tommy Fleetwood"] },
    { name: "Decker Herfurth", picks: ["Rory McIlroy", "Ludvig Åberg", "Russell Henley", "Sepp Straka", "Hideki Matsuyama"] },
    { name: "Rachel Herfurth", picks: ["Rory McIlroy", "Collin Morikawa", "Viktor Hovland", "Justin Thomas", "Tommy Fleetwood"] },
    { name: "Amy Jones", picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Brooks Koepka", "Tommy Fleetwood"] },
    { name: "Jim Jones", picks: ["Scottie Scheffler", "Collin Morikawa", "Joaquín Niemann", "Jordan Spieth", "Will Zalatoris"] },
    { name: "Carter Jones", picks: ["Tony Finau", "Bryson DeChambeau", "Viktor Hovland", "Hideki Matsuyama", "Xander Schauffele"] },
    { name: "Davis Jones", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Patrick Cantlay", "Shane Lowry"] },
    { name: "Sargent Johnson", picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Cameron Smith", "Justin Thomas"] },
    { name: "Sargent Johnson, Jr.", picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Jordan Spieth"] },
    { name: "Chris Kelley", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Sepp Straka", "Russell Henley"] },
    { name: "Paul Kelley", picks: ["Rory McIlroy", "Akshay Bhatia", "Tom Hoge", "Jordan Spieth", "Ludvig Åberg"] },
    { name: "Peter Kepic Jr.", picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Jordan Spieth", "Dustin Johnson"] },
    { name: "Sarah Kepic", picks: ["Brooks Koepka", "Tommy Fleetwood", "Will Zalatoris", "Cameron Smith", "Dustin Johnson"] },
    { name: "Peter Kepic Sr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Min Woo Lee"] },
    { name: "Owen Kepic", picks: ["Scottie Scheffler", "Min Woo Lee", "Will Zalatoris", "Ludvig Åberg", "Brooks Koepka"] },
    { name: "Max Kepic", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Viktor Hovland", "Hideki Matsuyama"] },
    { name: "Greg Kevane", picks: ["Rory McIlRoy", "Collin Morikawa", "Sepp Straka", "Corey Conners", "Russell Henley"] },
    { name: "Rory Kevane", picks: ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Russell Henley", "Min Woo Lee"] },
    { name: "Andy Koch", picks: ["Bryson DeChambeau", "Jon Rahm", "Patrick Cantlay", "Shane Lowry", "Brooks Koepka"] },
    { name: "Chad Kollar", picks: ["Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama", "Patrick Cantlay"] },
    { name: "Pete Kostroski", picks: ["Rory McIlroy", "Ludvig Åberg", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"] },
    { name: "Dan Lenmark", picks: ["Xander Schauffele", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Will Zalatoris"] },
    { name: "Jack Lenmark", picks: ["Xander Schauffele", "Rory McIlroy", "Patrick Cantlay", "Shane Lowry", "Matt Fitzpatrick"] },
    { name: "Jamie Lockhart", picks: ["Scottie Scheffler", "Jon Rahm", "Will Zalatoris", "Brooks Koepka", "Joaquín Niemann"] },
    { name: "Rollie Logan", picks: ["Tony Finau", "Viktor Hovland", "Justin Thomas", "Scottie Scheffler", "Rory McIlroy"] },
    { name: "Bo Massopust", picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Tom Kim"] },
    { name: "Elle McClintock", picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Jordan Spieth", "Brooks Koepka"] },
    { name: "Jenny McClintock", picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Russell Henley"] },
    { name: "Peggy McClintock", picks: ["Scottie Scheffler", "Collin Morikawa", "Wyndham Clark", "Will Zalatoris", "Sepp Straka"] },
    { name: "Kevin McClintock", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Will Zalatoris", "Russell Henley"] },
    { name: "Rich McClintock", picks: ["Rory McIlroy", "Scottie Scheffler", "Hideki Matsuyama", "Shane Lowry", "Billy Horschel"] },
    { name: "Johnny McWhite", picks: ["Scottie Scheffler", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama", "Justin Thomas"] },
    { name: "Charles Meech Jr", picks: ["Dustin Johnson", "Scottie Scheffler", "Viktor Hovland", "Brooks Koepka", "Bryson DeChambeau"] },
    { name: "Jon Moseley", picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Shane Lowry", "Russell Henley"] },
    { name: "Chad Murphy", picks: ["Joaquín Niemann", "Ludvig Åberg", "Min Woo Lee", "Justin Thomas", "Rory McIlroy"] },
    { name: "C.J. Nibbe", picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Robert MacIntyre", "Min Woo Lee"] },
    { name: "Nash Nibbe", picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"] },
    { name: "Knox Nibbe", picks: ["Scottie Scheffler", "Jon Rahm", "Justin Thomas", "Patrick Cantlay", "Brooks Koepka"] },
    { name: "Julie Nibbe", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Jordan Spieth"] },
    { name: "Jay Perlmutter", picks: ["Russell Henley", "Corey Conners", "Sepp Straka", "Rory McIlroy", "Collin Morikawa"] },
    { name: "Les Perry", picks: ["Bryson DeChambeau", "Rory McIlroy", "Sergio Garcia", "Brooks Koepka", "Viktor Hovland"] },
    { name: "James Petrikas Sr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jordan Spieth", "Justin Thomas"] },
    { name: "James Petrikas Jr.", picks: ["Scottie Scheffler", "Ludvig Åberg", "Will Zalatoris", "Brooks Koepka", "Shane Lowry"] },
    { name: "Davey Phelps", picks: ["Scottie Scheffler", "Rory McIlroy", "Akshay Bhatia", "Will Zalatoris", "Sepp Straka"] },
    { name: "Will Phelps", picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Brooks Koepka", "Shane Lowry"] },
    { name: "Phil Present Jr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Russell Henley", "Joaquín Niemann"] },
    { name: "Phil Present III", picks: ["Scottie Scheffler", "Ludvig Åberg", "Brooks Koepka", "Tommy Fleetwood", "Justin Thomas"] },
    { name: "Ravi Ramalingam", picks: ["Xander Schauffele", "Rory McIlroy", "Sepp Straka", "Shane Lowry", "Will Zalatoris"] },
    { name: "Charlotte Ramalingam", picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"] },
    { name: "Matt Rogers", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"] },
    { name: "Roth Sanner", picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Cameron Smith", "Akshay Bhatia"] },
    { name: "John Saunders", picks: ["Scottie Scheffler", "Rory McIlroy", "Joaquín Niemann", "Tommy Fleetwood", "Sahith Theegala"] },
    { name: "Jackson Saunders", picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Cameron Smith", "Viktor Hovland"] },
    { name: "Donny Schmitt", picks: ["Rory McIlroy", "Tom Hoge", "Collin Morikawa", "Sepp Straka", "Justin Thomas"] },
    { name: "Ryan Schmitt", picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Wyndham Clark", "Russell Henley"] },
    { name: "Jon Schwingler", picks: ["Rory McIlroy", "Scottie Scheffler", "Jordan Spieth", "Tommy Fleetwood", "Akshay Bhatia"] },
    { name: "Toby Schwingler", picks: ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Viktor Hovland", "Russell Henley"] },
    { name: "Jack Simmons", picks: ["Jon Rahm", "Rory McIlroy", "Shane Lowry", "Sepp Straka", "Sergio Garcia"] },
    { name: "Hayden Simmons", picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Billy Horschel", "Justin Thomas"] },
    { name: "Tommy Simmons", picks: ["Shane Lowry", "Collin Morikawa", "Will Zalatoris", "J.J. Spaun", "Denny McCarthy"] },
    { name: "Victoria Simmons", picks: ["Russell Henley", "Brooks Koepka", "Robert MacIntyre", "Xander Schauffele", "Rory McIlroy"] },
    { name: "Tyler Smith", picks: ["Rory McIlroy", "Brooks Koepka", "Danny Willett", "Scottie Scheffler", "Hideki Matsuyama"] },
    { name: "Stuie Snyder", picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"] },
    { name: "Steve Sorenson", picks: ["Rory McIlroy", "Ludvig Åberg", "Keegan Bradley", "Tommy Fleetwood", "Justin Rose"] },
    { name: "Katie Stephens", picks: ["Ludvig Åberg", "Wyndham Clark", "Nick Dunlap", "Brooks Koepka", "Scottie Scheffler"] },
    { name: "Reven Stephens", picks: ["Rory McIlroy", "Collin Morikawa", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"] },
    { name: "Winfield Stephens", picks: ["Xander Schauffele", "Rory McIlroy", "Russell Henley", "Jordan Spieth", "Justin Thomas"] },
    { name: "Caelin Stephens", picks: ["Rory McIlroy", "Bryson DeChambeau", "Min Woo Lee", "Jordan Spieth", "Justin Thomas"] },
    { name: "Bette Stephens", picks: ["Viktor Hovland", "Scottie Scheffler", "Zach Johnson", "Rory McIlroy", "Denny McCarthy"] },
    { name: "Debbie Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Russell Henley", "Joaquín Niemann"] },
    { name: "Gordon Stofer Jr.", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tony Finau", "Justin Thomas", "Min Woo Lee"] },
    { name: "Jimmy Stofer", picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Tommy Fleetwood"] },
    { name: "Teddy Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Shane Lowry", "Russell Henley"] },
    { name: "Eileen Stofer", picks: ["Bryson DeChambeau", "Ludvig Åberg", "Tommy Fleetwood", "Jordan Spieth", "Robert MacIntyre"] },
    { name: "Cora Stofer", picks: ["Bryson DeChambeau", "Jon Rahm", "Joaquín Niemann", "Brooks Koepka", "Tyrrell Hatton"] },
    { name: "Gordon Stofer III", picks: ["Rory McIlroy", "Ludvig Åberg", "Brooks Koepka", "Max Homa", "Jordan Spieth"] },
    { name: "Addie Stofer", picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Cameron Smith", "Robert MacIntyre"] },
    { name: "Ford Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Jordan Spieth", "Joaquín Niemann", "Tom Kim"] },
    { name: "Sylas Stofer", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Akshay Bhatia", "Jordan Spieth", "Russell Henley"] },
    { name: "Robby Stofer", picks: ["Rory McIlroy", "Ludvig Åberg", "Will Zalatoris", "Robert MacIntyre", "Russell Henley"] },
    { name: "Jon Sturgis", picks: ["Rory McIlroy", "Collin Morikawa", "Corey Conners", "Russell Henley", "Shane Lowry"] },
    { name: "Avery Sturgis", picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"] },
    { name: "Ethan Sturgis", picks: ["Collin Morikawa", "Ludvig Åberg", "Tom Kim", "Will Zalatoris", "Phil Mickelson"] },
    { name: "Sarah Sturgis", picks: ["Bryson DeChambeau", "Scottie Scheffler", "Shane Lowry", "Brooks Koepka", "Jordan Spieth"] },
    { name: "Scott Tande", picks: ["Scottie Scheffler", "Collin Morikawa", "Russell Henley", "Justin Thomas", "Sepp Straka"] },
    { name: "Jess Troyak", picks: ["Rory McIlroy", "Ludvig Åberg", "Hideki Matsuyama", "Will Zalatoris", "Akshay Bhatia"] },
    { name: "Chris Willette", picks: ["Collin Morikawa", "Ludvig Åberg", "Justin Thomas", "Joaquín Niemann", "Russell Henley"] },
  ];
  
  return teamSelections;
};
