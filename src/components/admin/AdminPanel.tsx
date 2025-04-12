
import React, { useState, useEffect } from "react";
import { Lock, FileSpreadsheet, RefreshCcw, Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GolferScore, PoolParticipant, ADMIN_PASSWORD } from "@/types";
import { fetchDataFromGoogleSheets } from "@/services/api";
import { getScoreClass, formatScore } from "@/utils/leaderboardUtils";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [sheetsLeaderboard, setSheetsLeaderboard] = useState<GolferScore[]>([]);
  const [sheetsPoolStandings, setSheetsPoolStandings] = useState<PoolParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const fetchGoogleSheetsData = async (dataType: 'leaderboard' | 'pool') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataFromGoogleSheets(dataType);
      if (dataType === 'leaderboard') {
        setSheetsLeaderboard(data);
      } else {
        setSheetsPoolStandings(data);
      }
      console.log(`Loaded ${dataType} data from Google Sheets:`, data);
    } catch (error) {
      console.error(`Error loading ${dataType} data:`, error);
      setError(`Failed to load ${dataType} data from Google Sheets.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if previously authenticated
    const isAuth = localStorage.getItem("adminAuthenticated") === "true";
    setAuthenticated(isAuth);
    
    // Load data if authenticated
    if (isAuth && showSheet) {
      fetchGoogleSheetsData('leaderboard');
      fetchGoogleSheetsData('pool');
    }
  }, [showSheet]);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border border-masters-gold/20">
        <div className="flex items-center gap-2 text-masters-green mb-4">
          <Lock size={24} />
          <h2 className="text-xl font-serif">Admin Access</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full bg-masters-green hover:bg-masters-green/90">
            Unlock Admin Panel
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-masters-gold/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-masters-green" />
          <h2 className="text-xl font-serif text-masters-green">Admin Data Panel</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm"
            variant="outline"
            onClick={() => setShowSheet(!showSheet)}
            className="flex items-center gap-1"
          >
            {showSheet ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSheet ? "Hide Sheet Data" : "Show Sheet Data"}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              fetchGoogleSheetsData('leaderboard');
              fetchGoogleSheetsData('pool');
            }}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("adminAuthenticated");
              setAuthenticated(false);
            }}
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showSheet && (
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="bg-masters-light w-full justify-start mb-4">
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-masters-green data-[state=active]:text-white">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="standings" className="data-[state=active]:bg-masters-green data-[state=active]:text-white">
              Pool Standings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard" className="mt-0">
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-masters-green text-white">
                      <TableHead className="text-white">Pos</TableHead>
                      <TableHead className="text-white">Player</TableHead>
                      <TableHead className="text-white text-right">Score</TableHead>
                      <TableHead className="text-white text-right">Today</TableHead>
                      <TableHead className="text-white text-right">Thru</TableHead>
                      <TableHead className="text-white text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <RefreshCcw size={24} className="animate-spin mx-auto text-masters-green" />
                        </TableCell>
                      </TableRow>
                    ) : sheetsLeaderboard.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No leaderboard data from Google Sheets
                        </TableCell>
                      </TableRow>
                    ) : (
                      sheetsLeaderboard.map((golfer, index) => (
                        <TableRow key={`${golfer.name}-${index}`} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                          <TableCell className="font-medium">{golfer.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {golfer.name}
                              {golfer.status === 'cut' && <span className="ml-2 text-xs text-red-500">(CUT)</span>}
                              {golfer.status === 'withdrawn' && <span className="ml-2 text-xs text-red-500">(WD)</span>}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right ${getScoreClass(golfer.score)}`}>
                            {formatScore(golfer.score)}
                          </TableCell>
                          <TableCell className={`text-right ${getScoreClass(golfer.today)}`}>
                            {formatScore(golfer.today)}
                          </TableCell>
                          <TableCell className="text-right">{golfer.thru}</TableCell>
                          <TableCell className="text-right">
                            {golfer.status || "active"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="standings" className="mt-0">
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-masters-green text-white">
                      <TableHead className="text-white">Pos</TableHead>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white text-right">Score</TableHead>
                      <TableHead className="text-white">Picks</TableHead>
                      <TableHead className="text-white text-center">Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <RefreshCcw size={24} className="animate-spin mx-auto text-masters-green" />
                        </TableCell>
                      </TableRow>
                    ) : sheetsPoolStandings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No pool standings data from Google Sheets
                        </TableCell>
                      </TableRow>
                    ) : (
                      sheetsPoolStandings.map((participant, index) => (
                        <TableRow key={`${participant.name}-${index}`} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                          <TableCell className="font-medium">{participant.position}</TableCell>
                          <TableCell>{participant.name}</TableCell>
                          <TableCell className="text-right">{participant.totalScore}</TableCell>
                          <TableCell>
                            <span className="text-xs">
                              {participant.picks.join(", ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {participant.paid ? (
                              <Check size={16} className="text-green-500 mx-auto" />
                            ) : (
                              <X size={16} className="text-red-500 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminPanel;
