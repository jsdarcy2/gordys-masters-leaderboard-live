
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PasscodeForm from "@/components/entry/PasscodeForm";
import PlayerPicksForm from "@/components/entry/PlayerPicksForm";
import MastersRulesSummary from "@/components/entry/MastersRulesSummary";
import Image from "@/components/ui/image";

const EntryPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handlePasscodeSuccess = () => {
    setAuthenticated(true);
    toast("Passcode verified! Welcome to Gordy's Masters Pool.", {
      description: "Please select your players to enter the pool.",
      duration: 5000,
    });
  };

  const handlePicksSubmitted = () => {
    toast.success("Your picks have been submitted successfully!", {
      description: "Good luck in the tournament!",
      duration: 5000,
    });
    // Redirect to leaderboard after submission
    setTimeout(() => navigate("/leaderboard"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header banner with Augusta bridge image */}
      <div className="relative h-48 md:h-64 lg:h-72 w-full bg-masters-green overflow-hidden">
        <Image 
          src="/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png"
          alt="Augusta National Bridge"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-masters-green opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif font-bold drop-shadow-lg">
            Gordy's Masters Pool 2025
          </h1>
          <p className="text-masters-yellow text-lg md:text-xl mt-2 italic font-serif drop-shadow-md">
            "Welcome friends, to a tradition unlike any other."
          </p>
          <p className="text-white text-sm mt-1">- Jim Nantz</p>
        </div>
      </div>

      <div className="flex-grow bg-masters-cream bg-opacity-40">
        {/* Subtle pattern background */}
        <div className="fixed inset-0 bg-[url('/lovable-uploads/7fedc782-7255-440b-827a-d91d5853b279.png')] bg-cover bg-center opacity-[0.03] pointer-events-none -z-10"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column with passcode or player form */}
            <div className="lg:col-span-2">
              {!authenticated ? (
                <PasscodeForm onSuccess={handlePasscodeSuccess} />
              ) : (
                <PlayerPicksForm onSubmit={handlePicksSubmitted} />
              )}
            </div>
            
            {/* Right column with rules */}
            <div className="lg:col-span-1">
              <MastersRulesSummary />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-masters-green text-white py-3 border-t-2 border-masters-gold text-center text-sm">
        <p>© {new Date().getFullYear()} Gordy's Masters Pool</p>
        <p className="text-xs text-masters-yellow mt-1">A tradition of friendship and golf</p>
      </footer>
    </div>
  );
};

export default EntryPage;
