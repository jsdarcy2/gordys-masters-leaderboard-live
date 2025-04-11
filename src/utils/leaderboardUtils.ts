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

// Format a golf score to show proper golf notation (e.g. -3, +2, E)
export const formatGolfScore = (score: number): string => {
  if (score === 0) return 'E'; // Even par
  if (score > 0) return `+${score}`; // Over par
  return score.toString(); // Under par (already has the minus sign)
};

// Configuration for the Masters pool prize distribution
export const POOL_CONFIG = {
  entryFee: 25, // $25 per entry
  estimatedEntrants: 120, // Estimated number of participants
  prizeTiers: [
    { position: 1, percentage: 0.7 }, // 70% to 1st place
    { position: 2, percentage: 0.2 }, // 20% to 2nd place
    { position: 3, percentage: 0.1 }  // 10% to 3rd place
  ]
};

// Official Masters Tournament purse for 2025
// Based on 2024 purse of $20,000,000 with a 5% increase
export const MASTERS_PURSE = {
  totalPurse: 21000000, // $21 million
  payouts: [
    { position: 1, amount: 3780000 }, // Winner (18% of purse)
    { position: 2, amount: 2268000 }, // Runner-up
    { position: 3, amount: 1428000 },
    { position: 4, amount: 1008000 },
    { position: 5, amount: 840000 },
    { position: 6, amount: 756000 },
    { position: 7, amount: 703500 },
    { position: 8, amount: 651000 },
    { position: 9, amount: 609000 },
    { position: 10, amount: 567000 },
    { position: 11, amount: 525000 },
    { position: 12, amount: 483000 },
    { position: 13, amount: 441000 },
    { position: 14, amount: 399000 },
    { position: 15, amount: 378000 },
    { position: 16, amount: 357000 },
    { position: 17, amount: 336000 },
    { position: 18, amount: 315000 },
    { position: 19, amount: 294000 },
    { position: 20, amount: 273000 },
    // Lower positions
    { position: 21, amount: 252000 },
    { position: 22, amount: 233100 },
    { position: 23, amount: 216300 },
    { position: 24, amount: 199500 },
    { position: 25, amount: 182700 },
    { position: 26, amount: 165900 },
    { position: 27, amount: 159600 },
    { position: 28, amount: 153300 },
    { position: 29, amount: 147000 },
    { position: 30, amount: 140700 },
    // Amounts for positions 31-50 follow the same decreasing pattern
    { position: 31, amount: 134400 },
    { position: 32, amount: 128100 },
    { position: 33, amount: 121800 },
    { position: 34, amount: 116550 },
    { position: 35, amount: 111300 },
    { position: 36, amount: 106050 },
    { position: 37, amount: 100800 },
    { position: 38, amount: 96600 },
    { position: 39, amount: 92400 },
    { position: 40, amount: 88200 },
    { position: 41, amount: 84000 },
    { position: 42, amount: 79800 },
    { position: 43, amount: 75600 },
    { position: 44, amount: 71400 },
    { position: 45, amount: 67200 },
    { position: 46, amount: 63000 },
    { position: 47, amount: 58800 },
    { position: 48, amount: 55650 },
    { position: 49, amount: 52500 },
    { position: 50, amount: 50925 }
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

export const getMastersPurseAmount = (position: number): string => {
  const payout = MASTERS_PURSE.payouts.find(prize => prize.position === position);
  
  if (payout) {
    return payout.amount.toLocaleString();
  } else if (position > 50) {
    return "0"; // No prize money for positions beyond 50
  } else {
    // If position not found but is <= 50, show an estimate
    return "TBD";
  }
};

export const getWinnerTooltip = (position: number) => {
  const prizeTier = POOL_CONFIG.prizeTiers.find(tier => tier.position === position);
  const mastersPrize = MASTERS_PURSE.payouts.find(prize => prize.position === position);
  
  if (!prizeTier) return "";

  const totalPrizePool = POOL_CONFIG.entryFee * POOL_CONFIG.estimatedEntrants;
  const poolWinnings = totalPrizePool * prizeTier.percentage;
  const percentage = prizeTier.percentage * 100;
  
  let tooltip = `${percentage}% of pool: $${poolWinnings.toLocaleString()}`;
  
  // Add Masters Tournament purse information if available
  if (mastersPrize) {
    tooltip += `\nMasters Prize: $${mastersPrize.amount.toLocaleString()}`;
  }
  
  return tooltip;
};
