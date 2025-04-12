
import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatMessage {
  id: string;
  author: string;
  authorInitials: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

// Sample data
const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    author: "Alex Johnson",
    authorInitials: "AJ",
    avatarUrl: "/lovable-uploads/b4a27812-b6a2-4381-b500-ec469e430fa9.png",
    content: "Hey everyone! Who's excited for the tournament?",
    timestamp: "10:32 AM",
    isCurrentUser: false
  },
  {
    id: "2",
    author: "Sarah Williams",
    authorInitials: "SW",
    content: "I can't wait to see who takes the green jacket this year!",
    timestamp: "10:35 AM",
    isCurrentUser: false
  },
  {
    id: "3",
    author: "You",
    authorInitials: "YO",
    content: "My money's on the defending champion. What do you all think?",
    timestamp: "10:41 AM",
    isCurrentUser: true
  }
];

const ChatFeed = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to the most recent message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: "You",
      authorInitials: "YO",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    setShowEmojiPicker(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
  };
  
  return (
    <div className="flex flex-col h-[70vh] border border-masters-green/20 rounded-md overflow-hidden bg-white">
      {/* Chat header */}
      <div className="p-4 bg-masters-green text-white border-b border-masters-green/20">
        <h3 className="text-lg font-serif">Masters Chat Room</h3>
        <p className="text-sm opacity-90">Connect with other golf fans</p>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F6EE]/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] gap-2 items-start`}>
              <Avatar className="h-8 w-8 border border-masters-gold/20 flex-shrink-0">
                {message.avatarUrl ? (
                  <AvatarImage src={message.avatarUrl} alt={message.author} />
                ) : (
                  <AvatarFallback className={message.isCurrentUser ? "bg-masters-green" : "bg-masters-darkgreen"}>
                    {message.authorInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className={`${
                message.isCurrentUser 
                  ? 'bg-masters-green text-white rounded-tl-lg rounded-br-lg rounded-bl-lg' 
                  : 'bg-white border border-masters-green/20 rounded-tr-lg rounded-br-lg rounded-bl-lg'
              } p-3 shadow-sm`}>
                <div className="flex justify-between items-baseline gap-4 mb-1">
                  <span className={`text-sm font-medium ${message.isCurrentUser ? 'text-white/90' : 'text-masters-dark'}`}>
                    {message.author}
                  </span>
                  <span className={`text-xs ${message.isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-masters-green/20 bg-white">
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-8 z-10">
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              previewPosition="none"
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="icon"
            type="button"
            className="border-masters-green/20 hover:bg-masters-green/10 text-masters-dark"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </Button>
          
          <Button
            variant="outline" 
            size="icon"
            type="button"
            className="border-masters-green/20 hover:bg-masters-green/10 text-masters-dark"
          >
            <Paperclip size={20} />
          </Button>
          
          <Input
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-masters-green/20 focus-visible:ring-masters-green/30"
          />
          
          <Button
            type="button"
            className="bg-masters-green hover:bg-masters-darkgreen text-white"
            onClick={handleSendMessage}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatFeed;
