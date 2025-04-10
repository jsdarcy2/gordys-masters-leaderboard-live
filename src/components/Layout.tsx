
import { ReactNode } from "react";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {children}
      </main>
      <footer className="bg-masters-green text-white py-3 md:py-4 mt-10">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <p className="text-sm">
            © {new Date().getFullYear()} Gordy's Masters Pool 2025
          </p>
          <p className="text-xs mt-1 text-masters-yellow">
            Updated with real-time data
          </p>
          <p className="text-xs mt-3 text-white/70">
            <a href="#" className="underline hover:text-white">Privacy Policy</a> • 
            <a href="#" className="underline hover:text-white ml-2">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
