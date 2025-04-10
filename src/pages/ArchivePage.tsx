
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Archive from "@/components/Archive";

const ArchivePage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Archive page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Archive
        </h2>
        <p className="text-gray-600">
          Past winners and historical data from previous years.
        </p>
      </div>
      
      <Archive />
    </Layout>
  );
};

export default ArchivePage;
