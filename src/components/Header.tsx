
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
      
      {/* Masters celebration image background - subtle overlay */}
      <div className="absolute inset-0 w-full h-full opacity-[0.15]">
        <Image 
          src="/lovable-uploads/b64f5d80-01a5-4e5d-af82-1b8aea8cec9a.png" 
          alt="Masters Celebration" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Enhanced overlay with improved glassmorphism - adjusted to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-dark/85 via-masters-green/75 to-masters-dark/85 backdrop-blur-[2px]"></div>
      
      {/* Masters logo silhouette - subtle accent */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="container mx-auto h-full relative">
          <div className="absolute right-4 top-4 w-16 h-16 opacity-10 hidden md:block">
            <svg viewBox="0 0 512 512" className="w-full h-full fill-masters-gold stroke-masters-gold" preserveAspectRatio="xMidYMid meet">
              <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 400h-32l-38.4-51.2c-6.4 6.4-16 9.6-22.4 12.8l25.6 38.4h-44.8l-19.2-32c-16 3.2-32 3.2-51.2 3.2v28.8h-38.4v-28.8c-19.2 0-35.2 0-51.2-3.2l-19.2 32H96l25.6-38.4c-9.6-3.2-16-6.4-22.4-12.8L60.8 408H28.8v-32h19.2c0-9.6 3.2-16 6.4-25.6l-25.6-19.2v-38.4l25.6 19.2c6.4-9.6 16-19.2 25.6-25.6l-19.2-25.6h38.4l12.8 25.6c9.6-3.2 19.2-6.4 32-6.4l-6.4-32h38.4l-6.4 32c12.8 0 22.4 3.2 32 6.4l12.8-25.6h38.4l-19.2 25.6c9.6 6.4 19.2 16 25.6 25.6l25.6-19.2V292l-25.6 19.2c3.2 9.6 6.4 16 6.4 25.6h19.2c3.2 6.4 0 38.4 0 38.4z" />
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
              <ul className="flex space-x-2 bg-masters-dark/50 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-white/10">
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
