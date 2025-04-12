import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Golf, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTournamentData } from "@/hooks/use-tournament-data";

const LeaderboardPage = () => {
  const isMobile = useIsMobile();
  const { dataHealth, consecutiveFailures } = useTournamentData();
  const [isCriticalOutage, setIsCriticalOutage] = useState(false);
  
  useEffect(() => {
    if (
      (consecutiveFailures && consecutiveFailures >= 5) || 
      (dataHealth?.status === "offline" && consecutiveFailures && consecutiveFailures >= 3)
    ) {
      setIsCriticalOutage(true);
    } else {
      setIsCriticalOutage(false);
    }
  }, [dataHealth, consecutiveFailures]);
  
  useEffect(() => {
    console.log("Leaderboard page mounted");
    
    if (isCriticalOutage) {
      document.title = "Live Coverage - The Masters Tournament";
    } else {
      document.title = "Masters Leaderboard - Gordy's Masters Pool";
    }
    
    return () => {
      document.title = "Gordy's Masters Pool";
    };
  }, [isCriticalOutage]);

  return (
    <Layout>
      <div className="mb-4 md:mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-masters-green flex items-center`}>
          {isCriticalOutage ? (
            <>
              <Tv size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
              Live Coverage
            </>
          ) : (
            <>
              <BarChart3 size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
              Live Leaderboard
            </>
          )}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          {isCriticalOutage 
            ? "Live streaming coverage from Augusta National Golf Club."
            : "Real-time scoring updates from Augusta National Golf Club."
          }
        </p>
        <Separator className="my-3 md:my-4 bg-masters-green/10" />
      </div>
      
      <Leaderboard />
    </Layout>
  );
};

export default LeaderboardPage;
