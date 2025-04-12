
import { useState } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Star, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/ui/image";

const NAV_TABS: NavTab[] = [
  { id: "standings", label: "Pool Standings", href: "/" },
  { id: "leaderboard", label: "Masters Leaderboard", href: "/leaderboard" },
  { id: "watch-live", label: "Watch Live", href: "/watch-live", icon: <Tv size={14} className="text-masters-yellow" /> },
  { id: "selections", label: "Player Selections", href: "/selections" },
  { id: "archive", label: "Green Robe Winners", href: "/archive" },
  { id: "masters-champions", label: "Masters Champions", href: "/masters-champions" },
  { id: "rules", label: "Pool Rules", href: "/rules" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  return (
    <header className="relative bg-masters-green text-white border-b border-masters-gold/30 shadow-md">
      {/* Augusta National background image with lower opacity */}
      <div className="absolute inset-0 w-full h-full opacity-20">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="Augusta National" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Enhanced gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-masters-green/90 via-masters-green/80 to-masters-green/95"></div>
      
      {/* Subtle Nelson Bridge silhouette */}
      <div className="absolute inset-0 w-full h-full">
        <div className="container mx-auto h-full relative">
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 opacity-10 hidden md:block">
            <svg viewBox="0 0 400 200" className="w-full h-full fill-masters-yellow/5 stroke-masters-yellow/20" preserveAspectRatio="xMidYMax meet">
              {/* Stone bridge arch */}
              <path d="M0,200 C50,180 100,100 150,100 C200,100 250,150 300,150 C350,150 400,130 400,100 L400,200 L0,200 Z" strokeWidth="1" />
              {/* Bridge railings */}
              <path d="M100,200 L100,130 L300,130 L300,200" strokeWidth="1" fill="none" />
              {/* Bridge posts */}
              <path d="M125,130 L125,150 M150,130 L150,150 M175,130 L175,150 M200,130 L200,150 M225,130 L225,150 M250,130 L250,150 M275,130 L275,150" strokeWidth="1" strokeDasharray="2,3" fill="none" />
              {/* Water reflection */}
              <path d="M50,180 Q200,190 350,180" stroke="rgba(255,231,51,0.1)" strokeWidth="1" fill="none" />
              {/* Subtle azaleas around the bridge */}
              <circle cx="80" cy="150" r="5" className="fill-[#FFC0CB]/10 stroke-[#FFC0CB]/5" />
              <circle cx="90" cy="160" r="4" className="fill-[#FFC0CB]/10 stroke-[#FFC0CB]/5" />
              <circle cx="310" cy="150" r="5" className="fill-[#FFC0CB]/10 stroke-[#FFC0CB]/5" />
              <circle cx="320" cy="160" r="4" className="fill-[#FFC0CB]/10 stroke-[#FFC0CB]/5" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="px-4 py-4 md:py-5 flex flex-col">
          <div className="flex justify-between items-center">
            {/* Logo area */}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                Gordy's Masters Pool
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-masters-yellow/90 text-masters-dark">
                  <Star size={10} className="mr-0.5" />
                  2025
                </span>
              </h1>
              <p className="text-masters-yellow/90 font-serif text-xs md:text-sm italic">
                A tradition unlike any other
              </p>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="block md:hidden text-white p-1 rounded-md hover:bg-masters-dark/40 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block mt-4">
            <ul className="flex space-x-6">
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={tab.href}
                    className={`font-serif text-sm transition-all duration-200 py-1 flex items-center ${
                      location.pathname === tab.href
                        ? "text-masters-yellow border-b-2 border-masters-yellow"
                        : "text-white/90 hover:text-masters-yellow hover:border-b border-masters-yellow/30"
                    }`}
                  >
                    {tab.icon && <span className="mr-1">{tab.icon}</span>}
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-masters-dark/95 backdrop-blur-sm border-t border-white/10 animate-fade-in">
            <ul className="flex flex-col">
              {NAV_TABS.map((tab) => (
                <li key={tab.id} className="border-b border-white/10 last:border-b-0">
                  <Link
                    to={tab.href}
                    className={`block py-3 px-4 font-serif text-sm flex items-center ${
                      location.pathname === tab.href
                        ? "text-masters-yellow bg-masters-dark/70"
                        : "text-white hover:bg-masters-dark/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
