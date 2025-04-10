
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Rules from "@/components/Rules";

const RulesPage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Rules page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Pool Rules
        </h2>
        <p className="text-gray-600">
          Official rules and guidelines for Gordy's Masters Pool 20th edition.
        </p>
      </div>
      
      <Rules />
    </Layout>
  );
};

export default RulesPage;
