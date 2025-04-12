
import { Clock, Hammer, Settings, Wrench, Trophy, Calendar, Clock3 } from "lucide-react";

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
    <div className="relative overflow-hidden rounded-lg border border-masters-green/20 bg-white/95 p-8 md:p-12 shadow-elegant max-w-3xl w-full">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 opacity-[0.02]">
        <Settings className="h-40 w-40 text-masters-green" />
      </div>
      <div className="absolute -bottom-16 -left-16 opacity-[0.02]">
        <Wrench className="h-32 w-32 text-masters-gold" />
      </div>
      
      {/* Masters logo watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.015]">
        <img 
          src="/lovable-uploads/ad6f883a-8084-4739-a261-140451820a94.png" 
          alt="" 
          className="w-80 h-80"
        />
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
        
        <div className="mb-2 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-masters-gold mr-2" />
          <span className="text-masters-darkgreen font-serif text-sm">Gordy's Masters Pool 2025</span>
        </div>
        
        <h2 className="font-serif text-2xl font-medium text-masters-darkgreen md:text-3xl">{title}</h2>
        
        <div className="augusta-divider mx-auto my-5 w-24"></div>
        
        <p className="mb-6 text-gray-600">{message}</p>
        
        {showEstimate && (
          <div className="mt-8 inline-flex items-center rounded-full bg-masters-light px-5 py-2.5 text-sm font-medium text-masters-darkgreen">
            <Clock className="mr-2 h-4 w-4" />
            Estimated completion: {estimatedTime}
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-masters-green/5 border border-masters-green/10">
            <Calendar className="h-5 w-5 text-masters-darkgreen mx-auto mb-2" />
            <p className="text-sm text-gray-600">The Masters Tournament</p>
            <p className="text-xs text-gray-500">April 10-13, 2025</p>
          </div>
          
          <div className="p-4 rounded-lg bg-masters-gold/5 border border-masters-gold/10">
            <Trophy className="h-5 w-5 text-masters-gold mx-auto mb-2" />
            <p className="text-sm text-gray-600">Pool Opens</p>
            <p className="text-xs text-gray-500">April 1, 2025</p>
          </div>
          
          <div className="p-4 rounded-lg bg-masters-green/5 border border-masters-green/10">
            <Clock3 className="h-5 w-5 text-masters-darkgreen mx-auto mb-2" />
            <p className="text-sm text-gray-600">Entry Deadline</p>
            <p className="text-xs text-gray-500">April 9, 2025</p>
          </div>
        </div>
        
        <div className="mt-10 text-sm text-gray-500">
          Thank you for your patience as we prepare for the 2025 tournament.
        </div>
        
        <div className="mt-5 text-xs text-masters-gold/80">
          A tradition unlike any other since 2005
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
