
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PlayerSelections from "@/components/PlayerSelections";
import PaymentStatus from "@/components/PaymentStatus";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";
import { fetchPoolStandings } from "@/services/api";
import { PoolParticipant } from "@/types";

const SelectionsPage = () => {
  const [poolStandings, setPoolStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load pool standings for the personalized dashboard
  useEffect(() => {
    const loadPoolStandings = async () => {
      try {
        setLoading(true);
        const data = await fetchPoolStandings();
        setPoolStandings(data);
      } catch (err) {
        console.error("Failed to load pool standings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPoolStandings();
  }, []);

  // Log component mount for debugging
  useEffect(() => {
    console.log("Selections page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Player Selections
        </h2>
        <p className="text-gray-600">
          See player selections ranked by their current position in the pool standings.
        </p>
      </div>
      
      <PersonalizedDashboard 
        poolStandings={poolStandings}
        loading={loading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayerSelections />
        </div>
        <div>
          <PaymentStatus />
        </div>
      </div>
    </Layout>
  );
};

export default SelectionsPage;
