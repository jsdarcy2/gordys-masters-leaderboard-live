
import { ReactNode } from "react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const bgPatternOpacity = isMobile ? "opacity-[0.0015]" : "opacity-[0.0035]";
  const floralOpacity = isMobile ? "opacity-[0.0015]" : "opacity-[0.0035]";

  return (
    <div className="min-h-screen flex flex-col bg-masters-cream bg-opacity-70">
      {/* Augusta-inspired subtle background pattern with hints of floral texture - more subtle now */}
      <div className={`fixed inset-0 bg-[url('/lovable-uploads/7fedc782-7255-440b-827a-d91d5853b279.png')] bg-cover bg-center ${bgPatternOpacity} pointer-events-none -z-10`}></div>
      
      {/* Extremely subtle floral accents - almost imperceptible but add depth */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        <div className={`absolute top-0 right-0 w-1/4 h-1/4 ${floralOpacity}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200">
            {/* Abstracted azalea shape */}
            <path d="M50,20 Q65,5 80,20 Q95,35 80,50 Q65,65 50,50 Q35,65 20,50 Q5,35 20,20 Q35,5 50,20" fill="currentColor" />
          </svg>
        </div>
        <div className={`absolute bottom-0 left-0 w-1/4 h-1/4 ${floralOpacity}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-200">
            {/* Abstracted golden bell shape */}
            <path d="M40,80 Q50,60 60,80 L65,30 Q50,15 35,30 L40,80" fill="currentColor" />
          </svg>
        </div>
      </div>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 md:py-10 max-w-7xl animate-fade-in">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-masters-darkgreen via-masters-green to-masters-darkgreen text-white py-5 md:py-8 mt-8 md:mt-12 border-t-4 border-masters-gold/50 relative overflow-hidden">
        {/* Subtle footer bridge image */}
        <div className="absolute inset-0 opacity-08">
          <img 
            src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
            alt="Augusta National Bridge" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Gradient overlay with subtle floral hints */}
        <div className="absolute inset-0 bg-gradient-to-r from-masters-dark via-masters-green to-masters-dark opacity-85"></div>
        
        {/* Extremely subtle floral accent patterns */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              {/* Abstract magnolia pattern */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute top-0 left-0 w-1/4 h-1/4">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              {/* Abstract dogwood pattern */}
              <path d="M50,20 L60,50 L90,60 L60,70 L50,100 L40,70 L10,60 L40,50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm md:text-base font-serif">
                © {new Date().getFullYear()} Gordy's Masters Pool 2025
              </p>
              <p className="text-xs mt-1 text-masters-yellow/90">
                Updated with real-time data
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-4 mb-3">
                <a href="#" className="text-white/80 hover:text-masters-yellow transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-white/80 hover:text-masters-yellow transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div>
              <div className="text-xs text-white/70">
                <a href="#" className="underline hover:text-white px-2">Privacy Policy</a>
                <a href="#" className="underline hover:text-white px-2">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
