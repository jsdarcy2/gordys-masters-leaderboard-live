
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

  return (
    <Layout>
      <div className={`${scrolled ? 'sticky top-[72px] z-20 bg-masters-cream/95 py-3 shadow-sm border-b border-masters-green/10 backdrop-blur-sm transition-all duration-300' : 'mb-4 md:mb-6 py-0'}`}>
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-masters-green flex items-center`}>
          <BarChart3 size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
          Live Tournament Leaderboard
          <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-masters-green/20 text-masters-dark">
            <Flag size={12} className="mr-1 text-masters-green" />
            Augusta National
          </span>
        </h2>
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
