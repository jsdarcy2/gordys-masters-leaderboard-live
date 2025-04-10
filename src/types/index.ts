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

export type PoolParticipant = {
  name: string;
  position: number;
  totalPoints: number;
  picks: string[];
  pickScores?: { [golferName: string]: number };
  roundScores?: {
    round1?: number;
    round2?: number;
    round3?: number;
    round4?: number;
  };
  total?: number;
  tiebreaker1?: number;
  tiebreaker2?: number;
  paid?: boolean;
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
}

export type GreenRobeCoChampions = {
  year: number;
  winners: {
    name: string;
    quote: string;
    image?: string;
  }[];
}
