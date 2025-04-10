import { useEffect } from "react";
import Layout from "@/components/Layout";
import GreenRobeWinners from "@/components/GreenRobeWinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "@/components/ui/image";
import { Award } from "lucide-react";

const ArchivePage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Archive page mounted");
  }, []);

  return (
    <Layout>
      <div className="relative">
        {/* Hero Image Section */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-lg">
          <Image 
            src="/lovable-uploads/7fedc782-7255-440b-827a-d91d5853b279.png" 
            alt="Augusta National" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 md:p-6 z-10 w-full">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 drop-shadow-md">
              Green Robe Winners
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl drop-shadow-md">
              Past champions of Gordy's Masters Pool 2025
            </p>
          </div>
        </div>

        {/* Masters-inspired quote */}
        <div className="mb-8 p-5 bg-masters-green/10 rounded-lg border border-masters-green/20">
          <p className="text-center text-lg md:text-xl italic font-serif text-masters-green">
            "A tradition unlike any other" - Jim Nantz
          </p>
        </div>
        
        {/* Current Champion Spotlight */}
        <div className="flex flex-col md:flex-row items-center mb-10 bg-masters-light p-5 rounded-lg shadow-md border border-masters-green/20">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-2 border-masters-gold shadow-lg">
              <AvatarImage src="/lovable-uploads/1e4f20a3-33c8-4c5c-aba1-cc9b244e571d.png" alt="Current champion" />
              <AvatarFallback className="bg-masters-green text-white">SK</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-masters-gold rounded-full p-1 shadow-md">
              <Award className="h-6 w-6 text-masters-green" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-serif font-bold text-xl md:text-2xl text-masters-green">Reigning Champion: Sarah Kepic</h3>
            <p className="text-gray-600 flex items-center justify-center md:justify-start mt-1">
              <span>Birmingham, MI</span>
              <img 
                src="/lovable-uploads/5ca946ca-52b2-4847-82cf-94bac53763cf.png" 
                alt="Michigan" 
                className="w-6 h-4 ml-2 inline-block" 
              />
            </p>
            <p className="mt-2 text-gray-700 italic">"Girls Just Wanna Green Ro-obe!"</p>
          </div>
        </div>
      </div>
      
      {/* Green Robe Winners Section with Clubhouse Graphic */}
      <div className="relative mb-6">
        <div className="absolute right-0 top-0 w-32 md:w-40 h-auto opacity-30 -z-10 transform translate-x-1/4 -translate-y-1/4">
          <img 
            src="/lovable-uploads/ad6f883a-8084-4739-a261-140451820a94.png" 
            alt="Masters Logo" 
            className="w-full h-auto"
          />
        </div>
        <GreenRobeWinners />
      </div>

      {/* Footer Banner */}
      <div className="mt-12 relative w-full h-40 md:h-48 overflow-hidden rounded-lg">
        <Image 
          src="/lovable-uploads/393fdaac-022a-4ace-beb2-de5133016b85.png" 
          alt="Augusta Clubhouse" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 z-10 w-full text-center">
          <p className="text-white/90 text-lg font-serif italic">
            Gordy's Masters Pool 2025 — A Tradition Unlike Any Other
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ArchivePage;
