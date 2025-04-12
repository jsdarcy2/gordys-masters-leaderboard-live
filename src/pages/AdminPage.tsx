import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card } from "@/components/ui/card";
import { Settings, PieChart, Users, Trophy, Database, RefreshCcw } from "lucide-react";
import MockDataToggle from "@/components/admin/MockDataToggle";
import { useToast } from "@/hooks/use-toast";
import { checkPoolStandingsSync, fetchPoolStandings } from "@/services/pool";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SyncStatusBadge from "@/components/pool/SyncStatusBadge";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const [useMockData, setUseMockData] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [checkingSyncStatus, setCheckingSyncStatus] = useState(false);
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
  
  const checkSyncStatus = async () => {
    setCheckingSyncStatus(true);
    
    toast({
      title: "Checking Sync Status",
      description: "Comparing local data with Google Sheets data...",
    });
    
    try {
      const status = await checkPoolStandingsSync();
      setSyncStatus(status);
      
      if (status.sheetsCount === 0) {
        toast({
          title: "Google Sheets Unavailable",
          description: "Could not connect to Google Sheets to check sync status",
          variant: "destructive"
        });
      } else if (status.inSync) {
        toast({
          title: "Data In Sync",
          description: `Local (${status.localCount}) and Google Sheets (${status.sheetsCount}) data are in sync`,
        });
      } else {
        toast({
          title: "Sync Issues Detected",
          description: `Found ${status.differences.length} differences between local and Google Sheets data`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking sync status:", error);
      toast({
        title: "Sync Check Error",
        description: "An error occurred while checking synchronization status",
        variant: "destructive"
      });
    } finally {
      setCheckingSyncStatus(false);
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
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-2"
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
              <h3 className="text-lg font-medium">Data Sync Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <SyncStatusBadge />
              <Button 
                onClick={checkSyncStatus} 
                size="sm"
                variant="outline"
                disabled={checkingSyncStatus}
                className="text-amber-600 border-amber-200 bg-white hover:bg-amber-50"
              >
                <RefreshCcw size={14} className={`mr-1 ${checkingSyncStatus ? 'animate-spin' : ''}`} />
                {checkingSyncStatus ? 'Checking...' : 'Check Sync Status'}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-amber-700">
            <p>Current local participants: <span className="font-semibold">{localParticipants}</span></p>
            
            {syncStatus && (
              <Alert variant={syncStatus.inSync ? "default" : "destructive"} className="mt-3">
                <AlertTitle>{syncStatus.inSync ? "Data is in sync" : "Sync issues detected"}</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Local participants: {syncStatus.localCount}</p>
                    <p>Google Sheets participants: {syncStatus.sheetsCount}</p>
                    
                    {!syncStatus.inSync && (
                      <div className="mt-2">
                        <p className="font-medium">Found {syncStatus.differences.length} differences:</p>
                        {syncStatus.differences.length > 10 ? (
                          <div className="mt-1 max-h-40 overflow-y-auto border border-red-200 rounded p-2 bg-white">
                            <ul className="list-disc pl-4 space-y-1">
                              {syncStatus.differences.slice(0, 10).map((diff, index) => (
                                <li key={index} className="text-xs">
                                  {diff.name}: {' '}
                                  {diff.localScore !== undefined ? diff.localScore : 'missing'} vs{' '}
                                  {diff.sheetsScore !== undefined ? diff.sheetsScore : 'missing'}
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-gray-500 mt-1">...and {syncStatus.differences.length - 10} more</p>
                          </div>
                        ) : (
                          <div className="mt-1 border border-red-200 rounded p-2 bg-white">
                            <ul className="list-disc pl-4 space-y-1">
                              {syncStatus.differences.map((diff, index) => (
                                <li key={index} className="text-xs">
                                  {diff.name}: {' '}
                                  {diff.localScore !== undefined ? diff.localScore : 'missing'} vs{' '}
                                  {diff.sheetsScore !== undefined ? diff.sheetsScore : 'missing'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
        
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
