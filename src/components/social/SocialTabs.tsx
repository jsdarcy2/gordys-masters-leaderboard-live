
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageCircle } from "lucide-react";
import MediaFeed from "./MediaFeed";
import ChatFeed from "./ChatFeed";

const SocialTabs = () => {
  return (
    <Tabs defaultValue="media" className="w-full">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6 bg-masters-light border border-masters-green/10 rounded-md overflow-hidden">
        <TabsTrigger 
          value="media" 
          className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-masters-green data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200"
        >
          <Camera size={16} />
          <span>Photos & Videos</span>
        </TabsTrigger>
        <TabsTrigger 
          value="chat" 
          className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-masters-green data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200"
        >
          <MessageCircle size={16} />
          <span>Chat</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="media" className="mt-4 animate-fade-in">
        <MediaFeed />
      </TabsContent>
      
      <TabsContent value="chat" className="mt-4 animate-fade-in">
        <ChatFeed />
      </TabsContent>
    </Tabs>
  );
};

export default SocialTabs;
