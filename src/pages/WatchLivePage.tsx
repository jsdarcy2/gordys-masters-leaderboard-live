
import { useEffect } from "react";
import Layout from "@/components/Layout";
import LiveStream from "@/components/LiveStream";
import { Separator } from "@/components/ui/separator";
import { Eye, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const WatchLivePage = () => {
  const isMobile = useIsMobile();
  
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
      <div className="mb-4 md:mb-6">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-masters-green flex items-center`}>
          <Eye size={isMobile ? 20 : 24} className="mr-2 text-masters-yellow" />
          Watch The Masters {isMobile ? 'Live' : 'Tournament Live'}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Experience the excitement of The Masters with live coverage from Augusta National.
        </p>
        <Separator className="my-3 md:my-4 bg-masters-green/10" />
      </div>
      
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-3 md:mb-4 text-center bg-masters-green/5 p-2 md:p-3 rounded-md border border-masters-green/10">
          <h3 className="font-serif text-base md:text-lg text-masters-green font-medium">
            Live Now from Augusta National
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            The official live stream from The Masters Tournament
          </p>
        </div>
        
        <LiveStream />
        
        <div className="mt-4 md:mt-6 text-center">
          <a 
            href="https://www.masters.com/en_US/watch/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-sm bg-masters-green text-white rounded-md hover:bg-masters-green/90 transition-colors"
          >
            <ExternalLink size={isMobile ? 14 : 16} className="mr-1.5 md:mr-2" />
            Visit Masters.com for more coverage
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default WatchLivePage;
