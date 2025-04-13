
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SyncStatusBadgeProps {
  className?: string;
  onRefresh?: () => void;
}

const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ 
  className = "",
  onRefresh
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    if (onRefresh) {
      setRefreshing(true);
      onRefresh();
      
      // Set a timeout to reset refreshing state
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`bg-green-50 text-green-600 ${className}`}>
            <CheckCircle2 size={14} className="mr-1" />
            Data Updated
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2">
            <p>Data updated from Sportradar API</p>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="text-xs py-1"
                disabled={refreshing}
              >
                <RefreshCcw size={12} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Now'}
              </Button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatusBadge;
