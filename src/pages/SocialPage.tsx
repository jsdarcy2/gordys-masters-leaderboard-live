
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SocialTabs from "@/components/social/SocialTabs";
import Maintenance from "@/components/Maintenance";
import { Helmet } from "react-helmet";

const SocialPage = () => {
  // Flag to control whether to show maintenance message or actual content
  const isUnderMaintenance = true;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Gordy's Masters Pool | Social</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <div className="augusta-panel p-4 md:p-6 mb-8">
          <h1 className="font-serif text-2xl md:text-3xl text-masters-dark mb-2">Social</h1>
          <p className="text-gray-600 mb-6">Connect with other Masters fans and share your experiences</p>
          
          {isUnderMaintenance ? (
            <Maintenance 
              message="We're enhancing our social features to provide you with a better experience. Thank you for your patience." 
              estimatedTime="April 15, 2025"
            />
          ) : (
            <SocialTabs />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SocialPage;
