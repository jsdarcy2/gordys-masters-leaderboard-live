import React from "react";
import LiveStream from "@/components/LiveStream";
import { Button } from "@/components/ui/button";
import { RefreshCw, Golf, Martini } from "lucide-react";
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-masters-green/20">
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
        <div className="relative mb-6 rounded-lg overflow-hidden border border-masters-green/20">
          <LiveStream />
          <div className="absolute top-2 right-2 bg-masters-green/80 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> LIVE
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-masters-green/5 to-masters-yellow/10 rounded-lg p-6 border border-masters-green/20 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 border-2 border-masters-green shadow-lg">
            <Image 
              src="/lovable-uploads/796fcf5f-1ce8-469e-8dac-8d47c5a401b8.png" 
              fallback="/lovable-uploads/796fcf5f-1ce8-469e-8dac-8d47c5a401b8.png"
              alt="Jim Nantz" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <h3 className="text-masters-green font-serif text-xl font-medium">A Message from Jim Nantz</h3>
              <div className="ml-2 flex gap-1">
                <Martini size={16} className="text-masters-green" />
                <Golf size={16} className="text-masters-green" />
              </div>
            </div>
            <p className="text-masters-dark/90 text-base leading-relaxed">
              {message}
            </p>
            <p className="text-sm text-masters-dark/70 mt-3 italic">
              Our team is working diligently to restore the leaderboard. In the meantime, enjoy the live coverage from Augusta National.
            </p>
            <div className="mt-4 pt-3 border-t border-masters-green/10">
              <div className="text-xs text-masters-dark/60 flex items-center justify-center sm:justify-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                System recovery in progress...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyFallback;
