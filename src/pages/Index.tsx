
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import { Flag, Trophy, Clock, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card 
          icon={<Flag className="text-masters-darkgreen" />} 
          title="Tournament" 
          subtitle="Follow the live leaderboard" 
          href="/leaderboard"
          variant="green" />
              
        <Card 
          icon={<Trophy className="text-masters-gold" />} 
          title="Pool Standings" 
          subtitle="See who's winning the pool" 
          href="/selections"
          highlight={true}
          variant="gold" />
              
        <Card 
          icon={<Clock className="text-masters-darkgreen" />} 
          title="Past Champions" 
          subtitle="Celebrating 20 years" 
          href="/archive"
          variant="green" />
      </div>
      
      <div className="w-full rounded-lg overflow-hidden shadow-card border border-masters-green/10">
        <PoolStandings />
      </div>
    </Layout>
  );
};

// Redesigned card component for better readability and visual appeal
const Card = ({ 
  icon, 
  title, 
  subtitle, 
  href,
  highlight = false,
  variant = "green"
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  href: string;
  highlight?: boolean;
  variant?: "green" | "gold";
}) => {
  const getCardClasses = () => {
    if (highlight) {
      return "bg-gradient-to-br from-masters-gold/20 to-masters-lightgold/40 border-masters-gold/30 hover:border-masters-gold/60 text-masters-darkgreen";
    }
    
    if (variant === "gold") {
      return "bg-white/90 backdrop-blur-sm border-masters-gold/30 hover:border-masters-gold/60";
    }
    
    return "bg-white/90 backdrop-blur-sm border-masters-green/20 hover:border-masters-green/40";
  };
  
  const getLinkClasses = () => {
    if (highlight) {
      return "text-masters-darkgreen group-hover:text-masters-darkgreen";
    }
    
    if (variant === "gold") {
      return "text-masters-gold group-hover:text-masters-gold";
    }
    
    return "text-masters-green group-hover:text-masters-green";
  };

  return (
    <Link to={href} className="block">
      <div className={`rounded-lg p-6 transition-all duration-300 border shadow-card hover:shadow-elegant ${getCardClasses()} relative overflow-hidden group`}>
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,20 Q60,5 70,20 T90,20 Q100,30 90,40 T90,60 Q80,70 70,60 T50,60 Q40,70 30,60 T10,60 Q0,50 10,40 T10,20 Q20,10 30,20 T50,20" 
                  fill="currentColor" 
                  className={highlight ? "text-masters-darkgreen" : variant === "gold" ? "text-masters-gold" : "text-masters-green"} />
          </svg>
        </div>
        
        <div className="flex items-center mb-3">
          <div className={`p-2.5 rounded-full ${
            highlight 
              ? "bg-masters-green/10" 
              : variant === "gold" 
                ? "bg-masters-gold/10" 
                : "bg-masters-green/10"
          }`}>
            {icon}
          </div>
          <h3 className={`text-xl font-serif ml-3 ${
            highlight 
              ? "text-masters-darkgreen" 
              : variant === "gold" 
                ? "text-masters-gold" 
                : "text-masters-darkgreen"
          }`}>
            {title}
          </h3>
        </div>
        <p className="text-gray-700 mb-4 font-medium">
          {subtitle}
        </p>
        <div className={`mt-3 flex items-center justify-between ${getLinkClasses()} text-sm font-medium`}>
          <span className="font-serif">View details</span>
          <ChevronRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default Index;
