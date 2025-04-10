
import { Clock, Users } from "lucide-react";

interface PoolStandingsHeaderProps {
  lastUpdated: string;
  totalParticipants: number;
  loading: boolean;
}

const PoolStandingsHeader = ({ lastUpdated, totalParticipants, loading }: PoolStandingsHeaderProps) => {
  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="masters-header">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-serif">
          Pool Standings
        </h2>
        <div className="flex items-center gap-2">
          {!loading && totalParticipants > 0 && (
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
