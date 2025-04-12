
import React from "react";
import { AlertTriangle, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CookieNoticeProps {
  showFullMessage?: boolean;
  onOpenExternal?: () => void;
}

const CookieNotice: React.FC<CookieNoticeProps> = ({ 
  showFullMessage = true,
  onOpenExternal 
}) => {
  const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  
  const openCookieSettings = () => {
    if (isIOS) {
      window.open('https://support.apple.com/en-us/HT201265', '_blank');
    } else if (isAndroid) {
      window.open('https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid', '_blank');
    } else {
      window.open('https://support.google.com/accounts/answer/61416', '_blank');
    }
  };

  return (
    <div className="w-full">
      {showFullMessage ? (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Stream Not Loading?</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">The embedded stream requires cookies to function properly.</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-500 text-amber-700 bg-white hover:bg-amber-50"
                onClick={openCookieSettings}
              >
                Enable Cookies
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                className="bg-masters-green text-white hover:bg-masters-green/90"
                onClick={onOpenExternal || (() => window.open('https://www.masters.com/en_US/watch/index.html', '_blank'))}
              >
                <ExternalLink size={14} className="mr-1.5" />
                Open on Masters.com
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 flex items-start gap-2">
          <Info size={14} className="mt-0.5 text-amber-600" />
          <div>
            <span className="font-medium">Having trouble viewing?</span>{" "}
            <button 
              onClick={onOpenExternal || (() => window.open('https://www.masters.com/en_US/watch/index.html', '_blank'))}
              className="text-masters-green hover:underline font-medium"
            >
              Open on Masters.com
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieNotice;
