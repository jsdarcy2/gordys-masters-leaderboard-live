
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MediaFeed from "./MediaFeed";
import ChatFeed from "./ChatFeed";

const SocialTabs = () => {
  const [activeTab, setActiveTab] = useState("media");

  return (
    <Tabs 
      defaultValue="media" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full mb-6 bg-masters-light">
        <TabsTrigger 
          value="media" 
          className={`flex-1 py-3 text-base font-serif ${
            activeTab === "media" 
              ? "bg-masters-green text-white" 
              : "text-masters-dark hover:bg-masters-green/10"
          }`}
        >
          Photo & Video
        </TabsTrigger>
        <TabsTrigger 
          value="chat" 
          className={`flex-1 py-3 text-base font-serif ${
            activeTab === "chat" 
              ? "bg-masters-green text-white" 
              : "text-masters-dark hover:bg-masters-green/10"
          }`}
        >
          Chat
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="media" className="animate-fade-in mt-4">
        <MediaFeed />
      </TabsContent>
      
      <TabsContent value="chat" className="animate-fade-in mt-4">
        <ChatFeed />
      </TabsContent>
    </Tabs>
  );
};

export default SocialTabs;
