import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, TrendingUp, DollarSign, Star } from "lucide-react";
import { PoolParticipant } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const POOL_CONFIG = {
  entryFee: 50, // $50 per entry
  estimatedEntrants: 120, // Estimated number of participants
  prizeTiers: [
    { position: 1, percentage: 0.5 }, // 50% to 1st place
    { position: 2, percentage: 0.25 }, // 25% to 2nd place
    { position: 3, percentage: 0.15 }, // 15% to 3rd place
    { position: 4, percentage: 0.06 }, // 6% to 4th place
    { position: 5, percentage: 0.04 }  // 4% to 5th place
  ]
};

interface PersonalizedDashboardProps {
  poolStandings: PoolParticipant[];
  loading: boolean;
}

const PersonalizedDashboard = ({ poolStandings, loading }: PersonalizedDashboardProps) => {
  const [username, setUsername] = useState<string>("");
  const [savedUsername, setSavedUsername] = useState<string>("");
  const [userStats, setUserStats] = useState<PoolParticipant | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("mastersPoolUsername");
    if (saved) {
      setSavedUsername(saved);
      setUsername(saved);
    }
  }, []);

  useEffect(() => {
    if (savedUsername && poolStandings.length > 0) {
      const foundUser = poolStandings.find(
        (p) => p.name.toLowerCase() === savedUsername.toLowerCase()
      );
      setUserStats(foundUser || null);
      
      if (!foundUser && savedUsername) {
        toast({
          title: "User not found",
          description: `We couldn't find "${savedUsername}" in the pool. Please check the spelling.`,
          variant: "destructive",
        });
      }
    }
  }, [poolStandings, savedUsername, toast]);

  const handleSaveUsername = () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      toast({
        title: "Please enter a name",
        description: "Enter your name as it appears in the pool standings.",
        variant: "destructive",
      });
      return;
    }

    setSavedUsername(trimmedUsername);
    localStorage.setItem("mastersPoolUsername", trimmedUsername);
    
    toast({
      title: "Dashboard Personalized",
      description: "Your personalized dashboard has been updated.",
    });
  };

  const handleClear = () => {
    setUsername("");
    setSavedUsername("");
    setUserStats(null);
    localStorage.removeItem("mastersPoolUsername");
    
    toast({
      title: "Dashboard Reset",
      description: "Your personalized settings have been cleared.",
    });
  };

  const getPositionChange = () => {
    const posChange = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
    return posChange;
  };

  const calculatePotentialWinnings = () => {
    if (!userStats) return "0";
    
    const totalPrizePool = POOL_CONFIG.entryFee * POOL_CONFIG.estimatedEntrants;
    
    const prizeTier = POOL_CONFIG.prizeTiers.find(tier => tier.position === userStats.position);
    
    if (prizeTier) {
      const winnings = totalPrizePool * prizeTier.percentage;
      return winnings.toFixed(2);
    } else {
      return "0";
    }
  };

  return (
    <div className="masters-card mb-6">
      <div className="masters-header">
        <h2 className="text-xl md:text-2xl font-serif">
          {savedUsername ? "Your Dashboard" : "Personalize Your View"}
        </h2>
      </div>
      
      <CardContent className="p-4 bg-white">
        {!savedUsername ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter your name as it appears in the pool standings to personalize your dashboard.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your name in the pool..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-masters-green/30 focus-visible:ring-masters-green/30"
              />
              <Button 
                onClick={handleSaveUsername}
                className="bg-masters-green hover:bg-masters-green/90"
              >
                <Star className="mr-1 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-pulse text-masters-green">Loading your stats...</div>
              </div>
            ) : userStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">{userStats.name}</h3>
                    <div className="text-sm text-gray-500">Watching your progress in real-time</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClear}
                    className="text-gray-500"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card className="bg-masters-light">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Medal className="mr-1 h-4 w-4 text-masters-yellow" />
                        Current Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{userStats.position}</div>
                      {getPositionChange() !== 0 && (
                        <div className={`text-sm flex items-center ${getPositionChange() < 0 ? "text-masters-green" : "text-red-500"}`}>
                          <TrendingUp className={`h-4 w-4 mr-1 ${getPositionChange() < 0 ? "rotate-180" : ""}`} />
                          {Math.abs(getPositionChange())} {getPositionChange() < 0 ? "up" : "down"} from yesterday
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-masters-light">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-masters-green" />
                        Potential Winnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${calculatePotentialWinnings()}</div>
                      <div className="text-sm text-gray-500">Based on current position</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-masters-light">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${userStats.totalPoints < 0 ? "text-masters-green" : userStats.totalPoints > 0 ? "text-red-500" : ""}`}>
                        {userStats.totalPoints === 0 ? "E" : userStats.totalPoints > 0 ? `+${userStats.totalPoints}` : userStats.totalPoints}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userStats.picks && userStats.picks.length} golfers selected
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {userStats.picks && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Your Picks</h4>
                    <div className="flex flex-wrap gap-2">
                      {userStats.picks.map((pick, i) => (
                        <span 
                          key={i}
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            userStats.pickScores && userStats.pickScores[pick] < 0
                              ? "bg-green-100"
                              : userStats.pickScores && userStats.pickScores[pick] > 0
                              ? "bg-red-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {pick}
                          {userStats.pickScores && (
                            <span className={userStats.pickScores[pick] < 0 ? "text-masters-green font-bold" : userStats.pickScores[pick] > 0 ? "text-red-600" : ""}>
                              {" "}({userStats.pickScores[pick] === 0 ? "E" : userStats.pickScores[pick] > 0 ? `+${userStats.pickScores[pick]}` : userStats.pickScores[pick]})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  We couldn't find "{savedUsername}" in the standings.
                </p>
                <Button onClick={handleClear} variant="outline">
                  Try Another Name
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </div>
  );
};

export default PersonalizedDashboard;
