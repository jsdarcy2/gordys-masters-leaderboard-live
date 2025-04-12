
import Layout from "@/components/Layout";
import SocialTabs from "@/components/social/SocialTabs";

const SocialPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-serif text-masters-darkgreen">Masters Social Hub</h1>
          <p className="text-gray-600">Share and connect with other Masters pool participants</p>
        </div>
        
        {/* Subtle augusta styling consistent with other pages */}
        <div className="augusta-panel p-6 rounded-md shadow-subtle">
          <SocialTabs />
        </div>
      </div>
    </Layout>
  );
};

export default SocialPage;
