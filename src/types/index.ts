import { ReactNode } from "react";

// Masters tournament data types
export type GolferScore = {
  position: number;
  name: string;
  score: number;
  today: number;
  thru: string | number;
  strokes?: number;
  status?: 'cut' | 'active' | 'withdrawn';
  round1?: number;  // Thursday scores
  round2?: number;  // Friday scores
  round3?: number;  // Saturday scores
  round4?: number;  // Sunday scores
}

export interface PoolParticipant {
  name: string;
  position: number;
  totalScore: number; // Golf-style score (lower is better)
  totalPoints: number; // Keep for compatibility
  picks: string[];
  pickScores: { [golferName: string]: number };
  roundScores?: {
    round1?: number;
    round2?: number;
    round3?: number;
    round4?: number;
  };
  tiebreaker1?: number;
  tiebreaker2?: number;
  paid: boolean;
  bestFourTotal?: number; // Optional to not break existing code
  bestFourGolfers?: string[]; // Added this property to fix the TypeScript errors
}

export type TournamentRound = 1 | 2 | 3 | 4;

// Data source for leaderboard and pool data
export type DataSource = 
  | 'sportradar-api' 
  | 'mock-data' // Keeping this for fallback/emergency
  | 'cached-data'; // Keeping this for caching between API calls

export type TournamentData = {
  lastUpdated: string;
  currentRound: TournamentRound;
  leaderboard: GolferScore[];
  source?: DataSource;
  year?: string;
}

export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isNew?: boolean;
}

export type GreenRobeWinner = {
  year: number;
  winner: string;
  quote: string;
  nickname?: string;
  image?: string;
  hometown?: string;
}

export type GreenRobeCoChampions = {
  year: number;
  winners: {
    name: string;
    quote: string;
    image?: string;
    hometown?: string;
  }[];
}

export interface CardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  highlight?: boolean;
}

export const ADMIN_PASSWORD = "2025"; // Admin password for restricted features
