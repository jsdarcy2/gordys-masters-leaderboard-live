
import { Clock, Users, Activity, Trophy } from "lucide-react";

interface PoolStandingsHeaderProps {
  lastUpdated: string;
  totalParticipants: number;
  loading: boolean;
  isTournamentActive?: boolean;
  activeParticipants?: number;
  missedCutCount?: number;
}

const PoolStandingsHeader = ({ 
  lastUpdated, 
  totalParticipants, 
  loading, 
  isTournamentActive = false,
  activeParticipants,
  missedCutCount
}: PoolStandingsHeaderProps) => {
  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="masters-header relative overflow-hidden">
      {/* Subtle azalea pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="flex justify-end">
          <svg width="300" height="80" viewBox="0 0 300 80" className="text-[#FFC0CB]">
            <circle cx="260" cy="20" r="5" className="fill-current opacity-40" />
            <circle cx="280" cy="30" r="4" className="fill-current opacity-30" />
            <circle cx="270" cy="40" r="6" className="fill-current opacity-40" />
            <circle cx="250" cy="35" r="4" className="fill-current opacity-30" />
            <circle cx="290" cy="15" r="3" className="fill-current opacity-40" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Trophy size={22} className="text-masters-yellow hidden md:inline-block" />
          <h2 className="text-xl md:text-2xl font-serif">
            Gordy's Masters Pool Standings
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {isTournamentActive && (
            <div className="flex items-center text-sm text-green-400">
              <Activity size={14} className="mr-1 animate-pulse" />
              <span>Live</span>
            </div>
          )}
          {!loading && activeParticipants !== undefined && missedCutCount !== undefined && (
            <div className="flex items-center text-sm text-masters-yellow">
              <Users size={14} className="mr-1" />
              <span>{activeParticipants} Active / {missedCutCount} Cut</span>
            </div>
          )}
          {!loading && activeParticipants === undefined && totalParticipants > 0 && (
            <div className="flex items-center text-sm text-masters-yellow">
              <Users size={14} className="mr-1" />
              <span>{totalParticipants} Participants</span>
            </div>
          )}
          {!loading && lastUpdated && (
            <div className="flex items-center text-sm text-masters-yellow">
              <Clock size={14} className="mr-1" />
              <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolStandingsHeader;
