
import { useState } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Star, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "@/components/ui/image";

const NAV_TABS: NavTab[] = [
  { id: "standings", label: "Pool Standings", href: "/" },
  { id: "leaderboard", label: "Masters Leaderboard", href: "/leaderboard" },
  { id: "watch-live", label: "Watch Live", href: "/watch-live" },
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
    <header className="relative bg-masters-green text-white shadow-md overflow-hidden">
      {/* Iconic bridge image background */}
      <div className="absolute inset-0 w-full h-full opacity-20">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="Augusta National Bridge" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-masters-dark via-masters-green to-masters-dark opacity-85"></div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-sm relative">
              Gordy's Masters Pool 2025
              <div className="absolute -right-12 -top-2 transform rotate-12 flex items-center bg-masters-yellow text-masters-green px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                <Star size={12} className="mr-1" />
                BETA
              </div>
            </h1>
            <p className="text-masters-yellow font-serif text-sm md:text-base italic drop-shadow-sm">
              A tradition unlike any other
            </p>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="block md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-5">
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={tab.href}
                    className={`font-serif text-sm transition-all duration-200 pb-1 ${
                      location.pathname === tab.href
                        ? "text-masters-yellow border-b-2 border-masters-yellow"
                        : "text-white hover:text-masters-yellow hover:border-b-2 hover:border-masters-yellow/50 transition-colors"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="flex flex-col space-y-2 bg-masters-green/90 rounded-md p-2">
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={tab.href}
                    className={`block py-2 px-3 font-serif rounded-md transition-colors ${
                      location.pathname === tab.href
                        ? "text-masters-yellow bg-masters-dark/50"
                        : "text-white hover:text-masters-yellow hover:bg-masters-dark/30 transition-colors"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
