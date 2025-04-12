
import { useState, useEffect } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Star, Tv, Trophy } from "lucide-react";
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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-masters-dark/95 shadow-md" 
        : "bg-gradient-to-r from-masters-dark/90 via-masters-green/90 to-masters-dark/90"
      } border-b border-masters-gold/20`}>
      
      {/* Augusta National backdrop - elegant and subtle */}
      <div className="absolute inset-0 w-full h-full opacity-[0.07]">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="Augusta National" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Enhanced overlay with improved glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-dark/90 via-masters-green/80 to-masters-dark/90 backdrop-blur-[2px]"></div>
      
      {/* Amen Corner silhouette for visual identity */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="container mx-auto h-full relative">
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-8 hidden md:block">
            <svg viewBox="0 0 800 200" className="w-full h-full fill-none" preserveAspectRatio="xMidYMax meet">
              {/* Stylized Amen Corner outline */}
              <path 
                d="M0,200 C100,180 200,160 300,160 C400,160 450,140 500,140 C600,140 700,120 800,100 L800,200 L0,200 Z" 
                className="fill-masters-gold/[0.03] stroke-masters-gold/[0.05]" 
                strokeWidth="1" 
              />
              {/* Azalea hints around the corner */}
              <circle cx="400" cy="150" r="5" className="fill-[#FFD6E0]/5" />
              <circle cx="410" cy="145" r="4" className="fill-[#FFD6E0]/5" />
              <circle cx="420" cy="155" r="3" className="fill-[#FFD6E0]/5" />
              {/* Pine silhouette */}
              <path 
                d="M600,140 L600,110 M580,140 L580,100 M560,140 L560,105 M620,140 L620,115 M640,140 L640,90" 
                className="stroke-masters-dustygreen/10" 
                strokeWidth="1" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="px-6 py-6 md:py-8 flex flex-col">
          <div className="flex justify-between items-center">
            {/* Logo area with refined styling */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute -inset-2 bg-masters-gold/5 blur-md rounded-full"></div>
                <h1 className="font-serif tracking-wide relative">
                  <span className="text-xl md:text-3xl font-semibold">
                    <span className="text-white">Gordy's</span> 
                    <span className="text-masters-gold ml-1">Masters</span> 
                    <span className="text-white ml-1">Pool</span>
                  </span>
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-masters-yellow/80 text-masters-dark">
                    <Trophy size={10} className="mr-1" />
                    2025
                  </span>
                </h1>
                <p className="text-masters-yellow/80 font-serif text-sm italic mt-1">
                  A tradition unlike any other since 2005
                </p>
              </div>
            </div>
            
            {/* Mobile menu button with more elegant styling */}
            <button 
              onClick={toggleMobileMenu}
              className="block md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          
          {/* Desktop navigation - more elegant, inspired by Augusta */}
          <nav className="hidden md:block mt-6">
            <div className="flex justify-center">
              <ul className="flex space-x-2 bg-masters-dark/40 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-white/10">
                {NAV_TABS.map((tab) => (
                  <li key={tab.id}>
                    <Link
                      to={tab.href}
                      className={`font-serif text-sm transition-all duration-300 px-4 py-2 rounded-full flex items-center ${
                        location.pathname === tab.href
                          ? "bg-white/15 text-masters-yellow font-medium shadow-inner"
                          : "text-white/90 hover:bg-white/5 hover:text-masters-yellow"
                      }`}
                    >
                      {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
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
          <nav className="md:hidden bg-masters-dark/95 backdrop-blur-md border-t border-white/10 animate-smooth-appear rounded-b-lg shadow-md">
            <ul className="flex flex-col py-2">
              {NAV_TABS.map((tab) => (
                <li key={tab.id} className="border-b border-white/5 last:border-b-0">
                  <Link
                    to={tab.href}
                    className={`block py-3.5 px-6 font-serif text-sm flex items-center ${
                      location.pathname === tab.href
                        ? "text-masters-yellow bg-white/5"
                        : "text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
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
