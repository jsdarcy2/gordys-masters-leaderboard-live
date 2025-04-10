
import { GolferScore } from "@/types";

export const getScoreClass = (score: number) => {
  if (score < 0) return "text-masters-green font-bold";
  if (score > 0) return "text-red-600";
  return "text-black";
};

export const formatScore = (score: number | string) => {
  if (typeof score === 'string') {
    score = parseFloat(score);
    if (isNaN(score)) return "E";
  }
  
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : score.toString();
};

export const formatLastUpdated = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Configuration for the pool prize distribution
export const POOL_CONFIG = {
  entryFee: 25, // $25 per entry
  estimatedEntrants: 120, // Estimated number of participants
  prizeTiers: [
    { position: 1, percentage: 0.7 }, // 70% to 1st place
    { position: 2, percentage: 0.2 }, // 20% to 2nd place
    { position: 3, percentage: 0.1 }  // 10% to 3rd place
  ]
};

export const calculatePotentialWinnings = (position: number) => {
  const totalPrizePool = POOL_CONFIG.entryFee * POOL_CONFIG.estimatedEntrants;
  
  const prizeTier = POOL_CONFIG.prizeTiers.find(tier => tier.position === position);
  
  if (prizeTier) {
    const winnings = totalPrizePool * prizeTier.percentage;
    return winnings.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else {
    return "0";
  }
};

export const getWinnerTooltip = (position: number) => {
  const prizeTier = POOL_CONFIG.prizeTiers.find(tier => tier.position === position);
  if (!prizeTier) return "";

  const totalPrizePool = POOL_CONFIG.entryFee * POOL_CONFIG.estimatedEntrants;
  const winnings = totalPrizePool * prizeTier.percentage;
  const percentage = prizeTier.percentage * 100;

  return `${percentage}% of pool: $${winnings.toLocaleString()}`;
};
