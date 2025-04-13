
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCcw, CheckCircle2, AlertCircle, RefreshCcw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { notify } from "@/services/notification";

interface SyncStatusBadgeProps {
  className?: string;
  onRefresh?: () => void;
}

const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ 
  className = "",
  onRefresh
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
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
          <p>Data updated from Sportradar API</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatusBadge;
