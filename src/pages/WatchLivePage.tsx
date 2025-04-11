
import { useEffect } from "react";
import Layout from "@/components/Layout";
import LiveStream from "@/components/LiveStream";

const WatchLivePage = () => {
  useEffect(() => {
    console.log("Watch Live page mounted");
    
    // Set page title
    document.title = "Watch The Masters Live - Gordy's Masters Pool";
    
    return () => {
      // Reset title when unmounting
      document.title = "Gordy's Masters Pool";
    };
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4 flex items-center">
          Watch The Masters Tournament Live
        </h2>
        <p className="text-gray-600">
          Experience the excitement of The Masters with live coverage from Augusta National.
        </p>
      </div>
      
      <LiveStream />
    </Layout>
  );
};

export default WatchLivePage;
