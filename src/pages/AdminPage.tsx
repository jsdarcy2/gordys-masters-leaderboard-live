
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card } from "@/components/ui/card";
import { Settings, PieChart, Users, Trophy, Database, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchPoolStandings } from "@/services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SyncStatusBadge from "@/components/pool/SyncStatusBadge";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const [localParticipants, setLocalParticipants] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkParticipantCount = async () => {
      try {
        const participants = await fetchPoolStandings();
        setLocalParticipants(participants.length);
      } catch (error) {
        console.error("Error fetching participant count:", error);
      }
    };
    
    checkParticipantCount();
  }, []);
  
  const testConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Checking Sportradar API connection...",
    });
    
    try {
      const response = await fetch("https://api.sportradar.us/golf/trial/v3/en/tournaments/sr:tournament:975/summary.json?api_key=6U9WiXuo0kwq8PUNTrkAwLhOz60Obg8lZQN0Zval", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Sportradar API test - Data received:", data);
        
        toast({
          title: "Sportradar API Connection Successful",
          description: "Successfully connected to Sportradar Golf API",
        });
      } else {
        toast({
          title: "Sportradar API Connection Failed",
          description: `Could not connect to Sportradar API. Status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Sportradar API test error:", error);
      toast({
        title: "Sportradar API Error",
        description: "An error occurred while testing the API connection.",
        variant: "destructive"
      });
    }
  };
  
  const testMastersAPI = async () => {
    toast({
      title: "Testing Masters.com API",
      description: "Checking Masters.com scores API connection...",
    });
    
    try {
      const response = await fetch("https://www.masters.com/en_US/scores/feeds/2025/scores.json", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Masters API test - Data received:", data);
        
        toast({
          title: "Masters API Connection Successful",
          description: "Successfully connected to Masters.com API",
        });
      } else {
        toast({
          title: "Masters API Connection Failed",
          description: `Could not connect to Masters.com API. Status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Masters API test error:", error);
      toast({
        title: "Masters API Error",
        description: "An error occurred while testing the Masters.com API connection.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-masters-green mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 flex items-center bg-green-50 border-green-200">
            <div className="h-12 w-12 rounded-full bg-masters-green/20 flex items-center justify-center mr-4">
              <Trophy className="h-6 w-6 text-masters-green" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Masters Pool</h3>
              <p className="text-sm text-gray-500">Admin Tools and Data</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center bg-blue-50 border-blue-200">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-gray-500">Manage API Keys & Settings</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center bg-purple-50 border-purple-200">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Data Analysis</h3>
              <p className="text-sm text-gray-500">Leaderboard & Pool Stats</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center bg-amber-50 border-amber-200">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Participants</h3>
              <p className="text-sm text-gray-500">Pool Member Management</p>
            </div>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Card className="p-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">API Status</h3>
              <div>
                <button 
                  onClick={testConnection}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-2"
                >
                  Test Connection
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Connected to Sportradar Golf API
            </p>
          </Card>
          
          <Card className="p-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Masters.com API</h3>
              <div>
                <button 
                  onClick={testMastersAPI}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Test Masters API
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Using official Masters.com scores data
            </p>
          </Card>
        </div>
        
        <Card className="p-4 mb-6 border-amber-200 bg-amber-50/50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="text-lg font-medium">Data Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <SyncStatusBadge />
            </div>
          </div>
          
          <div className="text-sm text-amber-700">
            <p>Current local participants: <span className="font-semibold">{localParticipants}</span></p>
          </div>
        </Card>
        
        <p className="text-gray-600 mb-8">
          This is a secure admin dashboard for pool administrators. 
          You can view data and test API connections to ensure everything is working properly.
        </p>
        
        <AdminPanel />
      </div>
    </Layout>
  );
};

export default AdminPage;
