
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageCircle } from "lucide-react";
import MediaFeed from "./MediaFeed";
import ChatFeed from "./ChatFeed";

const SocialTabs = () => {
  return (
    <Tabs defaultValue="media" className="w-full">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
        <TabsTrigger value="media" className="flex items-center gap-2">
          <Camera size={18} />
          <span>Photos & Videos</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageCircle size={18} />
          <span>Chat</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="media" className="mt-4">
        <MediaFeed />
      </TabsContent>
      
      <TabsContent value="chat" className="mt-4">
        <ChatFeed />
      </TabsContent>
    </Tabs>
  );
};

export default SocialTabs;
