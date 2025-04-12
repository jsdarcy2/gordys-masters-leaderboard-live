
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Flag, GolfClub } from "lucide-react";
import Image from "@/components/ui/image";

interface PoolStandingsFallbackProps {
  message?: string;
  onRetry: () => void;
}

const PoolStandingsFallback: React.FC<PoolStandingsFallbackProps> = ({
  message = "We're working to get the latest pool standings. In the meantime, enjoy a moment of Masters tradition.",
  onRetry
}) => {
  console.log("Rendering PoolStandingsFallback component with message:", message);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-masters-green/20">
      <div className="bg-masters-green p-4 text-white flex items-center justify-between">
        <h2 className="text-lg font-serif font-medium">Gordy's Masters Pool</h2>
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
      
      <div className="p-6">
        <div className="bg-gradient-to-br from-masters-green/5 to-masters-yellow/10 rounded-lg p-6 border border-masters-green/20 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 border-2 border-masters-green shadow-lg">
            <Image 
              src="/lovable-uploads/5a3a3e9f-a692-4d9b-9250-6a5493e03972.png" 
              fallback="/lovable-uploads/796fcf5f-1ce8-469e-8dac-8d47c5a401b8.png"
              alt="Jim Nantz" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <h3 className="text-masters-green font-serif text-xl font-medium">A Message from Jim Nantz</h3>
              <div className="ml-2 flex gap-1">
                <Trophy size={16} className="text-masters-green" />
                <Flag size={16} className="text-masters-green" />
              </div>
            </div>
            <p className="text-masters-dark/90 text-base leading-relaxed">
              {message}
            </p>
            <p className="text-sm text-masters-dark/70 mt-3 italic">
              Our team is working diligently to restore the pool standings. Please try again in a moment.
            </p>
            <div className="mt-4 pt-3 border-t border-masters-green/10">
              <div className="flex justify-center sm:justify-start text-xs text-masters-dark/60 gap-3">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Data recovery in progress...
                </div>
                <div className="flex items-center">
                  <GolfClub size={12} className="mr-1 text-masters-yellow" />
                  Gordy's Masters Pool
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-masters-green text-masters-green hover:bg-masters-green/10"
          >
            <RefreshCw size={14} className="mr-2" />
            Check Standings Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoolStandingsFallback;
