
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import LiveStream from "@/components/LiveStream";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Info, AlertTriangle, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const WatchLivePage = () => {
  const isMobile = useIsMobile();
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);
  
  useEffect(() => {
    console.log("Watch Live page mounted");
    
    // Set page title
    document.title = "Watch The Masters Live - Gordy's Masters Pool";
    
    // Check if cookies are enabled
    const checkCookies = () => {
      try {
        // Try to set a test cookie
        document.cookie = "cookieTest=1; SameSite=Strict; Secure";
        const cookieEnabled = document.cookie.indexOf("cookieTest=") !== -1;
        
        // Clean up test cookie
        document.cookie = "cookieTest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        setCookiesEnabled(cookieEnabled);
        console.log("Cookies enabled:", cookieEnabled);
      } catch (e) {
        console.error("Error checking cookies:", e);
        setCookiesEnabled(false);
      }
    };
    
    checkCookies();
    
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
      
      {cookiesEnabled === false && (
        <Alert variant="destructive" className="mb-4 border-amber-400 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Cookies Required for Live Stream</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">The embedded live stream requires cookies to be enabled on your browser.</p>
            <div className="mt-3 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 border-amber-500 text-amber-700 bg-white hover:bg-amber-50"
                onClick={() => {
                  // Open device settings info based on browser/platform
                  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                    window.open('https://support.apple.com/en-us/HT201265', '_blank');
                  } else if (/android/i.test(navigator.userAgent)) {
                    window.open('https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid', '_blank');
                  } else {
                    window.open('https://support.google.com/accounts/answer/61416', '_blank');
                  }
                }}
              >
                <Settings size={14} className="mr-1.5" />
                Enable Cookies
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="bg-masters-green text-white hover:bg-masters-green/90"
                onClick={() => {
                  window.open('https://www.masters.com/en_US/watch/index.html', '_blank');
                }}
              >
                <ExternalLink size={14} className="mr-1.5" />
                Open on Masters.com
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <Info size={isMobile ? 14 : 16} className="text-masters-yellow mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              If you're experiencing playback issues on mobile, try opening the stream directly on{" "}
              <a 
                href="https://www.masters.com/en_US/watch/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-masters-green hover:underline"
              >
                Masters.com
              </a>
              . For the best experience, use the official Masters app available for iOS and Android.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WatchLivePage;
