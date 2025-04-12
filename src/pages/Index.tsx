
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import { Flag, Trophy, Clock, ChevronRight } from "lucide-react";
import Image from "@/components/ui/image";

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card 
          icon={<Flag className="text-masters-darkgreen" />} 
          title="Tournament" 
          subtitle="Follow the live leaderboard" 
          href="/leaderboard"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          variant="green" />
              
        <Card 
          icon={<Trophy className="text-masters-gold" />} 
          title="Pool Standings" 
          subtitle="See who's winning the pool" 
          href="/selections"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          highlight={true}
          variant="gold" />
              
        <Card 
          icon={<Clock className="text-masters-darkgreen" />} 
          title="Past Champions" 
          subtitle="Celebrating 20 years" 
          href="/archive"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          variant="green" />
      </div>
      
      <div className="w-full rounded-lg overflow-hidden shadow-card border border-masters-green/10">
        <PoolStandings />
      </div>
    </Layout>
  );
};

// Redesigned card component with Tiger Woods celebration and Masters flag
const Card = ({ 
  icon, 
  title, 
  subtitle, 
  href,
  backgroundImage,
  highlight = false,
  variant = "green"
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  href: string;
  backgroundImage?: string;
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
    <Link to={href} className="block relative z-10 h-full">
      <div className={`rounded-lg p-6 transition-all duration-300 border shadow-card hover:shadow-elegant ${getCardClasses()} relative overflow-hidden group h-full`}>
        {/* Background elements with pointer-events-none to ensure clicks pass through to the link */}
        {backgroundImage && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Tiger Woods celebration image - optimized for being a subtle background */}
            <img 
              src={backgroundImage} 
              alt=""
              className="w-full h-full object-cover opacity-[0.08]"
            />
            
            {/* Flag-like stripes overlay */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <div className={`absolute top-0 left-0 w-full h-1/3 opacity-[0.03] ${
                highlight 
                  ? "bg-masters-gold" 
                  : variant === "gold" 
                    ? "bg-masters-gold" 
                    : "bg-masters-green"
              }`}></div>
              <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white opacity-[0.04]"></div>
              <div className={`absolute top-2/3 left-0 w-full h-1/3 opacity-[0.03] ${
                highlight 
                  ? "bg-masters-gold" 
                  : variant === "gold" 
                    ? "bg-masters-gold" 
                    : "bg-masters-green"
              }`}></div>
            </div>
            
            {/* Gradient overlay to ensure text readability */}
            <div className={`absolute inset-0 pointer-events-none ${
              highlight 
                ? "bg-gradient-to-br from-masters-gold/30 to-masters-lightgold/20" 
                : variant === "gold" 
                  ? "bg-gradient-to-br from-masters-gold/10 to-white/70" 
                  : "bg-gradient-to-br from-masters-green/10 to-white/70"
            }`}></div>
          </div>
        )}
        
        {/* Small flag emblem in the corner - with pointer-events-none */}
        <div className="absolute top-3 right-3 opacity-[0.06] pointer-events-none">
          <Flag 
            size={24} 
            className={`${
              highlight 
                ? "text-masters-darkgreen" 
                : variant === "gold" 
                  ? "text-masters-gold" 
                  : "text-masters-green"
            }`} 
          />
        </div>
        
        {/* Card content with z-index to ensure it's clickable */}
        <div className="flex items-center mb-3 relative z-10">
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
        <p className="text-gray-700 mb-4 font-medium relative z-10">
          {subtitle}
        </p>
        <div className={`mt-3 flex items-center justify-between ${getLinkClasses()} text-sm font-medium relative z-10`}>
          <span className="font-serif">View details</span>
          <ChevronRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default Index;
