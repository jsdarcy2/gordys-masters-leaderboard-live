
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import LeaderboardPage from "./pages/LeaderboardPage";
import SelectionsPage from "./pages/SelectionsPage";
import RulesPage from "./pages/RulesPage";
import ArchivePage from "./pages/ArchivePage";
import MastersChampionsPage from "./pages/MastersChampionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/selections" element={<SelectionsPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/masters-champions" element={<MastersChampionsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
