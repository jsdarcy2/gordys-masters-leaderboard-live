
import { useState, useEffect } from 'react';

export function useStreamStatus(streamUrl?: string) {
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [iframeLoadAttempts, setIframeLoadAttempts] = useState(0);
  
  // This retries the iframe load if it fails initially
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // If still in loading state after 5 seconds, consider retrying
    if (iframeStatus === 'loading') {
      timeoutId = setTimeout(() => {
        if (iframeStatus === 'loading' && iframeLoadAttempts < 2) {
          setIframeLoadAttempts(prev => prev + 1);
          setIframeStatus('error'); // Consider it an error so we can retry
        }
      }, 5000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [iframeStatus, iframeLoadAttempts]);

  // Reset status when URL changes
  useEffect(() => {
    if (streamUrl) {
      setIframeStatus('loading');
    }
  }, [streamUrl]);

  // Check if third-party cookies are likely disabled
  const [cookiesLikelyDisabled, setCookiesLikelyDisabled] = useState(false);
  
  useEffect(() => {
    // Detect likely cookie settings issues
    // This is a basic check, a more comprehensive check would involve testing iframe access
    try {
      // Try to set and read a cookie
      document.cookie = "streamTest=1; SameSite=None; Secure";
      const cookieEnabled = document.cookie.indexOf("streamTest=") !== -1;
      document.cookie = "streamTest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // iOS Safari and some browsers block third-party cookies by default
      const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
      const isWebkit = /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      // If on iOS with WebKit (Safari) or cookies test failed, third-party cookies might be disabled
      setCookiesLikelyDisabled(!cookieEnabled || (isIOS && isWebkit));
    } catch (e) {
      console.error("Error checking cookies:", e);
      setCookiesLikelyDisabled(true);
    }
  }, []);

  return {
    iframeStatus,
    setIframeStatus,
    iframeLoadAttempts,
    cookiesLikelyDisabled,
    needsStreamHelp: cookiesLikelyDisabled || iframeStatus === 'error' || iframeLoadAttempts > 1
  };
}
