
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Emoji data - simplified for this example
const EMOJI_GROUPS = [
  {
    category: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍"]
  },
  {
    category: "Sports",
    emojis: ["⛳", "🏌️‍♂️", "🏌️‍♀️", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏐", "🏈", "⚾", "🥎", "🏉", "🎾"]
  },
  {
    category: "Objects",
    emojis: ["🏳️", "🏁", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "📷", "📸", "📹", "📼", "📞"]
  }
];

// Mock data - in a real app, this would come from Supabase
const MOCK_MESSAGES = [
  {
    id: "1",
    userId: "user1",
    userName: "John D.",
    userAvatar: "JD",
    message: "Hey everyone! Excited for the Masters tournament this year!",
    timestamp: new Date(2025, 3, 11, 10, 30).toISOString(),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah T.",
    userAvatar: "ST",
    message: "Me too! Who do you think has the best chance of winning? 🏆",
    timestamp: new Date(2025, 3, 11, 10, 32).toISOString(),
  },
  {
    id: "3",
    userId: "user1",
    userName: "John D.",
    userAvatar: "JD",
    message: "I'm putting my money on Scottie Scheffler ⛳",
    timestamp: new Date(2025, 3, 11, 10, 35).toISOString(),
  },
];

const ChatFeed = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send to Supabase Realtime
    const timestamp = new Date().toISOString();
    const newItem = {
      id: `temp-${timestamp}`,
      userId: "current-user",
      userName: "You",
      userAvatar: "YO",
      message: newMessage,
      timestamp,
    };
    
    setMessages([...messages, newItem]);
    setNewMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };
  
  // Format timestamp to a readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped: { [key: string]: typeof messages } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      
      grouped[dateString].push(message);
    });
    
    return grouped;
  };
  
  const groupedMessages = groupMessagesByDate();
  
  return (
    <div className="flex flex-col h-[600px] md:h-[700px]">
      <Card className="flex-1 flex flex-col border-masters-green/10 overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Messages by date */}
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-masters-green/10 text-masters-darkgreen px-3 py-1 rounded-full text-xs">
                  {date}
                </div>
              </div>
              
              {dateMessages.map((message, index) => {
                const isCurrentUser = message.userId === "current-user";
                return (
                  <div 
                    key={message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}>
                      <Avatar className="bg-masters-green text-white h-8 w-8">
                        <AvatarFallback>{message.userAvatar}</AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 ${isCurrentUser ? "items-end text-right" : ""}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{message.userName}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                        <div
                          className={`px-3 py-2 rounded-md ${
                            isCurrentUser 
                              ? "bg-masters-green text-white" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="p-3 border-t">
          <div className="flex w-full items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Smile className="h-5 w-5 text-masters-darkgreen" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" side="top" align="start">
                <div className="space-y-4">
                  {EMOJI_GROUPS.map((group) => (
                    <div key={group.category}>
                      <h3 className="text-sm font-medium mb-2">{group.category}</h3>
                      <div className="grid grid-cols-8 gap-1">
                        {group.emojis.map((emoji, i) => (
                          <button
                            key={`${group.category}-${i}`}
                            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                            onClick={() => addEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            
            <Button 
              onClick={handleSendMessage}
              size="icon" 
              className="h-9 w-9 rounded-full bg-masters-darkgreen hover:bg-masters-green"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatFeed;
