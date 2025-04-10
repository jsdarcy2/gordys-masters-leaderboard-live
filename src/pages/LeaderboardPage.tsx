
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";

const LeaderboardPage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Leaderboard page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Masters Tournament Leaderboard
        </h2>
        <p className="text-gray-600">
          Live scoring updates from Augusta National Golf Club.
        </p>
      </div>
      
      <Leaderboard />
    </Layout>
  );
};

export default LeaderboardPage;
