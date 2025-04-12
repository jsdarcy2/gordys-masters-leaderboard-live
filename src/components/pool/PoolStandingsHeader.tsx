
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
    <div className="masters-header">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-masters-green hidden md:inline-block" />
          <h2 className="text-xl md:text-2xl font-serif">
            Gordy's Masters Pool Standings
          </h2>
        </div>
        <div className="flex items-center gap-2">
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
