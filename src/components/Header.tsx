
import { useState, useEffect } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Star, Tv, Trophy, Settings, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/ui/image";

const NAV_TABS: NavTab[] = [
  { id: "standings", label: "Pool Standings", href: "/" },
  { id: "leaderboard", label: "Masters Leaderboard", href: "/leaderboard" },
  { id: "watch-live", label: "Watch Live", href: "/watch-live", icon: <Tv size={14} className="text-masters-yellow" /> },
  { id: "selections", label: "Player Selections", href: "/selections" },
  { id: "social", label: "Social", href: "/social", icon: <MessageSquare size={14} className="text-masters-yellow" />, isNew: true },
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
      
      {/* Augusta National 12th hole with Hogan Bridge background - increased visibility */}
      <div className="absolute inset-0 w-full h-full opacity-35">
        <img 
          src="/lovable-uploads/7266d407-6b13-45d7-9b85-897bbd3c9f92.png" 
          alt="Augusta National 12th Hole with Hogan Bridge" 
          className="w-full h-full object-cover object-bottom"
        />
      </div>
      
      {/* Enhanced overlay with improved glassmorphism - adjusted for bridge visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-dark/75 via-masters-green/65 to-masters-dark/75 backdrop-blur-[1px]"></div>
      
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
            
            <div className="flex items-center">
              {/* Admin link (subtle) */}
              <Link
                to="/admin"
                className="text-white/40 hover:text-white/70 transition-colors mr-3 md:mr-4"
                title="Admin Panel"
              >
                <Settings size={18} />
              </Link>
              
              {/* Mobile menu button with more elegant styling */}
              <button 
                onClick={toggleMobileMenu}
                className="block md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
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
              {/* Add admin link to mobile menu */}
              <li className="border-b border-white/5 last:border-b-0">
                <Link
                  to="/admin"
                  className={`block py-3.5 px-6 font-serif text-sm flex items-center ${
                    location.pathname === "/admin"
                      ? "text-masters-yellow bg-white/5"
                      : "text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={14} className="mr-2" />
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
