
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Flag, Database, Activity } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTournamentData } from "@/hooks/use-tournament-data";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DataSource } from "@/types";

const LeaderboardPage = () => {
  const isMobile = useIsMobile();
  const { dataHealth, refreshData, dataSource } = useTournamentData();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    document.title = "Masters Tournament Leaderboard - Live Scoring";
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.title = "Gordy's Masters Pool";
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRefreshClick = () => {
    refreshData(true);
    toast({
      title: "Refreshing data",
      description: "Fetching the latest data from Masters.com"
    });
  };

  // Check if we're using the live scores API
  const isUsingLiveScores = dataSource === 'masters-scores-api';

  return (
    <Layout>
      <div className={`${scrolled ? 'sticky top-[72px] z-20 bg-masters-cream/95 py-3 shadow-sm border-b border-masters-green/10 backdrop-blur-sm transition-all duration-300' : 'mb-4 md:mb-6 py-0'}`}>
        <div className="flex justify-between items-center">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-masters-green flex items-center`}>
            <BarChart3 size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
            Live Tournament Leaderboard
            <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-masters-green/20 text-masters-dark">
              <Flag size={12} className="mr-1 text-masters-green" />
              Augusta National
            </span>
            {isUsingLiveScores && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-800">
                <Activity size={12} className="mr-1 text-green-600 animate-pulse" />
                Live Scores
              </span>
            )}
          </h2>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefreshClick}
            className="border-masters-green/20 text-masters-green hover:bg-masters-green/5 hover:text-masters-darkgreen cursor-pointer"
          >
            <Database size={14} className="mr-1" />
            Refresh Data
          </Button>
        </div>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Live scoring updates from The Masters Tournament at Augusta National
        </p>
        {!scrolled && <Separator className="my-3 md:my-4 bg-masters-green/10" />}
      </div>
      
      {scrolled && <div className="h-6"></div>}
      
      <Leaderboard forceCriticalOutage={false} />
    </Layout>
  );
};

export default LeaderboardPage;
