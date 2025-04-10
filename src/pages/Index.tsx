
import { useEffect } from "react";
import Layout from "@/components/Layout";
import PoolStandings from "@/components/PoolStandings";
import Leaderboard from "@/components/Leaderboard";

const Index = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Pool Standings page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Welcome to Gordy's Masters Pool
        </h2>
        <p className="text-gray-600 mb-2">
          Follow the live standings and see real-time updates from the Masters Tournament.
        </p>
        <p className="text-gray-600 text-sm">
          Use the search bar to quickly find participants by name. You can view all 
          participants or just the top entries.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <PoolStandings />
        <Leaderboard />
      </div>
    </Layout>
  );
};

export default Index;
