
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PlayerSelections from "@/components/PlayerSelections";
import PaymentStatus from "@/components/PaymentStatus";
import TeamSelectionsTable from "@/components/pool/TeamSelectionsTable";
import { fetchPlayerSelections } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SelectionsPage = () => {
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load participant count
  useEffect(() => {
    const loadParticipantCount = async () => {
      try {
        setLoading(true);
        setError(null);
        const selectionsData = await fetchPlayerSelections();
        const count = Object.keys(selectionsData).length;
        console.log(`Loaded ${count} participants with names:`, Object.keys(selectionsData));
        setParticipantCount(count);
        
        // Additional verification to check if we have all expected participants
        if (count < 10) {
          console.warn(`Expected more participants but got ${count}`);
          toast({
            title: "Using demo data",
            description: `Currently showing demo data with ${count} participants due to connection issues.`,
            variant: "warning",
          });
        }
      } catch (error) {
        console.error("Error loading participant count:", error);
        setError("Failed to load participant data. Using demo data instead.");
        toast({
          title: "Data loading issue",
          description: "Using demo data while we're unable to connect to the tournament API.",
          variant: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadParticipantCount();
    
    // Set up refresh interval during the tournament - every minute
    const refreshInterval = setInterval(loadParticipantCount, 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [toast]);

  // Log component mount for debugging
  useEffect(() => {
    console.log("Selections page mounted");
  }, []);

  const handleManualRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Attempting to get the latest tournament data...",
    });
    
    // Reset state and trigger the data loading
    setLoading(true);
    setError(null);
    
    const loadParticipantCount = async () => {
      try {
        const selectionsData = await fetchPlayerSelections();
        const count = Object.keys(selectionsData).length;
        console.log(`Loaded ${count} participants with names:`, Object.keys(selectionsData));
        setParticipantCount(count);
      } catch (error) {
        console.error("Error during manual refresh:", error);
        setError("Failed to load participant data. Using demo data instead.");
        toast({
          title: "Data loading issue",
          description: "Still unable to connect to the tournament API. Using demo data.",
          variant: "warning",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipantCount();
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-4">
          Player Selections
        </h2>
        <p className="text-gray-600">
          See all {loading ? "..." : participantCount} participant team selections for The Masters, ranked by their current position in the pool standings.
        </p>
      </div>
      
      {error && (
        <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Data Connection Issue</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            {error}
            <Button 
              onClick={handleManualRefresh} 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-white flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pool" className="mb-6">
        <TabsList className="bg-masters-light">
          <TabsTrigger value="pool" className="data-[state=active]:bg-masters-green data-[state=active]:text-white">Pool Standings</TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-masters-green data-[state=active]:text-white">All Team Selections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pool" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PlayerSelections />
            </div>
            <div>
              <PaymentStatus />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6">
          <TeamSelectionsTable />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SelectionsPage;
