
import React from "react";
import { PoolParticipant } from "@/types";
import { Trophy } from "lucide-react";

interface MastersStyleLeaderboardProps {
  topParticipants: PoolParticipant[];
  className?: string;
}

const MastersStyleLeaderboard: React.FC<MastersStyleLeaderboardProps> = ({ 
  topParticipants = [],
  className = ""
}) => {
  // Limit to top 5 participants
  const displayParticipants = topParticipants.slice(0, 5);
  
  // Default background image of Augusta National
  const bgImage = "/lovable-uploads/5b89035a-a165-4257-b9d8-1f7e1024d956.png";
  
  return (
    <div className={`relative overflow-hidden rounded-lg mb-6 ${className}`}>
      {/* Background image with trees */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={bgImage} 
          alt="Augusta National background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Leaderboard panel */}
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="bg-masters-green p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/fad075a8-28dc-45ad-9b89-d872e71f50be.png" 
              alt="Masters logo" 
              className="h-8 sm:h-10 mr-3" 
            />
            <h3 className="text-white font-serif text-lg sm:text-2xl tracking-wide">
              POOL LEADERS
            </h3>
          </div>
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-masters-yellow mr-1.5" />
            <span className="text-masters-gold font-medium text-sm sm:text-base">2025</span>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {displayParticipants.map((participant, index) => (
            <div 
              key={participant.name} 
              className={`flex items-center ${
                index % 2 === 0 ? 'bg-masters-green/90' : 'bg-masters-green/80'
              } hover:bg-masters-green transition-colors border-b border-masters-gold/20 last:border-b-0`}
            >
              {/* Position number */}
              <div className="h-12 w-12 flex-shrink-0 bg-masters-green flex items-center justify-center">
                <span className="text-white font-bold text-xl">{participant.position}</span>
              </div>
              
              {/* Player name */}
              <div className="flex-grow pl-3 font-serif tracking-wider text-white text-lg sm:text-xl uppercase">
                {participant.name}
              </div>
              
              {/* Score */}
              <div className="flex items-center">
                <div className={`h-10 w-14 sm:w-16 flex items-center justify-center ${
                  participant.totalScore < 0 
                    ? 'bg-red-700' 
                    : participant.totalScore > 0 
                      ? 'bg-black/80' 
                      : 'bg-gray-700'
                }`}>
                  <span className="text-white font-bold text-lg">
                    {participant.totalScore === 0 
                      ? 'E' 
                      : participant.totalScore > 0 
                        ? `+${participant.totalScore}` 
                        : participant.totalScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-masters-green/90 py-1.5 px-3 text-right rounded-b-lg">
          <span className="text-masters-cream/80 text-xs font-serif italic">
            Scores represent best 4 out of 5 golfer picks
          </span>
        </div>
      </div>
    </div>
  );
};

export default MastersStyleLeaderboard;
