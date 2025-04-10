
import { ReactNode } from "react";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="bg-masters-green text-white py-3 md:py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Gordy's Masters Pool 2025
          </p>
          <p className="text-xs mt-1 text-masters-yellow">
            Updated with real-time data
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
