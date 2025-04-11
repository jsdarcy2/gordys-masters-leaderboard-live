
import { PoolParticipant } from "@/types";

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
 */
export const calculatePoolStandings = (
  selectionsData: {[participant: string]: { picks: string[], roundScores: number[], tiebreakers: [number, number] }},
  golferScores: Record<string, number>
): PoolParticipant[] => {
  const standings: PoolParticipant[] = [];
  
  // Process each participant
  Object.entries(selectionsData).forEach(([name, data]) => {
    // Calculate total score from their picks
    const totalScore = data.roundScores.reduce((sum, score) => sum + score, 0);
    
    // Create pick scores map
    const pickScores: {[golferName: string]: number} = {};
    data.picks.forEach((golfer, index) => {
      pickScores[golfer] = data.roundScores[index];
    });
    
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
      paid: true // Assume all participants have paid for simplicity
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
  standings.forEach((participant, index) => {
    participant.position = index + 1;
  });
  
  return standings;
};
