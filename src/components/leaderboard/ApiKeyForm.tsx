
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info, RefreshCw } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ApiKeyFormProps {
  onRefresh?: () => void;
  lastRefreshed?: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onRefresh, lastRefreshed }) => {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-green-800 flex items-center gap-1">
              <span>Masters Tournament Live Data</span>
              {lastRefreshed && (
                <span className="text-xs text-green-600 font-normal">
                  Updated: {formatTime(lastRefreshed)}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 p-1 text-green-600 hover:text-green-800 hover:bg-green-100"
                  onClick={onRefresh}
                >
                  <RefreshCw size={14} />
                  <span className="sr-only">Refresh data</span>
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-green-600">
                    <span className="sr-only">Info</span>
                    <Info size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm">
                  <div className="space-y-2">
                    <p>
                      This leaderboard displays data from the current Masters tournament. 
                      The data is automatically refreshed every 15 seconds.
                    </p>
                    <p className="text-xs text-gray-500">
                      Polling will automatically pause when you navigate away from this page 
                      to conserve resources.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className="text-green-700 text-sm">
            Scores and standings are updated automatically to reflect the latest tournament data.
            Pool standings are calculated using each participant's best 4 out of 5 golfer scores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
