
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import { Flag, Trophy, Clock, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card 
          icon={<Flag className="text-masters-yellow" />} 
          title="Tournament" 
          subtitle="Follow the live leaderboard" 
          href="/leaderboard"
          accentClass="accent-magnolia" />
              
        <Card 
          icon={<Trophy className="text-masters-yellow" />} 
          title="Pool Standings" 
          subtitle="See who's winning the pool" 
          href="/selections"
          highlight={true}
          accentClass="accent-azalea" />
              
        <Card 
          icon={<Clock className="text-masters-yellow" />} 
          title="Past Champions" 
          subtitle="Celebrating 20 years" 
          href="/archive"
          accentClass="accent-jasmine" />
      </div>
      
      <div className="w-full shadow-elegant rounded-lg overflow-hidden">
        <div className="bg-white/95 backdrop-blur-sm border border-masters-green/20">
          <PoolStandings />
        </div>
      </div>
    </Layout>
  );
};

// Updated card component for homepage links with subtle floral accents and Garamond styling
const Card = ({ 
  icon, 
  title, 
  subtitle, 
  href,
  highlight = false,
  accentClass = "" 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  href: string;
  highlight?: boolean;
  accentClass?: string;
}) => {
  return (
    <Link to={href} className="block">
      <div className={`rounded-lg p-6 transition-all shadow-card hover:shadow-elegant border ${
        highlight 
          ? "bg-gradient-to-br from-masters-green to-masters-darkgreen border-masters-gold/40 text-white" 
          : "bg-white border-gray-200/80 hover:border-masters-green/40"
      } ${accentClass} relative overflow-hidden group`}>
        
        {/* Subtle floral accent in the corner */}
        {!highlight && (
          <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M50,20 Q60,5 70,20 T90,20 Q100,30 90,40 T90,60 Q80,70 70,60 T50,60 Q40,70 30,60 T10,60 Q0,50 10,40 T10,20 Q20,10 30,20 T50,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className={highlight ? "text-masters-yellow" : "text-masters-green"} />
            </svg>
          </div>
        )}
        
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-full ${highlight ? "bg-white/10" : "bg-masters-softgreen/20"}`}>
            {icon}
          </div>
          <h3 className={`text-lg font-serif ml-3 ${highlight ? "text-masters-yellow" : "text-masters-green"}`}>
            {title}
          </h3>
        </div>
        <p className={`text-sm mb-4 ${highlight ? "text-gray-100" : "text-gray-600"}`}>
          {subtitle}
        </p>
        <div className={`mt-2 flex items-center justify-between ${highlight ? "text-masters-yellow/80" : "text-masters-green/80"} text-sm font-medium`}>
          <span className="font-serif">View details</span>
          <ChevronRight size={18} className={`transform transition-transform duration-300 ${highlight ? "group-hover:translate-x-1" : "group-hover:translate-x-1"}`} />
        </div>
      </div>
    </Link>
  );
};

export default Index;
