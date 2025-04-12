
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SocialTabs from "@/components/social/SocialTabs";
import { Helmet } from "react-helmet";

const SocialPage = () => {
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
          
          <SocialTabs />
        </div>
      </div>
    </Layout>
  );
};

export default SocialPage;
