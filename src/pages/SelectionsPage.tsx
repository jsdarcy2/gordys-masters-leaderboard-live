
import { useEffect } from "react";
import Layout from "@/components/Layout";
import PlayerSelections from "@/components/PlayerSelections";
import PaymentStatus from "@/components/PaymentStatus";

const SelectionsPage = () => {
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
          See who everyone picked for this year's Masters Tournament.
        </p>
      </div>
      
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
