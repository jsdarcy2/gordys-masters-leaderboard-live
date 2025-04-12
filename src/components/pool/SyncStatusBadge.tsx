
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCw, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { checkPoolStandingsSync } from "@/services/pool";

interface SyncStatusBadgeProps {
  className?: string;
}

const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ className = "" }) => {
  const [syncStatus, setSyncStatus] = useState<{
    inSync: boolean;
    localCount: number;
    sheetsCount: number;
    differences: Array<{ name: string, localScore?: number, sheetsScore?: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const checkSync = async () => {
    setLoading(true);
    try {
      const status = await checkPoolStandingsSync();
      setSyncStatus(status);
    } catch (error) {
      console.error("Error checking sync status:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkSync();
  }, []);
  
  if (loading) {
    return (
      <Badge variant="outline" className={`bg-blue-50 text-blue-600 ${className}`}>
        <RotateCw size={14} className="mr-1 animate-spin" />
        Checking Sync Status...
      </Badge>
    );
  }
  
  if (!syncStatus) {
    return (
      <Badge variant="outline" className={`bg-gray-50 text-gray-600 ${className}`}>
        <AlertCircle size={14} className="mr-1" />
        Sync Status Unknown
      </Badge>
    );
  }
  
  if (syncStatus.inSync) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`bg-green-50 text-green-600 ${className}`}>
              <CheckCircle2 size={14} className="mr-1" />
              Data In Sync
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Local data ({syncStatus.localCount} participants) is in sync with Google Sheets ({syncStatus.sheetsCount} participants)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`bg-red-50 text-red-600 ${className}`}>
            <XCircle size={14} className="mr-1" />
            Out of Sync ({syncStatus.differences.length} differences)
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-3">
          <div>
            <p className="font-medium mb-2">Data Sync Issues:</p>
            <p className="text-sm mb-2">Local: {syncStatus.localCount} participants</p>
            <p className="text-sm mb-2">Sheets: {syncStatus.sheetsCount} participants</p>
            {syncStatus.differences.length > 0 && (
              <div className="mt-2 text-xs">
                <p className="font-medium">Sample differences:</p>
                <ul className="list-disc pl-4 mt-1">
                  {syncStatus.differences.slice(0, 3).map((diff, index) => (
                    <li key={index}>{diff.name}: {diff.localScore !== undefined ? diff.localScore : 'missing'} vs {diff.sheetsScore !== undefined ? diff.sheetsScore : 'missing'}</li>
                  ))}
                  {syncStatus.differences.length > 3 && (
                    <li>...and {syncStatus.differences.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatusBadge;
