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

/**
 * Generate emergency mock pool standings data as a last resort
 */
export const generateEmergencyPoolStandings = (count: number = 20): PoolParticipant[] => {
  const standings: PoolParticipant[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = generateParticipantName(i);
    const totalScore = 270 + Math.floor(Math.random() * 30); // Random score between 270 and 300
    const position = i + 1;
    
    // Generate 4 random golfer picks
    const picks = [
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
    ].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Generate random pick scores
    const pickScores: {[golferName: string]: number} = {};
    picks.forEach(golfer => {
      pickScores[golfer] = 65 + Math.floor(Math.random() * 15); // Random score between 65 and 80
    });
    
    standings.push({
      name,
      position,
      totalScore,
      totalPoints: -totalScore, // Inverse for compatibility (higher is better)
      picks,
      pickScores,
      tiebreaker1: 280 + Math.floor(Math.random() * 20) - 10, // Random tiebreaker1 around 280
      tiebreaker2: 140 + Math.floor(Math.random() * 10) - 5, // Random tiebreaker2 around 140
      paid: Math.random() > 0.2 // 80% chance of having paid
    });
  }
  
  // Sort by position
  standings.sort((a, b) => a.position - b.position);
  
  return standings;
};
