
/**
 * Format the last updated timestamp into a readable string
 */
export const formatLastUpdated = (timestamp: string): string => {
  if (!timestamp) return "Just now";
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return "Just now";
  }
};

/**
 * Map position to CSS class for score display
 */
export const getScoreClass = (score: number | undefined): string => {
  if (score === undefined) return "text-gray-500";
  if (score < 0) return "text-green-600 font-medium"; // Under par - good
  if (score > 0) return "text-red-500"; // Over par - bad
  return "text-gray-700"; // Even par
};

/**
 * Format golf score with appropriate indicator
 */
export const formatScore = (score: number | undefined): string => {
  if (score === undefined) return "-";
  if (score === 0) return "E";
  if (score < 0) return score.toString();
  return `+${score}`;
};

/**
 * Format golf score for display, handling edge cases
 * In golf, negative numbers are GOOD (under par)
 * Positive numbers are BAD (over par)
 */
export const formatGolfScore = (score: number | string | undefined): string => {
  if (score === undefined || score === null) return "-";
  
  if (typeof score === "string") {
    if (score === "E") return "E";
    if (score === "-") return "-";
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return "-";
    if (numericScore === 0) return "E";
    if (numericScore < 0) return numericScore.toString();
    return `+${numericScore}`;
  }
  
  if (isNaN(score)) return "-";
  if (score === 0) return "E";
  if (score < 0) return score.toString();
  return `+${score}`;
};

/**
 * Get Masters prize money amount based on position
 * Uses realistic Masters purse distribution percentages
 */
export const getMastersPurseAmount = (position: number): string => {
  const totalPurse = 15000000; // $15 million total purse
  
  // Prize money distribution percentages based on position
  const prizePercentages: Record<number, number> = {
    1: 0.18, // 18% for winner
    2: 0.108, // 10.8% for runner-up
    3: 0.068, // 6.8% for 3rd
    4: 0.048, // 4.8% for 4th
    5: 0.04, // 4% for 5th
    6: 0.036,
    7: 0.0335,
    8: 0.031,
    9: 0.029,
    10: 0.027,
    11: 0.025,
    12: 0.023,
    13: 0.021,
    14: 0.019,
    15: 0.018,
    16: 0.017,
    17: 0.016,
    18: 0.0155,
    19: 0.015,
    20: 0.0145
  };
  
  // Calculate prize amount based on position
  if (position in prizePercentages) {
    const amount = totalPurse * prizePercentages[position];
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else if (position <= 30) {
    // Scale down for positions 21-30
    const amount = totalPurse * (0.014 - (position - 20) * 0.0005);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else if (position <= 50) {
    // Scale down for positions 31-50
    const amount = totalPurse * (0.009 - (position - 30) * 0.0002);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  // Return a small amount for positions beyond 50
  return "10,000";
};

/**
 * Validate the leaderboard data
 */
export const validateLeaderboardData = (data: any): boolean => {
  if (!data) return false;
  if (!Array.isArray(data.leaderboard)) return false;
  if (data.leaderboard.length === 0) return false;
  
  // Less strict validation to allow for partial data
  return (
    typeof data.leaderboard[0] === 'object' &&
    data.leaderboard[0] !== null
  );
};

/**
 * Determine if a current score is under par, even, or over par
 * Used for displaying score colors consistently
 */
export const getScoreStatus = (score: number | undefined): 'under-par' | 'even-par' | 'over-par' => {
  if (score === undefined || score === null) return 'even-par';
  if (score < 0) return 'under-par';
  if (score > 0) return 'over-par';
  return 'even-par';
};

/**
 * Get probability of winning based on position and score
 * Useful for betting interfaces
 */
export const getWinProbability = (position: number, round: number): number => {
  // Historical probabilities (simplified)
  const roundProbabilities: Record<number, Record<number, number>> = {
    1: { // After round 1
      1: 0.19, 2: 0.12, 3: 0.09, 5: 0.05, 10: 0.02
    },
    2: { // After round 2
      1: 0.35, 2: 0.20, 3: 0.12, 5: 0.06, 10: 0.01
    },
    3: { // After round 3
      1: 0.54, 2: 0.24, 3: 0.10, 5: 0.03, 10: 0.005
    },
    4: { // During final round
      1: 0.75, 2: 0.18, 3: 0.05, 5: 0.01, 10: 0.001
    }
  };
  
  // Default to round 4 if not specified
  const roundData = roundProbabilities[round] || roundProbabilities[4];
  
  // Find the closest key in our probability table
  const positions = Object.keys(roundData).map(Number).sort((a, b) => a - b);
  let closestPosition = positions[0];
  
  for (const pos of positions) {
    if (position <= pos) {
      closestPosition = pos;
      break;
    }
    closestPosition = pos;
  }
  
  return roundData[closestPosition] || 0;
};
