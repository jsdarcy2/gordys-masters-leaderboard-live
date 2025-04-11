
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Separator } from "@/components/ui/separator";
import { BarChart3 } from "lucide-react";

const LeaderboardPage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Leaderboard page mounted");
    
    // Set page title
    document.title = "Masters Leaderboard - Gordy's Masters Pool";
    
    return () => {
      // Reset title when unmounting
      document.title = "Gordy's Masters Pool";
    };
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green flex items-center">
          <BarChart3 size={24} className="mr-2 text-masters-yellow" />
          Masters Tournament Leaderboard
        </h2>
        <p className="text-gray-600 mt-2">
          Live scoring updates from Augusta National Golf Club.
        </p>
        <Separator className="my-4 bg-masters-green/10" />
      </div>
      
      <Leaderboard />
    </Layout>
  );
};

export default LeaderboardPage;
