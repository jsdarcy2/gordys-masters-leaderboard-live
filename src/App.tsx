
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Maintenance from "@/components/Maintenance";

import Index from "./pages/Index";
import EntryPage from "./pages/EntryPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SelectionsPage from "./pages/SelectionsPage";
import RulesPage from "./pages/RulesPage";
import ArchivePage from "./pages/ArchivePage";
import MastersChampionsPage from "./pages/MastersChampionsPage";
import WatchLivePage from "./pages/WatchLivePage";
import AdminPage from "./pages/AdminPage";
import SocialPage from "./pages/SocialPage";
import NotFound from "./pages/NotFound";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const queryClient = new QueryClient();

// Site-wide maintenance mode flag
const SITE_UNDER_MAINTENANCE = true;

const App = () => {
  // Only allow access to admin page during maintenance
  const renderMaintenanceOrRoutes = () => {
    if (SITE_UNDER_MAINTENANCE) {
      return (
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="min-h-screen bg-masters-cream flex items-center justify-center p-4">
              <Maintenance 
                title="Gordy's Masters Pool Is Under Maintenance"
                message="We're making significant improvements to enhance your Masters experience. The site will be back soon with exciting new features." 
                estimatedTime="April 15, 2025"
              />
            </div>
          } />
        </Routes>
      );
    }
    
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/selections" element={<SelectionsPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/masters-champions" element={<MastersChampionsPage />} />
        <Route path="/watch-live" element={<WatchLivePage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {renderMaintenanceOrRoutes()}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
