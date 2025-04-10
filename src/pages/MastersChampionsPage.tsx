
import { useEffect } from "react";
import Layout from "@/components/Layout";
import MastersChampions from "@/components/MastersChampions";

const MastersChampionsPage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Masters Champions page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-3 md:mb-4">
          Masters Tournament Champions
        </h2>
        <p className="text-gray-600 mb-2">
          Celebrating the historic legacy of golf's most prestigious event.
        </p>
        <p className="text-sm text-gray-500 italic">
          "A tradition unlike any other" - Jim Nantz
        </p>
      </div>
      
      <MastersChampions />
    </Layout>
  );
};

export default MastersChampionsPage;
