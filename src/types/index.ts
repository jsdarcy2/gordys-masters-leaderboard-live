
// Masters tournament data types
export type GolferScore = {
  position: number;
  name: string;
  score: number;
  today: number;
  thru: string | number;
  strokes?: number;
  status?: 'cut' | 'active' | 'withdrawn';
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
}

export type TournamentRound = 1 | 2 | 3 | 4;

export type TournamentData = {
  lastUpdated: string;
  currentRound: TournamentRound;
  leaderboard: GolferScore[];
}

export type NavTab = {
  id: string;
  label: string;
  href: string;
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
