
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Database, CloudOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockDataToggleProps {
  useMockData: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

const MockDataToggle: React.FC<MockDataToggleProps> = ({ 
  useMockData, 
  onChange,
  className = ""
}) => {
  const { toast } = useToast();
  
  const handleToggle = (enabled: boolean) => {
    onChange(enabled);
    
    toast({
      title: enabled ? "Using Mock Data" : "Using Google Sheets API",
      description: enabled 
        ? "Switched to mock data mode for testing." 
        : "Switched to live Google Sheets API data.",
    });
    
    // Update the global mock data flag if available
    if (window && (window as any).USE_MOCK_DATA_FALLBACK !== undefined) {
      (window as any).USE_MOCK_DATA_FALLBACK = enabled;
    }
  };
  
  return (
    <div className={`flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Data Source:</span>
          {useMockData ? (
            <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium">
              <Database size={14} className="mr-1" />
              Mock Data
            </span>
          ) : (
            <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium">
              <CloudOff size={14} className="mr-1" />
              Google Sheets API
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Use Mock Data</span>
        <Switch 
          checked={useMockData} 
          onCheckedChange={handleToggle} 
          className="data-[state=checked]:bg-amber-500"
        />
      </div>
    </div>
  );
};

export default MockDataToggle;
