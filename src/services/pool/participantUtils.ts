
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
 * Generate emergency mock pool standings data as a last resort
 * Following the best 4 out of 5 rule
 */
export const generateEmergencyPoolStandings = (count: number = 134): PoolParticipant[] => {
  const standings: PoolParticipant[] = [];
  
  const popularGolfers = [
    "Scottie Scheffler", 
    "Rory McIlroy", 
    "Jon Rahm", 
    "Brooks Koepka",
    "Dustin Johnson",
    "Justin Thomas",
    "Bryson DeChambeau",
    "Jordan Spieth",
    "Tiger Woods",
    "Collin Morikawa"
  ];
  
  for (let i = 0; i < count; i++) {
    const name = generateParticipantName(i);
    const position = i + 1;
    
    // Generate 5 random golfer picks
    const picks = [...popularGolfers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    // Generate random pick scores (in golf, lower is better)
    const pickScores: {[golferName: string]: number} = {};
    picks.forEach(golfer => {
      // Scores range from +65 to +80
      pickScores[golfer] = 65 + Math.floor(Math.random() * 15);
    });
    
    // Determine best 4 golfers
    const bestFourGolfers = getBestFourGolfers(pickScores);
    
    // Calculate total score from best 4 picks
    const totalScore = bestFourGolfers.reduce((sum, golferName) => {
      return sum + pickScores[golferName];
    }, 0);
    
    standings.push({
      name,
      position,
      totalScore,
      totalPoints: -totalScore, // Inverse for compatibility (higher is better)
      picks,
      pickScores,
      tiebreaker1: 280 + Math.floor(Math.random() * 20) - 10, // Random tiebreaker1 around 280
      tiebreaker2: 140 + Math.floor(Math.random() * 10) - 5, // Random tiebreaker2 around 140
      paid: Math.random() > 0.2, // 80% chance of having paid
      bestFourGolfers
    });
  }
  
  // Sort by total score
  standings.sort((a, b) => a.totalScore - b.totalScore);
  
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
