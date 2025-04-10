
import { useEffect } from "react";
import Layout from "@/components/Layout";
import GreenRobeWinners from "@/components/GreenRobeWinners";

const ArchivePage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Archive page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Green Robe Winners & Traditions
        </h2>
        <p className="text-gray-600 mb-2">
          Past winners, historical data, and the prestigious Green Robe tradition.
        </p>
        <p className="text-sm text-gray-500 italic">
          "A tradition unlike any other" - Jim Nantz
        </p>
      </div>
      
      <GreenRobeWinners />
    </Layout>
  );
};

export default ArchivePage;
