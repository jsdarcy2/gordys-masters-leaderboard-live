
import { GolferScore, PoolParticipant } from "@/types";

/**
 * Calculate a participant's total score based on their best 4 golfer scores
 */
export const calculateTotalScore = (
  pickScores: Record<string, number>
): number => {
  // Get the 4 best scores out of 5 (lowest numbers are better in golf)
  const sortedScores = Object.values(pickScores).sort((a, b) => a - b);
  const bestFourScores = sortedScores.slice(0, 4);
  
  // Sum the best 4 scores
  return bestFourScores.reduce((sum, score) => sum + score, 0);
};

/**
 * Build a map of golfer names to their current scores
 */
export const buildGolferScoreMap = (leaderboard: GolferScore[]): Record<string, number> => {
  const golferScores: Record<string, number> = {};
  leaderboard.forEach(golfer => {
    golferScores[golfer.name] = golfer.score;
  });
  return golferScores;
};

/**
 * Calculate scores for all participants and sort by total score
 */
export const calculatePoolStandings = (
  selectionsData: Record<string, { picks: string[] }>,
  golferScores: Record<string, number>
): PoolParticipant[] => {
  const poolParticipants: PoolParticipant[] = [];
  
  // Process each participant's picks
  Object.entries(selectionsData).forEach(([name, data]) => {
    // Initialize pickScores object
    const pickScores: Record<string, number> = {};
    
    // Calculate scores for each pick
    data.picks.forEach(golferName => {
      // Get current score for this golfer (or 0 if not found)
      const golferScore = golferScores[golferName] !== undefined ? golferScores[golferName] : 0;
      pickScores[golferName] = golferScore;
    });
    
    // Calculate total from best 4 scores
    const totalScore = calculateTotalScore(pickScores);
    
    // Add this participant to the pool
    poolParticipants.push({
      position: 0, // Will be calculated after sorting
      name: name,
      totalScore: totalScore,
      totalPoints: totalScore, // For compatibility
      paid: Math.random() > 0.1, // 90% chance of being paid
      picks: data.picks,
      pickScores: pickScores,
      bestFourTotal: totalScore
    });
  });
  
  // Sort by total score (lowest/best score first, golf scoring)
  poolParticipants.sort((a, b) => a.totalScore - b.totalScore);
  
  // Update positions based on the sorted order
  poolParticipants.forEach((participant, index) => {
    participant.position = index + 1;
  });
  
  return poolParticipants;
};
