
import { useEffect } from "react";
import Layout from "@/components/Layout";
import GreenRobeWinners from "@/components/GreenRobeWinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ArchivePage = () => {
  // Log component mount for debugging
  useEffect(() => {
    console.log("Archive page mounted");
  }, []);

  return (
    <Layout>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-masters-green mb-3 md:mb-4">
          Green Robe Winners
        </h2>
        <p className="text-gray-600 mb-2">
          Past champions of Gordy's Masters Pool 2025, their hometowns, and the prestigious Green Robe tradition.
        </p>
        <p className="text-sm text-gray-500 italic mb-6">
          "A tradition unlike any other" - Jim Nantz
        </p>
        
        <div className="flex items-center mb-6 bg-masters-light p-4 rounded-lg">
          <Avatar className="h-16 w-16 mr-4 border-2 border-masters-gold">
            <AvatarImage src="/lovable-uploads/1e4f20a3-33c8-4c5c-aba1-cc9b244e571d.png" alt="Current champion" />
            <AvatarFallback className="bg-masters-green text-white">SK</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">Reigning Champion: Sarah Kepic</h3>
            <p className="text-gray-600">Birmingham, MI <span className="ml-1">🇺🇸 MI</span></p>
          </div>
        </div>
      </div>
      
      <GreenRobeWinners />
    </Layout>
  );
};

export default ArchivePage;
