
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Flag, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTournamentData } from "@/hooks/use-tournament-data";

const LeaderboardPage = () => {
  const isMobile = useIsMobile();
  const { dataHealth, consecutiveFailures } = useTournamentData();
  const [isCriticalOutage, setIsCriticalOutage] = useState(false);
  
  // More tolerant outage detection to avoid showing outage unnecessarily
  useEffect(() => {
    // Only show critical outage for persistent, severe failures
    const hasOutage = 
      (consecutiveFailures && consecutiveFailures >= 4) || 
      (dataHealth?.status === "offline" && consecutiveFailures && consecutiveFailures >= 3);
    
    setIsCriticalOutage(hasOutage);
    
    console.log("Outage check:", {
      consecutiveFailures,
      dataHealthStatus: dataHealth?.status,
      isCriticalOutage: hasOutage
    });
  }, [dataHealth, consecutiveFailures]);
  
  useEffect(() => {
    console.log("Leaderboard page mounted, critical outage:", isCriticalOutage);
    
    if (isCriticalOutage) {
      document.title = "Masters Leaderboard - The Masters Tournament";
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
          <BarChart3 size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
          Live Leaderboard
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Real-time scoring updates from Augusta National Golf Club
        </p>
        <Separator className="my-3 md:my-4 bg-masters-green/10" />
      </div>
      
      <Leaderboard forceCriticalOutage={false} />
    </Layout>
  );
};

export default LeaderboardPage;
