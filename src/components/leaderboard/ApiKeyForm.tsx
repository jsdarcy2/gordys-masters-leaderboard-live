
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ApiKeyForm: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-green-800">Using Live Tournament Data</h3>
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
                    The data is automatically refreshed every few minutes.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-green-700 text-sm">
            The leaderboard will automatically update every 15 seconds with the latest tournament data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
