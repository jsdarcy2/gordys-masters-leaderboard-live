
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PlayerSelections from "@/components/PlayerSelections";
import PaymentStatus from "@/components/PaymentStatus";
import TeamSelectionsTable from "@/components/pool/TeamSelectionsTable";
import { fetchPlayerSelections } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SelectionsPage = () => {
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load participant count
  useEffect(() => {
    const loadParticipantCount = async () => {
      try {
        setLoading(true);
        const selectionsData = await fetchPlayerSelections();
        const count = Object.keys(selectionsData).length;
        console.log(`Loaded ${count} participants`);
        setParticipantCount(count);
      } catch (error) {
        console.error("Error loading participant count:", error);
        toast({
          title: "Error loading data",
          description: "Could not fetch participant information. Please try refreshing the page.",
          variant: "destructive",
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
    
    // Add detailed logging to debug participant count
    const debugParticipants = async () => {
      try {
        const selectionsData = await fetchPlayerSelections();
        const participants = Object.keys(selectionsData);
        console.log(`Total participants: ${participants.length}`);
        console.log("Participant names:", participants);
      } catch (error) {
        console.error("Error in debug logging:", error);
      }
    };
    
    debugParticipants();
  }, []);

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
