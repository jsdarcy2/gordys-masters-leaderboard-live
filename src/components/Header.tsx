
import { useState } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Eye, Star, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/ui/image";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

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
    <header className="relative bg-masters-green text-white border-b border-masters-yellow/20 shadow-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
          alt="Augusta National" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-masters-green/90 to-masters-green/100"></div>
      
      {/* Breck logo in upper right corner */}
      <div className="absolute top-2 right-4 md:right-6 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="opacity-30 hover:opacity-60 transition-opacity">
                <img 
                  src="/lovable-uploads/dfd18d78-1ed9-472a-9450-f542194c1727.png" 
                  alt="Breck Logo" 
                  className="w-8 h-8 md:w-10 md:h-10"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Honor God, Country</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="px-4 py-3 md:py-4 flex flex-col">
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
          <nav className="hidden md:block mt-3">
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
