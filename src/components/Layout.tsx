
import { ReactNode } from "react";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-masters-cream bg-opacity-40">
      {/* Augusta-inspired subtle background pattern */}
      <div className="fixed inset-0 bg-[url('/lovable-uploads/7fedc782-7255-440b-827a-d91d5853b279.png')] bg-cover bg-center opacity-[0.03] pointer-events-none -z-10"></div>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {children}
      </main>
      
      <footer className="bg-masters-green text-white py-4 md:py-6 mt-10 border-t-4 border-masters-gold relative overflow-hidden">
        {/* Subtle footer bridge image */}
        <div className="absolute inset-0 opacity-15">
          <img 
            src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png" 
            alt="Augusta National Bridge" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-masters-dark via-masters-green to-masters-dark opacity-85"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm md:text-base font-serif">
                © {new Date().getFullYear()} Gordy's Masters Pool 2025
              </p>
              <p className="text-xs mt-1 text-masters-yellow">
                Updated with real-time data
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-3 mb-2">
                <a href="#" className="text-white hover:text-masters-yellow transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-white hover:text-masters-yellow transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
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
