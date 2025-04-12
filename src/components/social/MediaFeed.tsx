
import { useState, useRef } from "react";
import { Camera, Video, Upload, Send, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Image from "@/components/ui/image";

interface MediaPost {
  id: string;
  author: string;
  authorInitials: string;
  avatarUrl?: string;
  content: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  timestamp: string;
  likes: number;
  comments: number;
}

// Sample data
const SAMPLE_POSTS: MediaPost[] = [
  {
    id: "1",
    author: "Alex Johnson",
    authorInitials: "AJ",
    avatarUrl: "/lovable-uploads/b4a27812-b6a2-4381-b500-ec469e430fa9.png",
    content: "Amazing view of the 12th hole! #MastersMemories",
    mediaType: "image",
    mediaUrl: "/lovable-uploads/1e4f20a3-33c8-4c5c-aba1-cc9b244e571d.png",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5
  },
  {
    id: "2",
    author: "Sarah Williams",
    authorInitials: "SW",
    content: "Check out this putt on the 18th green! #MastersMoment",
    mediaType: "image",
    mediaUrl: "/lovable-uploads/9ecfd09f-c722-4155-a926-4b986d130495.png",
    timestamp: "1 day ago",
    likes: 36,
    comments: 8
  }
];

const MediaFeed = () => {
  const [posts, setPosts] = useState<MediaPost[]>(SAMPLE_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      toast({
        title: "File selected",
        description: `${file.name} is ready to upload.`,
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePostSubmit = () => {
    if (!newPostText && !selectedFile) {
      toast({
        title: "Cannot create empty post",
        description: "Please add some text or select a photo/video to post.",
        variant: "destructive",
      });
      return;
    }

    // Create new post
    const newPost: MediaPost = {
      id: `temp-${Date.now()}`,
      author: "You",
      authorInitials: "YO",
      content: newPostText,
      mediaType: "image",
      mediaUrl: previewUrl || "/placeholder.svg",
      timestamp: "Just now",
      likes: 0,
      comments: 0,
    };

    // Add to posts
    setPosts([newPost, ...posts]);
    
    // Reset form
    setNewPostText("");
    clearSelectedFile();
    
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Post creation form */}
      <Card className="border border-masters-green/20">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border border-masters-gold/20">
              <AvatarFallback className="bg-masters-green text-white">YO</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <Input
                placeholder="Share your Masters experience..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="border-masters-green/20 focus-visible:ring-masters-green/30"
              />
              
              {previewUrl && (
                <div className="relative mt-2 rounded-md overflow-hidden border border-masters-green/20">
                  <img 
                    src={previewUrl} 
                    alt="Selected media" 
                    className="max-h-64 w-full object-cover"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                    onClick={clearSelectedFile}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-masters-green border-masters-green/20 hover:bg-masters-green/10"
                    onClick={triggerFileInput}
                  >
                    <Camera size={18} className="mr-2" />
                    Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-masters-green border-masters-green/20 hover:bg-masters-green/10"
                    onClick={triggerFileInput}
                  >
                    <Video size={18} className="mr-2" />
                    Video
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-masters-green hover:bg-masters-darkgreen text-white"
                  onClick={handlePostSubmit}
                >
                  <Send size={18} className="mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Posts feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Post header */}
              <div className="p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-masters-gold/20">
                  {post.avatarUrl ? (
                    <AvatarImage src={post.avatarUrl} alt={post.author} />
                  ) : (
                    <AvatarFallback className="bg-masters-green text-white">
                      {post.authorInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-masters-dark">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              
              {/* Post content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p>{post.content}</p>
                </div>
              )}
              
              {/* Post media */}
              <div className="relative border-y border-masters-green/10">
                <img 
                  src={post.mediaUrl} 
                  alt="Post media"
                  className="w-full object-cover max-h-[500px]"
                />
              </div>
              
              {/* Post actions */}
              <div className="p-4 flex justify-between">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Smile size={18} className="mr-2" />
                  Like {post.likes > 0 && `(${post.likes})`}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <MessageSquare size={18} className="mr-2" />
                  Comment {post.comments > 0 && `(${post.comments})`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaFeed;
