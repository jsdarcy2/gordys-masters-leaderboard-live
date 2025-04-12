
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
    <div className="relative overflow-hidden rounded-t-lg shadow-subtle">
      {/* Refined background with softer gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-darkgreen/95 to-masters-green/95">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="w-full h-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>
        </div>
        
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-masters-gold/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 px-6 py-5 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <Trophy size={22} className="text-masters-gold" />
            <h2 className="text-xl md:text-2xl font-serif tracking-wide">
              Gordy's Masters Pool Standings
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-5 text-sm">
            {isTournamentActive && (
              <div className="flex items-center text-green-300">
                <Activity size={16} className="mr-1.5 animate-pulse" />
                <span className="font-medium">Live</span>
              </div>
            )}
            {!loading && activeParticipants !== undefined && missedCutCount !== undefined && (
              <div className="flex items-center text-masters-gold/90">
                <Users size={16} className="mr-1.5" />
                <span>{activeParticipants} Active / {missedCutCount} Cut</span>
              </div>
            )}
            {!loading && activeParticipants === undefined && totalParticipants > 0 && (
              <div className="flex items-center text-masters-gold/90">
                <Users size={16} className="mr-1.5" />
                <span>{totalParticipants} Participants</span>
              </div>
            )}
            {!loading && lastUpdated && (
              <div className="flex items-center text-masters-gold/90">
                <Clock size={16} className="mr-1.5" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolStandingsHeader;
