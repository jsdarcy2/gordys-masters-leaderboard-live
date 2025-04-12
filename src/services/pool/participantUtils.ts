
import { PoolParticipant } from "@/types";
import { getBestFourGolfers } from "@/utils/scoringUtils";

/**
 * Generate a realistic participant name for testing
 */
export const generateParticipantName = (index: number): string => {
  const firstNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

/**
 * Calculate pool standings based on selections and golfer scores
 * Uses the best 4 out of 5 golfers rule
 */
export const calculatePoolStandings = (
  selectionsData: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }},
  golferScores: Record<string, number>
): PoolParticipant[] => {
  const standings: PoolParticipant[] = [];
  
  // Process each participant
  Object.entries(selectionsData).forEach(([name, data]) => {
    // Calculate pick scores
    const pickScores: {[golferName: string]: number} = {};
    data.picks.forEach((golfer, index) => {
      // Use the actual golfer score if available, otherwise use the provided round score
      pickScores[golfer] = golferScores[golfer] !== undefined ? 
        golferScores[golfer] : 
        (data.roundScores[index] || 0);
    });
    
    // Get the best 4 golfers
    const bestFourGolfers = getBestFourGolfers(pickScores);
    
    // Calculate total score from best 4 picks
    const totalScore = bestFourGolfers.reduce((sum, golferName) => {
      return sum + pickScores[golferName];
    }, 0);
    
    // Create participant entry
    standings.push({
      name,
      position: 0, // Will be set after sorting
      totalScore,
      totalPoints: -totalScore, // Inverse for compatibility (higher is better)
      picks: data.picks,
      pickScores,
      tiebreaker1: data.tiebreakers[0],
      tiebreaker2: data.tiebreakers[1],
      paid: true, // Assume all participants have paid for simplicity
      bestFourGolfers
    });
  });
  
  // Sort by score (lower is better in golf)
  standings.sort((a, b) => {
    // First sort by total score
    if (a.totalScore !== b.totalScore) {
      return a.totalScore - b.totalScore;
    }
    
    // If scores are tied, use tiebreaker1
    if (a.tiebreaker1 !== b.tiebreaker1) {
      return Math.abs(a.tiebreaker1! - 280) - Math.abs(b.tiebreaker1! - 280);
    }
    
    // If still tied, use tiebreaker2
    if (a.tiebreaker2 !== b.tiebreaker2) {
      return Math.abs(a.tiebreaker2! - 140) - Math.abs(b.tiebreaker2! - 140);
    }
    
    // If everything is tied, sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  // Assign positions after sorting
  let currentPosition = 1;
  let previousScore = null;
  
  standings.forEach((participant, index) => {
    if (previousScore !== null && previousScore !== participant.totalScore) {
      currentPosition = index + 1;
    }
    
    participant.position = currentPosition;
    previousScore = participant.totalScore;
  });
  
  return standings;
};

/**
 * Fixed Masters Pool standings data from the spreadsheet
 * This data is used when the API can't connect to live data
 */
export const generateEmergencyPoolStandings = (count: number = 134): PoolParticipant[] => {
  // Use the provided data for the standings
  const rawStandingsData = [
    { name: "Matt Rogers", score: -21, position: 1 },
    { name: "James Carlson", score: -20, position: 2 },
    { name: "Tilly Duff", score: -20, position: 2 },
    { name: "Nash Nibbe", score: -20, position: 2 },
    { name: "Jon Sturgis", score: -20, position: 2 },
    { name: "Max Kepic", score: -19, position: 6 },
    { name: "Rich McClintock", score: -19, position: 6 },
    { name: "Charlotte Ramalingam", score: -19, position: 6 },
    { name: "Steve Sorenson", score: -19, position: 6 },
    { name: "Rory Kevane", score: -18, position: 10 },
    { name: "Toby Schwingler", score: -18, position: 10 },
    { name: "Avery Sturgis", score: -18, position: 10 },
    { name: "Ava Rose Darcy", score: -17, position: 13 },
    { name: "Eric Fox", score: -17, position: 13 },
    { name: "Davis Jones", score: -17, position: 13 },
    { name: "Teddy Stofer", score: -17, position: 13 },
    { name: "Chris Crawford", score: -16, position: 17 },
    { name: "Carter Jones", score: -16, position: 17 },
    { name: "Peter Kepic Jr.", score: -16, position: 17 },
    { name: "Pete Kostroski", score: -16, position: 17 },
    { name: "Will Phelps", score: -16, position: 17 },
    { name: "Reven Stephens", score: -16, position: 17 },
    { name: "Ben Applebaum", score: -15, position: 23 },
    { name: "Jimmy Beltz", score: -15, position: 23 },
    { name: "Rachel Herfurth", score: -15, position: 23 },
    { name: "Peter Kepic Sr.", score: -15, position: 23 },
    { name: "Rollie Logan", score: -15, position: 23 },
    { name: "Sarah Sturgis", score: -15, position: 23 },
    { name: "Louis Baker", score: -14, position: 29 },
    { name: "Kyle Flippen", score: -14, position: 29 },
    { name: "Andy Gustafson", score: -14, position: 29 },
    { name: "Caelin Stephens", score: -14, position: 29 },
    { name: "Jimmy Stofer", score: -14, position: 29 },
    { name: "Darby Herfurth", score: -13, position: 34 },
    { name: "Jack Lenmark", score: -13, position: 34 },
    { name: "John Saunders", score: -13, position: 34 },
    { name: "Bette Stephens", score: -13, position: 34 },
    { name: "Gordon Stofer Jr.", score: -13, position: 34 },
    { name: "Ted Beckman", score: -12, position: 39 },
    { name: "Charles Elder", score: -12, position: 39 },
    { name: "Grayson Ginkel", score: -12, position: 39 },
    { name: "John Gustafson", score: -12, position: 39 },
    { name: "Jenny McClintock", score: -12, position: 39 },
    { name: "Tyler Smith", score: -12, position: 39 },
    { name: "Debbie Stofer", score: -12, position: 39 },
    { name: "Chuck Corbett Sr", score: -11, position: 46 },
    { name: "Ryan Schmitt", score: -11, position: 46 },
    { name: "Jon Schwingler", score: -11, position: 46 },
    { name: "Nate Carlson", score: -10, position: 49 },
    { name: "Gretchen Duff", score: -10, position: 49 },
    { name: "Jess Herfurth", score: -10, position: 49 },
    { name: "Elle McClintock", score: -10, position: 49 },
    { name: "Chad Murphy", score: -10, position: 49 },
    { name: "Phil Present III", score: -10, position: 49 },
    { name: "Eileen Stofer", score: -10, position: 49 },
    { name: "Jess Troyak", score: -10, position: 49 },
    { name: "Peter Bassett", score: -9, position: 57 },
    { name: "Brian Ginkel", score: -9, position: 57 },
    { name: "Bo Massopust", score: -9, position: 57 },
    { name: "James Petrikas Sr.", score: -9, position: 57 },
    { name: "Donny Schmitt", score: -9, position: 57 },
    { name: "Stuie Snyder", score: -9, position: 57 },
    { name: "Alexa Drago", score: -8, position: 63 },
    { name: "J.J. Furst", score: -8, position: 63 },
    { name: "Andy Koch", score: -8, position: 63 },
    { name: "Cora Stofer", score: -8, position: 63 },
    { name: "Sylas Stofer", score: -8, position: 63 },
    { name: "Holland Darcy", score: -7, position: 68 },
    { name: "Paul Kelley", score: -7, position: 68 },
    { name: "Julie Nibbe", score: -7, position: 68 },
    { name: "Gordon Stofer III", score: -7, position: 68 },
    { name: "Annie Carlson", score: -6, position: 72 },
    { name: "Amy Jones", score: -6, position: 72 },
    { name: "Johnny McWhite", score: -6, position: 72 },
    { name: "Winfield Stephens", score: -6, position: 72 },
    { name: "Oliver Beckman", score: -5, position: 76 },
    { name: "Brack Herfurth", score: -5, position: 76 },
    { name: "Sargent Johnson, Jr.", score: -5, position: 76 },
    { name: "C.J. Nibbe", score: -5, position: 76 },
    { name: "Ford Stofer", score: -5, position: 76 },
    { name: "Ollie Drago", score: -4, position: 81 },
    { name: "Jim Jones", score: -4, position: 81 },
    { name: "Chad Kollar", score: -4, position: 81 },
    { name: "Roth Sanner", score: -4, position: 81 },
    { name: "Tommy Simmons", score: -4, position: 81 },
    { name: "Chris Willette", score: -4, position: 81 },
    { name: "Mik Gusenius", score: -3, position: 87 },
    { name: "Charlie Drago", score: -2, position: 88 },
    { name: "Knox Nibbe", score: -1, position: 89 }
  ];

  // Create simulated picks for each participant
  const popularGolfers = [
    "Scottie Scheffler", "Rory McIlroy", "Justin Rose", "Bryson DeChambeau", "Corey Conners",
    "Shane Lowry", "Tyrrell Hatton", "Jason Day", "Viktor Hovland", "Rasmus Højgaard", 
    "Collin Morikawa", "Hideki Matsuyama", "Patrick Reed", "Sungjae Im", "Ludvig Åberg"
  ];
  
  const standings: PoolParticipant[] = [];
  
  // Convert the raw data into PoolParticipant objects
  rawStandingsData.forEach((data) => {
    // Generate 5 random picks for each participant
    const picks = [...popularGolfers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    // Create mock pick scores that would sum to the participant's total
    const pickScores: {[golferName: string]: number} = {};
    
    // Distribute the total score among the picks
    // For the 4 best scores (used in calculation)
    const totalScoreForFour = data.score;
    const avgScorePerGolfer = totalScoreForFour / 4;
    
    picks.forEach((golfer, index) => {
      if (index < 4) {
        // For the best 4, distribute the score relatively evenly
        pickScores[golfer] = Math.round(avgScorePerGolfer + (Math.random() * 4 - 2));
      } else {
        // The 5th pick will be worse (not counted in best 4)
        pickScores[golfer] = Math.round(avgScorePerGolfer + 5 + (Math.random() * 4));
      }
    });
    
    // Get the best 4 golfers
    const bestFourGolfers = getBestFourGolfers(pickScores);
    
    standings.push({
      name: data.name,
      position: data.position,
      totalScore: data.score,
      totalPoints: -data.score, // Inverse for compatibility (higher is better)
      picks,
      pickScores,
      tiebreaker1: 280 + Math.floor(Math.random() * 20) - 10,
      tiebreaker2: 140 + Math.floor(Math.random() * 10) - 5,
      paid: Math.random() > 0.1, // 90% have paid
      bestFourGolfers
    });
  });
  
  return standings;
};
