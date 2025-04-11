
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";
import { Golf, Trophy, Clock, UserPlus } from "lucide-react";

const Index = () => {
  // Mock data for PersonalizedDashboard
  const mockPoolStandings = [];
  const isLoading = false;

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={<Golf className="text-masters-yellow" />} 
              title="Tournament" 
              subtitle="Follow the live leaderboard" 
              href="/leaderboard" />
              
        <Card icon={<Trophy className="text-masters-yellow" />} 
              title="Pool Standings" 
              subtitle="See who's winning the pool" 
              href="/selections" />
              
        <Card icon={<Clock className="text-masters-yellow" />} 
              title="Past Champions" 
              subtitle="Celebrating 20 years" 
              href="/archive" />
              
        <Card icon={<UserPlus className="text-masters-yellow" />} 
              title="Enter Pool" 
              subtitle="Join this year's competition" 
              href="/entry"
              highlight={true} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PoolStandings />
        </div>
        <div>
          <PersonalizedDashboard poolStandings={mockPoolStandings} loading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

// Quick card component for homepage links
const Card = ({ 
  icon, 
  title, 
  subtitle, 
  href,
  highlight = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  href: string;
  highlight?: boolean;
}) => {
  return (
    <Link to={href} className="block">
      <div className={`rounded-lg p-5 transition-all shadow-sm hover:shadow-md border ${
        highlight 
          ? "bg-masters-green border-masters-gold text-white" 
          : "bg-white border-gray-200 hover:border-masters-green"
      }`}>
        <div className="flex items-center mb-3">
          {icon}
          <h3 className={`text-lg font-serif ml-2 ${highlight ? "text-masters-yellow" : "text-masters-green"}`}>
            {title}
          </h3>
        </div>
        <p className={`text-sm ${highlight ? "text-gray-100" : "text-gray-600"}`}>
          {subtitle}
        </p>
        <Button 
          variant={highlight ? "secondary" : "outline"} 
          size="sm" 
          className={`mt-3 w-full ${
            highlight 
              ? "text-masters-green bg-masters-yellow hover:bg-masters-yellow/90" 
              : "text-masters-green hover:bg-masters-light"
          }`}
        >
          {highlight ? "Enter Now" : "View"}
        </Button>
      </div>
    </Link>
  );
};

export default Index;
