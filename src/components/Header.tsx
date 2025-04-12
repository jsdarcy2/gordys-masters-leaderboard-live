
import { useState, useEffect } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Star, Tv, ChevronDown } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gradient-to-r from-masters-darkgreen to-masters-green shadow-md" 
        : "bg-gradient-to-r from-masters-dark via-masters-green to-masters-dark"
      } text-white border-b border-masters-gold/30`}>
      {/* Improved background texture with reduced opacity */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="Augusta National" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Enhanced overlay with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-dark/80 via-masters-green/70 to-masters-dark/80 backdrop-blur-sm"></div>
      
      {/* Subtle Nelson Bridge silhouette */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
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
        <div className="px-4 py-3 md:py-4 flex flex-col">
          <div className="flex justify-between items-center">
            {/* Logo area with subtle glow effect */}
            <div className="flex flex-col relative">
              <div className="absolute -inset-1 bg-masters-gold/10 opacity-70 blur-sm rounded-full"></div>
              <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight relative">
                <span className="text-white">Gordy's</span> 
                <span className="text-masters-gold animate-gentle-pulse">Masters</span> 
                <span className="text-white">Pool</span>
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-masters-yellow/90 text-masters-dark">
                  <Star size={10} className="mr-0.5" />
                  2025
                </span>
              </h1>
              <p className="text-masters-yellow/90 font-serif text-xs md:text-sm italic">
                A tradition unlike any other
              </p>
            </div>
            
            {/* Mobile menu button with improved hover effect */}
            <button 
              onClick={toggleMobileMenu}
              className="block md:hidden text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          
          {/* Desktop navigation with refined styling */}
          <nav className="hidden md:block mt-4">
            <div className="flex justify-center">
              <ul className="flex space-x-1 bg-masters-dark/40 backdrop-blur-sm rounded-full px-2 py-1 shadow-inner border border-white/5">
                {NAV_TABS.map((tab) => (
                  <li key={tab.id}>
                    <Link
                      to={tab.href}
                      className={`font-serif text-sm transition-all duration-200 px-3 py-1.5 rounded-full flex items-center ${
                        location.pathname === tab.href
                          ? "bg-white/15 text-masters-yellow font-medium shadow-inner"
                          : "text-white/90 hover:bg-white/5 hover:text-masters-yellow"
                      }`}
                    >
                      {tab.icon && <span className="mr-1">{tab.icon}</span>}
                      {tab.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        
        {/* Mobile navigation with improved styling */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-masters-dark/90 backdrop-blur-md border-t border-white/10 animate-smooth-appear rounded-b-lg shadow-md">
            <ul className="flex flex-col">
              {NAV_TABS.map((tab) => (
                <li key={tab.id} className="border-b border-white/10 last:border-b-0">
                  <Link
                    to={tab.href}
                    className={`block py-3 px-4 font-serif text-sm flex items-center ${
                      location.pathname === tab.href
                        ? "text-masters-yellow bg-white/5"
                        : "text-white hover:bg-white/5"
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
