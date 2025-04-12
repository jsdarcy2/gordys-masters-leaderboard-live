import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Define the pages array
  const pages = [
    { name: "Home", path: "/" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Selections", path: "/selections" },
    { name: "Pool Standings", path: "/entry" },
    { name: "Social", path: "/social" },
    { name: "Archives", path: "/archive" },
    { name: "Rules", path: "/rules" },
  ];

  return (
    <header className="bg-masters-green text-white py-4 md:py-5 shadow-md z-20 relative">
      <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between max-w-7xl">
        {/* Logo Section */}
        <div className="text-lg md:text-xl font-bold font-serif">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/49c70a9f-9961-4539-a99f-99a33a89875c.png"
              alt="Gordy's Masters Pool Logo"
              className="h-8 md:h-9 mr-2"
            />
            Gordy's Masters Pool 2025
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="hidden md:flex space-x-6">
          {pages.map((page) => (
            <Link
              key={page.name}
              to={page.path}
              className={`hover:text-masters-yellow transition-colors duration-200 font-medium ${
                location.pathname === page.path
                  ? "text-masters-yellow underline underline-offset-4"
                  : ""
              }`}
            >
              {page.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                onClick={toggleMenu}
                className={navigationMenuTriggerStyle()}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent className="md:hidden" side="left">
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Explore the Masters Pool
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 mt-4">
                {pages.map((page) => (
                  <SheetClose asChild key={page.name}>
                    <Link
                      to={page.path}
                      className={`block py-2 hover:text-masters-yellow transition-colors duration-200 font-medium ${
                        location.pathname === page.path
                          ? "text-masters-yellow underline underline-offset-4"
                          : ""
                      }`}
                      onClick={closeMenu} // Close the menu when a link is clicked
                    >
                      {page.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
