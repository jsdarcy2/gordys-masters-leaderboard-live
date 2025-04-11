
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Key, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onApiKeySet: (key: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid RapidAPI key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('rapidApiKey', apiKey);
    onApiKeySet(apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your RapidAPI key has been saved and will be used for live data",
    });
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <Key size={20} className="text-amber-600 mt-1 flex-shrink-0" />
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-amber-800">Using Sample Data</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-amber-600">
                  <span className="sr-only">Info</span>
                  <Info size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <p>
                  To get live tournament data, you'll need a RapidAPI key from the Live Golf Data API. 
                  Visit <a href="https://rapidapi.com/live-golf-data-live-golf-data-default/api/live-golf-data" target="_blank" rel="noreferrer" className="text-blue-600 underline">RapidAPI</a> to sign up and subscribe to the API.
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="password"
              placeholder="Enter your RapidAPI key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
              Set API Key
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
