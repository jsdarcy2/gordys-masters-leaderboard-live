
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
        
        {/* Augusta-styled panel matching the aesthetic of other pages */}
        <div className="augusta-panel p-6 rounded-md shadow-subtle border-masters-gold/20">
          <SocialTabs />
        </div>
      </div>
    </Layout>
  );
};

export default SocialPage;
