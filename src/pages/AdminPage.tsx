
import React, { useState } from "react";
import Layout from "@/components/Layout";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card } from "@/components/ui/card";
import { Settings, PieChart, Users, Trophy } from "lucide-react";
import MockDataToggle from "@/components/admin/MockDataToggle";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();
  
  const handleToggleMockData = (enabled: boolean) => {
    setUseMockData(enabled);
    
    // Update the global USE_MOCK_DATA_FALLBACK flag
    if (window && (window as any).USE_MOCK_DATA_FALLBACK !== undefined) {
      (window as any).USE_MOCK_DATA_FALLBACK = enabled;
    }
  };
  
  const testConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Checking Google Sheets API connection...",
    });
    
    try {
      const result = await (window as any).testGoogleSheetsConnection();
      
      if (result) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Google Sheets API",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Google Sheets API. Try using mock data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Test connection error:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
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
          <MockDataToggle 
            useMockData={useMockData} 
            onChange={handleToggleMockData}
            className="flex-1"
          />
          
          <Card className="p-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Google Sheets API</h3>
              <div>
                <button 
                  onClick={testConnection}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Test Connection
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {useMockData 
                ? "Using mock data for testing purposes"
                : "Connected to live Google Sheets data"}
            </p>
          </Card>
        </div>
        
        <p className="text-gray-600 mb-8">
          This is a secure admin dashboard for pool administrators. 
          You can view and compare data from different sources to ensure synchronization.
          {useMockData && (
            <span className="text-amber-600 font-medium"> Currently using mock data for testing.</span>
          )}
        </p>
        
        <AdminPanel />
      </div>
    </Layout>
  );
};

export default AdminPage;
