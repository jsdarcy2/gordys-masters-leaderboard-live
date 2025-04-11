
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PlayerSelections from "@/components/PlayerSelections";
import PaymentStatus from "@/components/PaymentStatus";
import { fetchPlayerSelections } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const SelectionsPage = () => {
  const [participantCount, setParticipantCount] = useState<number>(134);
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
  }, [toast]);

  // Log component mount for debugging
  useEffect(() => {
    console.log("Selections page mounted");
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayerSelections />
        </div>
        <div>
          <PaymentStatus />
        </div>
      </div>
    </Layout>
  );
};

export default SelectionsPage;
