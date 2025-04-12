
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Image from "@/components/ui/image";

// Mock data - in a real app, this would come from Supabase
const MOCK_POSTS = [
  {
    id: "1",
    userName: "John D.",
    userAvatar: "JD",
    content: "Beautiful day at Augusta National! #Masters2025",
    mediaUrl: "/lovable-uploads/cc474ace-bcd8-4bff-95e2-06fc903d211a.png",
    isVideo: false,
    timestamp: new Date(2025, 3, 11, 14, 30).toISOString(),
  },
  {
    id: "2",
    userName: "Sarah T.",
    userAvatar: "ST",
    content: "Amazing view from the 16th hole!",
    mediaUrl: "/lovable-uploads/166641be-8071-4d12-8c62-62e4cc60c622.png",
    isVideo: false,
    timestamp: new Date(2025, 3, 11, 12, 15).toISOString(),
  },
];

const MediaFeed = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState({ content: "", file: null as File | null, previewUrl: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Check if it's an image or video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload only images or videos",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setNewPost({ ...newPost, file, previewUrl });
  };

  const clearFileSelection = () => {
    if (newPost.previewUrl) {
      URL.revokeObjectURL(newPost.previewUrl);
    }
    setNewPost({ ...newPost, file: null, previewUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!newPost.content.trim() && !newPost.file) {
      toast({
        title: "Post cannot be empty",
        description: "Please add text or upload media",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would be:
      // 1. Upload file to Supabase Storage if exists
      // 2. Store post data in Supabase Database
      
      // Simulate successful post
      const timestamp = new Date().toISOString();
      const newItem = {
        id: `temp-${timestamp}`,
        userName: "You",
        userAvatar: "YO",
        content: newPost.content,
        mediaUrl: newPost.previewUrl,
        isVideo: newPost.file ? newPost.file.type.startsWith("video/") : false,
        timestamp,
      };

      setPosts([newItem, ...posts]);
      setNewPost({ content: "", file: null, previewUrl: "" });
      
      toast({
        title: "Post shared!",
        description: "Your post has been shared with the group",
      });
    } catch (error) {
      console.error("Error posting:", error);
      toast({
        title: "Error sharing post",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Format timestamp to a readable date
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Post creation card */}
      <Card className="border-masters-green/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="bg-masters-green text-white">
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your Masters experience..."
                className="mb-3 resize-none"
              />
              
              {newPost.previewUrl && (
                <div className="relative mb-3 rounded-md overflow-hidden">
                  {newPost.file?.type.startsWith("video/") ? (
                    <video 
                      src={newPost.previewUrl} 
                      className="max-h-80 w-full object-contain bg-black"
                      controls
                    />
                  ) : (
                    <Image 
                      src={newPost.previewUrl} 
                      alt="Preview" 
                      className="max-h-80 w-full object-contain"
                    />
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={clearFileSelection}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
                capture="environment"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="text-masters-darkgreen border-masters-green/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={18} className="mr-2" />
            Add Photo/Video
          </Button>
          <Button 
            className="bg-masters-darkgreen hover:bg-masters-green text-white"
            onClick={handleSubmit}
          >
            <Upload size={18} className="mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-masters-green/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="bg-masters-green text-white">
                  <AvatarFallback>{post.userAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{post.userName}</h3>
                  <p className="text-sm text-gray-500">{formatTime(post.timestamp)}</p>
                </div>
              </div>
              
              {post.content && (
                <p className="mb-4">{post.content}</p>
              )}
              
              {post.mediaUrl && (
                <div className="rounded-md overflow-hidden bg-black/5">
                  {post.isVideo ? (
                    <video 
                      src={post.mediaUrl} 
                      className="w-full h-auto max-h-[400px] object-contain"
                      controls
                    />
                  ) : (
                    <Image 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaFeed;
