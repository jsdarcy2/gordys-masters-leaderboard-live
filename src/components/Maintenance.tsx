
import { CircleOff, Clock, Hammer, Settings, Wrench } from "lucide-react";

interface MaintenanceProps {
  title?: string;
  message?: string;
  showEstimate?: boolean;
  estimatedTime?: string;
}

const Maintenance = ({
  title = "Site Under Maintenance",
  message = "We're currently enhancing this section to improve your experience.",
  showEstimate = true,
  estimatedTime = "April 15, 2025"
}: MaintenanceProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-masters-green/20 bg-white/95 p-8 shadow-elegant">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 opacity-[0.02]">
        <Settings className="h-40 w-40 text-masters-green" />
      </div>
      <div className="absolute -bottom-16 -left-16 opacity-[0.02]">
        <Wrench className="h-32 w-32 text-masters-gold" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-masters-gold/10"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-masters-green/10 p-4">
              <Hammer className="h-10 w-10 text-masters-darkgreen" />
            </div>
          </div>
        </div>
        
        <h2 className="font-serif text-2xl font-medium text-masters-darkgreen md:text-3xl">{title}</h2>
        
        <div className="augusta-divider mx-auto my-5 w-24"></div>
        
        <p className="mb-6 text-gray-600">{message}</p>
        
        {showEstimate && (
          <div className="mt-8 inline-flex items-center rounded-full bg-masters-light px-5 py-2 text-sm font-medium text-masters-darkgreen">
            <Clock className="mr-2 h-4 w-4" />
            Estimated completion: {estimatedTime}
          </div>
        )}
        
        <div className="mt-10 text-sm text-gray-500">
          In the meantime, please explore other sections of Gordy's Masters Pool.
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
