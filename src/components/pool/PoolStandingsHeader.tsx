
import React from "react";
import { RefreshCcw, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SyncStatusBadge from "@/components/pool/SyncStatusBadge";

interface PoolStandingsHeaderProps {
  lastUpdated: string;
  totalParticipants: number;
  loading: boolean;
  isTournamentActive?: boolean;
  activeParticipants?: number;
  missedCutCount?: number;
  onRefresh: () => void;
}

const PoolStandingsHeader: React.FC<PoolStandingsHeaderProps> = ({
  lastUpdated,
  totalParticipants,
  loading,
  isTournamentActive = false,
  activeParticipants = 0,
  missedCutCount = 0,
  onRefresh
}) => {
  const formatLastUpdated = (timestamp: string): string => {
    if (!timestamp) return "Updating...";
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Updating...";
    }
  };
  
  return (
    <div className="bg-masters-green p-4 text-white flex flex-wrap items-center justify-between relative overflow-hidden">
      {/* Add subtle background image showing the bridge */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <img 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="" 
          className="w-full h-full object-cover object-bottom"
        />
      </div>
      
      {/* Semi-transparent overlay to maintain text readability */}
      <div className="absolute inset-0 bg-masters-green/85 pointer-events-none"></div>
      
      <div className="flex items-center mr-4 relative z-10">
        <div className="hidden sm:block">
          <Award size={24} className="text-masters-yellow mr-3" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif tracking-wide">Gordy's Masters Pool</h2>
          <div className="flex items-center text-xs text-white/80 mt-1">
            <Users size={12} className="mr-1" />
            <span>{totalParticipants} participants</span>
            {isTournamentActive && (
              <>
                <span className="mx-1.5 text-white/40">•</span>
                <Clock size={12} className="mr-1" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </>
            )}
            <span className="mx-1.5 text-white/40">•</span>
            <SyncStatusBadge onRefresh={onRefresh} />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="sm" 
        className="bg-white/10 text-white hover:bg-white/20 border-white/20 ml-auto relative z-10"
        disabled={loading}
      >
        <RefreshCcw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
};

export default PoolStandingsHeader;
