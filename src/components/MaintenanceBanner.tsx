
import React from "react";
import { useLocation } from "react-router-dom";
import Image from "@/components/ui/image";

interface MaintenanceBannerProps {
  isVisible?: boolean;
}

const MaintenanceBanner = ({ isVisible = true }: MaintenanceBannerProps) => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  
  // Don't show on admin page
  if (isAdminPage || !isVisible) return null;
  
  return (
    <div className="w-full bg-masters-dark mb-6 shadow-lg border-b-2 border-masters-gold overflow-hidden">
      <div className="container mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mr-4 md:mr-6 rounded-full bg-masters-darkgreen/40 overflow-hidden border-2 border-masters-gold/60">
            <Image 
              src="/lovable-uploads/56852a7d-da04-4d19-900e-214f0410f0c5.png" 
              alt="Jim Nantz"
              className="w-full h-full object-cover object-top"
            />
          </div>
          
          <div className="flex-grow flex flex-col text-center md:text-left">
            <div className="relative">
              <div className="speech-bubble bg-white/95 p-4 rounded-lg shadow-md font-serif relative z-10">
                <div className="absolute -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 rotate-45 bg-white/95"></div>
                <p className="text-lg md:text-xl text-masters-dark italic font-medium">
                  "Site under maintenance, we'll be right back folks."
                </p>
                <p className="text-xs md:text-sm text-masters-dark/70 mt-1 non-italic">— Jim Nantz</p>
              </div>
            </div>
            
            <div className="mt-4 text-masters-gold/90 text-sm px-4">
              <p>
                <span className="live-indicator inline-block mr-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="uppercase tracking-wider">Live update in progress</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
