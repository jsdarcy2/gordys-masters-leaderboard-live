
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Save, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApiKeyConfigProps {
  currentKey: string;
  onSave: (newKey: string) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ currentKey, onSave }) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSave = () => {
    if (apiKey && apiKey !== currentKey) {
      onSave(apiKey);
      setOpen(false);
      
      toast({
        title: "API Key Updated",
        description: "The Google Sheets API key has been updated.",
      });
    } else if (!apiKey) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentKey);
    toast({
      title: "API Key Copied",
      description: "The current API key has been copied to clipboard.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Key size={14} className="mr-1" />
          Configure API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Sheets API Key</DialogTitle>
          <DialogDescription>
            Update the API key used to access Google Sheets data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current API Key:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 overflow-auto">{currentKey}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              <Copy size={14} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">New API Key:</label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Google Sheets API Key"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              You will need to reload the admin panel after changing the API key.
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            className="w-full mt-4 bg-masters-green hover:bg-masters-green/90"
          >
            <Save size={14} className="mr-2" />
            Save API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyConfig;
