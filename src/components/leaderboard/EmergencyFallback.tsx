
import React from "react";
import LiveStream from "@/components/LiveStream";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Image from "@/components/ui/image";

interface EmergencyFallbackProps {
  message?: string;
  onRetry: () => void;
}

const EmergencyFallback: React.FC<EmergencyFallbackProps> = ({
  message = "We are having technical difficulties and are eating a pimento sandwich drinking a frosty cold beer...we will be back online shortly",
  onRetry
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-masters-green p-4 text-white flex items-center justify-between">
        <h2 className="text-lg font-serif font-medium">Masters Tournament Live</h2>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm" 
          className="bg-white/10 text-white hover:bg-white/20 border-white/20"
        >
          <RefreshCw size={14} className="mr-2" />
          Try Again
        </Button>
      </div>
      
      <div className="p-4">
        <div className="relative mb-4 rounded-lg overflow-hidden border border-masters-green/20">
          <LiveStream />
        </div>
        
        <div className="bg-masters-green/5 rounded-lg p-4 border border-masters-green/20 flex flex-col sm:flex-row items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 border-2 border-masters-green shadow-md">
            <Image 
              src="/lovable-uploads/946d56b9a-f59d-4336-9503-64a0cdf20d88.png" 
              fallback="/lovable-uploads/946d56b9a-f59d-4336-9503-64a0cdf20d88.png"
              alt="Jim Nantz" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-masters-green font-serif text-lg font-medium mb-1">A Message from Jim Nantz</h3>
            <p className="text-masters-dark/90 text-sm sm:text-base">
              {message}
            </p>
            <p className="text-xs text-masters-dark/70 mt-2 italic">
              Our team is working diligently to restore the leaderboard. In the meantime, enjoy the live coverage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyFallback;
