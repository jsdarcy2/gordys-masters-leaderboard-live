
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Flag, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTournamentData } from "@/hooks/use-tournament-data";

const LeaderboardPage = () => {
  const isMobile = useIsMobile();
  const { dataHealth } = useTournamentData();
  
  useEffect(() => {
    document.title = "Masters Tournament Leaderboard - Live Scoring";
    
    return () => {
      document.title = "Gordy's Masters Pool";
    };
  }, []);

  return (
    <Layout>
      <div className="mb-4 md:mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-masters-green flex items-center`}>
          <BarChart3 size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
          Live Tournament Leaderboard
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Live scoring updates from The Masters Tournament at Augusta National
        </p>
        <Separator className="my-3 md:my-4 bg-masters-green/10" />
      </div>
      
      <Leaderboard forceCriticalOutage={false} />
    </Layout>
  );
};

export default LeaderboardPage;
