
import { useState } from "react";
import { NavTab } from "@/types";
import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_TABS: NavTab[] = [
  { id: "standings", label: "Pool Standings", href: "/" },
  { id: "leaderboard", label: "Masters Leaderboard", href: "/leaderboard" },
  { id: "selections", label: "Player Selections", href: "/selections" },
  { id: "rules", label: "Pool Rules", href: "/rules" },
  { id: "archive", label: "Archive", href: "/archive" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  return (
    <header className="bg-masters-green text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-3xl font-serif font-bold">Gordy's Masters Pool</h1>
            <p className="text-masters-gold font-serif text-sm md:text-base italic">20th Year Edition</p>
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
            <ul className="flex space-x-6">
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={tab.href}
                    className={`font-serif ${
                      location.pathname === tab.href
                        ? "text-masters-gold border-b-2 border-masters-gold"
                        : "text-white hover:text-masters-gold transition-colors"
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
            <ul className="flex flex-col space-y-2">
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={tab.href}
                    className={`block py-2 font-serif ${
                      location.pathname === tab.href
                        ? "text-masters-gold"
                        : "text-white hover:text-masters-gold transition-colors"
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
