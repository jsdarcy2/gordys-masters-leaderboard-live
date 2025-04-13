
import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyFallbackProps {
  onRetry: () => void;
  severity: 'warning' | 'critical';
  message: string;
}

const EmergencyFallback: React.FC<EmergencyFallbackProps> = ({
  onRetry,
  severity,
  message
}) => {
  const bgColor = severity === 'warning' ? 'bg-amber-50' : 'bg-red-50';
  const borderColor = severity === 'warning' ? 'border-amber-200' : 'border-red-200';
  const textColor = severity === 'warning' ? 'text-amber-800' : 'text-red-800';
  
  return (
    <div className={`rounded-lg ${bgColor} ${borderColor} border p-6 text-center`}>
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className={`h-12 w-12 ${textColor} mb-4`} />
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
          Data Connection Issue
        </h3>
        <p className={`mb-4 ${textColor} text-opacity-90`}>
          {message}
        </p>
        
        <div className="mt-2 flex flex-col w-full max-w-xs gap-2">
          <Button
            onClick={onRetry}
            className="w-full flex items-center justify-center bg-white border hover:bg-gray-50"
            variant="outline"
          >
            <RefreshCcw size={16} className="mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyFallback;
