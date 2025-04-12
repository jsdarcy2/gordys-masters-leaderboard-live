
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import { Flag, Trophy, Clock, ChevronRight } from "lucide-react";
import Image from "@/components/ui/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <FeatureCard 
          icon={<Flag className="text-masters-darkgreen" />} 
          title="Tournament" 
          subtitle="Follow the live leaderboard" 
          href="/leaderboard"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          variant="green" 
        />
              
        <FeatureCard 
          icon={<Trophy className="text-masters-gold" />} 
          title="Pool Standings" 
          subtitle="See who's winning the pool" 
          href="/selections"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          highlight={true}
          variant="gold" 
        />
              
        <FeatureCard 
          icon={<Clock className="text-masters-darkgreen" />} 
          title="Past Champions" 
          subtitle="Celebrating 20 years" 
          href="/archive"
          backgroundImage="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png"
          variant="green" 
        />
      </div>
      
      <div className="w-full rounded-lg overflow-hidden shadow-card border border-masters-green/10">
        <PoolStandings />
      </div>
    </Layout>
  );
};

// Rebuilt feature card component using shadcn/ui Card as the foundation
const FeatureCard = ({ 
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
  // Determine base card styling
  const cardBaseClasses = highlight
    ? "from-masters-gold/20 to-masters-lightgold/40 border-masters-gold/30 hover:border-masters-gold/60"
    : variant === "gold"
      ? "from-white/90 to-white/90 border-masters-gold/30 hover:border-masters-gold/60"
      : "from-white/90 to-white/90 border-masters-green/20 hover:border-masters-green/40";
  
  // Get icon container classes
  const iconContainerClasses = highlight
    ? "bg-masters-green/10 text-masters-darkgreen"
    : variant === "gold"
      ? "bg-masters-gold/10 text-masters-gold"
      : "bg-masters-green/10 text-masters-darkgreen";
  
  // Get title text color
  const titleColorClass = highlight
    ? "text-masters-darkgreen"
    : variant === "gold"
      ? "text-masters-gold"
      : "text-masters-darkgreen";
  
  // Get footer link color
  const footerLinkColorClass = highlight
    ? "text-masters-darkgreen group-hover:text-masters-darkgreen"
    : variant === "gold"
      ? "text-masters-gold group-hover:text-masters-gold"
      : "text-masters-green group-hover:text-masters-green";
  
  // Get stripe color for decorative background
  const stripeColorClass = highlight || variant === "gold"
    ? "bg-masters-gold"
    : "bg-masters-green";
  
  // Get gradient overlay color
  const gradientOverlayClass = highlight
    ? "bg-gradient-to-br from-masters-gold/30 to-masters-lightgold/20"
    : variant === "gold"
      ? "bg-gradient-to-br from-masters-gold/10 to-white/70"
      : "bg-gradient-to-br from-masters-green/10 to-white/70";

  return (
    <Link 
      to={href} 
      className="block h-full no-underline group"
      draggable="false"
    >
      <Card className={`h-full relative overflow-hidden border bg-gradient-to-br shadow-card hover:shadow-elegant transition-all duration-300 ${cardBaseClasses}`}>
        {/* Background image and decorative elements - all with pointer-events-none */}
        {backgroundImage && (
          <>
            {/* Background image with reduced opacity */}
            <div className="absolute inset-0 pointer-events-none">
              <img 
                src={backgroundImage} 
                alt=""
                className="w-full h-full object-cover opacity-[0.08]"
              />
            </div>
            
            {/* Decorative stripes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <div className={`absolute top-0 left-0 w-full h-1/3 opacity-[0.03] ${stripeColorClass}`}></div>
              <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white opacity-[0.04]"></div>
              <div className={`absolute top-2/3 left-0 w-full h-1/3 opacity-[0.03] ${stripeColorClass}`}></div>
            </div>
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 pointer-events-none ${gradientOverlayClass}`}></div>
          </>
        )}
        
        {/* Decorative icon in top right corner */}
        <div className="absolute top-3 right-3 opacity-[0.06] pointer-events-none">
          <Flag 
            size={24} 
            className={highlight ? "text-masters-darkgreen" : variant === "gold" ? "text-masters-gold" : "text-masters-green"}
          />
        </div>
        
        {/* Card Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-center mb-3">
            <div className={`p-2.5 rounded-full ${iconContainerClasses}`}>
              {icon}
            </div>
            <h3 className={`text-xl font-serif ml-3 ${titleColorClass}`}>
              {title}
            </h3>
          </div>
          
          <p className="text-gray-700 mb-4 font-medium">
            {subtitle}
          </p>
          
          <div className={`mt-3 flex items-center justify-between ${footerLinkColorClass} text-sm font-medium`}>
            <span className="font-serif">View details</span>
            <ChevronRight 
              size={18} 
              className="transform transition-transform duration-300 group-hover:translate-x-1" 
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default Index;
