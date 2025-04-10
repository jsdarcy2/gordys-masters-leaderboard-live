
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
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Welcome to Gordy's Masters Pool
        </h2>
        <p className="text-gray-600">
          Follow the live standings and see real-time updates from the Masters Tournament.
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
