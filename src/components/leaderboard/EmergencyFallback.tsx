
import React from "react";
import { Tv, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyFallbackProps {
  onRetry: () => void;
  message?: string;
  severity?: 'warning' | 'critical';
}

const EmergencyFallback: React.FC<EmergencyFallbackProps> = ({ 
  onRetry,
  message = "We're experiencing technical difficulties with our live scoring. Please check back later.",
  severity = 'warning'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={`${severity === 'critical' ? 'bg-red-100' : 'bg-amber-100'} p-4 rounded-full mb-4`}>
        <AlertTriangle size={32} className={severity === 'critical' ? "text-red-600" : "text-amber-600"} />
      </div>
      
      <h3 className="text-xl font-bold text-masters-dark mb-2">
        {severity === 'critical' ? 'Data Temporarily Unavailable' : 'Live Data Loading'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-masters-green text-masters-green hover:bg-masters-green/10"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Refresh Data
        </Button>
        
        <a 
          href="https://www.masters.com/en_US/watch/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-masters-green hover:bg-masters-green/90 text-white px-4 py-2 rounded transition-colors"
        >
          <Tv size={16} />
          Watch Live Coverage
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-masters-light/50 rounded-md max-w-2xl">
        <h4 className="font-medium mb-2 text-masters-dark">
          <Tv size={18} className="inline-block mr-2 text-masters-yellow" />
          Masters Tournament Live Streaming
        </h4>
        <p className="text-sm text-gray-600">
          You can watch the official Masters Tournament coverage on <a href="https://www.masters.com" target="_blank" rel="noopener noreferrer" className="text-masters-green underline">Masters.com</a> or through the official Masters app.
        </p>
      </div>
    </div>
  );
};

export default EmergencyFallback;
