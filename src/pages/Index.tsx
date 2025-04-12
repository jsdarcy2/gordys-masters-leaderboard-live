import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import PoolStandings from "@/components/PoolStandings";
import { Flag, Trophy, Clock } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card 
          className="h-full border bg-gradient-to-br from-white/90 to-white/90 border-masters-green/20 hover:border-masters-green/40 shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => window.location.href = "/leaderboard"}
        >
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png" 
              alt=""
              className="w-full h-full object-cover opacity-[0.045]"
            />
          </div>
          
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/3 opacity-[0.02] bg-masters-green"></div>
            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white opacity-[0.03]"></div>
            <div className="absolute top-2/3 left-0 w-full h-1/3 opacity-[0.02] bg-masters-green"></div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-masters-green/10 to-white/70"></div>
          
          <div className="absolute top-3 right-3 opacity-[0.05] pointer-events-none">
            <Flag size={24} className="text-masters-green" />
          </div>
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center mb-3">
              <div className="p-2.5 rounded-full bg-masters-green/10 text-masters-darkgreen">
                <Flag className="text-masters-darkgreen" />
              </div>
              <h3 className="text-xl font-serif ml-3 text-masters-darkgreen">
                Tournament
              </h3>
            </div>
            
            <p className="text-gray-700 mb-4 font-medium">
              Follow the live leaderboard
            </p>
            
            <div className="mt-3 flex items-center justify-between text-masters-green text-sm font-medium">
              <span className="font-serif">View details</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </CardContent>
        </Card>
            
        <Card 
          className="h-full border bg-gradient-to-br from-masters-gold/20 to-masters-lightgold/40 border-masters-gold/30 hover:border-masters-gold/60 shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => window.location.href = "/selections"}
        >
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png" 
              alt=""
              className="w-full h-full object-cover opacity-[0.045]"
            />
          </div>
          
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/3 opacity-[0.02] bg-masters-gold"></div>
            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white opacity-[0.03]"></div>
            <div className="absolute top-2/3 left-0 w-full h-1/3 opacity-[0.02] bg-masters-gold"></div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-masters-gold/30 to-masters-lightgold/20"></div>
          
          <div className="absolute top-3 right-3 opacity-[0.05] pointer-events-none">
            <Flag size={24} className="text-masters-darkgreen" />
          </div>
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center mb-3">
              <div className="p-2.5 rounded-full bg-masters-green/10 text-masters-darkgreen">
                <Trophy className="text-masters-gold" />
              </div>
              <h3 className="text-xl font-serif ml-3 text-masters-darkgreen">
                Pool Standings
              </h3>
            </div>
            
            <p className="text-gray-700 mb-4 font-medium">
              See who's winning the pool
            </p>
            
            <div className="mt-3 flex items-center justify-between text-masters-darkgreen text-sm font-medium">
              <span className="font-serif">View details</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </CardContent>
        </Card>
            
        <Card 
          className="h-full border bg-gradient-to-br from-white/90 to-white/90 border-masters-green/20 hover:border-masters-green/40 shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => window.location.href = "/archive"}
        >
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="/lovable-uploads/da04fdbb-1d5b-4ccc-88b2-56a6c6f96db5.png" 
              alt=""
              className="w-full h-full object-cover opacity-[0.045]"
            />
          </div>
          
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/3 opacity-[0.02] bg-masters-green"></div>
            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white opacity-[0.03]"></div>
            <div className="absolute top-2/3 left-0 w-full h-1/3 opacity-[0.02] bg-masters-green"></div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-masters-green/10 to-white/70"></div>
          
          <div className="absolute top-3 right-3 opacity-[0.05] pointer-events-none">
            <Flag size={24} className="text-masters-green" />
          </div>
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-center mb-3">
              <div className="p-2.5 rounded-full bg-masters-green/10 text-masters-darkgreen">
                <Clock className="text-masters-darkgreen" />
              </div>
              <h3 className="text-xl font-serif ml-3 text-masters-darkgreen">
                Past Champions
              </h3>
            </div>
            
            <p className="text-gray-700 mb-4 font-medium">
              Celebrating 20 years
            </p>
            
            <div className="mt-3 flex items-center justify-between text-masters-green text-sm font-medium">
              <span className="font-serif">View details</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full rounded-lg overflow-hidden shadow-card border border-masters-green/10">
        <PoolStandings />
      </div>
    </Layout>
  );
};

export default Index;
