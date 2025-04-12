import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Play, Tv, Film, Info, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";
import CookieNotice from "@/components/CookieNotice";
import { useStreamStatus } from "@/hooks/use-stream-status";

const LIVE_STREAMS = [
  {
    id: "masters-official",
    name: "Masters.org Official Stream",
    embedUrl: "https://www.masters.com/en_US/watch/index.html",
    description: "The official live stream from Masters.com, featuring broadcast coverage, featured groups, and Amen Corner.",
    isOfficial: true,
  },
  {
    id: "featured-groups",
    name: "Featured Groups",
    embedUrl: "https://www.masters.com/en_US/watch/index.html#featured-groups",
    description: "Follow featured groups throughout their entire round at Augusta National.",
    isOfficial: true,
  },
  {
    id: "amen-corner",
    name: "Amen Corner",
    embedUrl: "https://www.masters.com/en_US/watch/index.html#amen-corner",
    description: "Live coverage of the 11th, 12th and 13th holes, one of golf's most exciting stretches.",
    isOfficial: true,
  },
  {
    id: "holes-15-16",
    name: "Holes 15 & 16",
    embedUrl: "https://www.masters.com/en_US/watch/index.html#holes-15-16",
    description: "Watch live coverage of the 15th and 16th holes at Augusta National.",
    isOfficial: true,
  },
];

const FEATURED_BROADCASTS = [
  {
    day: "Thursday, April 11",
    broadcasts: [
      { time: "9:15 AM - 7:30 PM ET", name: "Featured Groups", source: "Masters.com" },
      { time: "10:45 AM - 6:00 PM ET", name: "Amen Corner", source: "Masters.com" },
      { time: "11:45 AM - 7:00 PM ET", name: "Holes 15 & 16", source: "Masters.com" },
      { time: "3:00 PM - 7:30 PM ET", name: "Traditional Broadcast", source: "ESPN" },
    ]
  },
  {
    day: "Friday, April 12",
    broadcasts: [
      { time: "9:15 AM - 7:30 PM ET", name: "Featured Groups", source: "Masters.com" },
      { time: "10:45 AM - 6:00 PM ET", name: "Amen Corner", source: "Masters.com" },
      { time: "11:45 AM - 7:00 PM ET", name: "Holes 15 & 16", source: "Masters.com" },
      { time: "3:00 PM - 7:30 PM ET", name: "Traditional Broadcast", source: "ESPN" },
    ]
  },
  {
    day: "Saturday, April 13",
    broadcasts: [
      { time: "10:15 AM - 7:00 PM ET", name: "Featured Groups", source: "Masters.com" },
      { time: "11:45 AM - 6:00 PM ET", name: "Amen Corner", source: "Masters.com" },
      { time: "12:30 PM - 6:30 PM ET", name: "Holes 15 & 16", source: "Masters.com" },
      { time: "3:00 PM - 7:00 PM ET", name: "Traditional Broadcast", source: "CBS" },
    ]
  },
  {
    day: "Sunday, April 14",
    broadcasts: [
      { time: "10:15 AM - 7:00 PM ET", name: "Featured Groups", source: "Masters.com" },
      { time: "11:45 AM - 6:00 PM ET", name: "Amen Corner", source: "Masters.com" },
      { time: "12:30 PM - 6:30 PM ET", name: "Holes 15 & 16", source: "Masters.com" },
      { time: "2:00 PM - 7:00 PM ET", name: "Traditional Broadcast", source: "CBS" },
    ]
  },
];

const LiveStream: React.FC = () => {
  const [activeStream, setActiveStream] = useState(LIVE_STREAMS[0]);
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const { iframeStatus, setIframeStatus, needsStreamHelp } = useStreamStatus(activeStream.embedUrl);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    handleOrientationChange();

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const getPlayerStyle = () => {
    if (deviceType === 'phone' && orientation === 'landscape') {
      return {
        paddingTop: "56.25%",
        maxHeight: "calc(100vh - 120px)"
      };
    }
    return { paddingTop: "56.25%" };
  };

  const handleOpenExternal = () => {
    window.open(activeStream.embedUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 md:mb-8 overflow-hidden border border-gray-200">
      <div className="relative w-full" style={getPlayerStyle()}>
        <div className="absolute inset-0 bg-masters-dark flex items-center justify-center">
          {iframeStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          )}
          
          <iframe
            src={activeStream.embedUrl}
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${activeStream.name} - The Masters Live Stream`}
            onLoad={() => setIframeStatus('loaded')}
            onError={() => setIframeStatus('error')}
          ></iframe>
        </div>
      </div>
      
      {needsStreamHelp && (
        <div className="p-3 pt-4 border-t border-amber-200 bg-amber-50/50">
          <CookieNotice 
            showFullMessage={false}
            onOpenExternal={handleOpenExternal}
          />
        </div>
      )}
      
      <div className="p-3 md:p-4 lg:p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-3 md:mb-4 lg:mb-6 gap-2 md:gap-4">
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-serif font-semibold flex items-center gap-2 text-masters-green">
              <Tv size={isMobile ? 18 : 20} className="text-masters-green" />
              {activeStream.name}
              {activeStream.isOfficial && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-masters-gold/20 text-masters-gold">
                  Official
                </span>
              )}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{activeStream.description}</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="text-masters-green border-masters-green hover:bg-masters-green hover:text-white transition-colors h-8 md:h-9">
                  <Calendar size={isMobile ? 14 : 16} className="mr-1" />
                  <span className="hidden xs:inline">Broadcast</span> Schedule
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh] rounded-t-xl" : ""}>
                <SheetHeader>
                  <SheetTitle className="font-serif text-masters-green">Broadcast Schedule</SheetTitle>
                  <SheetDescription>
                    All times are in Eastern Time (ET)
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
                  {FEATURED_BROADCASTS.map((daySchedule) => (
                    <div key={daySchedule.day} className="border-b border-gray-200 pb-4 last:border-0">
                      <h4 className="text-sm font-medium text-masters-gold mb-2">{daySchedule.day}</h4>
                      <ul className="space-y-2">
                        {daySchedule.broadcasts.map((broadcast, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{broadcast.time}</span> - {broadcast.name}
                            <span className="ml-1 text-gray-500">({broadcast.source})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="default" 
              size={isMobile ? "sm" : "default"}
              className="bg-masters-green hover:bg-masters-green/90 text-white h-8 md:h-9"
              onClick={handleOpenExternal}
            >
              <ExternalLink size={isMobile ? 14 : 16} className="mr-1" />
              Open in Masters.com
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all-streams" className="w-full">
          <TabsList className="mb-3 md:mb-4 w-full md:w-auto bg-gray-100 h-auto p-1">
            <TabsTrigger value="all-streams" className="text-xs md:text-sm py-1.5 flex-1 data-[state=active]:bg-masters-green data-[state=active]:text-white">
              All Streams
            </TabsTrigger>
            <TabsTrigger value="featured-groups" className="text-xs md:text-sm py-1.5 flex-1 data-[state=active]:bg-masters-green data-[state=active]:text-white">
              Featured Groups
            </TabsTrigger>
            <TabsTrigger value="featured-holes" className="text-xs md:text-sm py-1.5 flex-1 data-[state=active]:bg-masters-green data-[state=active]:text-white">
              Featured Holes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-streams" className="mt-0">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
              {LIVE_STREAMS.map((stream) => (
                <div 
                  key={stream.id}
                  className={`cursor-pointer p-2 md:p-4 rounded-lg border transition-all ${
                    activeStream.id === stream.id 
                      ? 'border-masters-green/50 bg-masters-green/5 shadow-sm' 
                      : 'border-gray-200 hover:border-masters-green/30 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveStream(stream)}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="mt-1 p-1.5 md:p-2 rounded-full bg-masters-green/10 text-masters-green">
                      {stream.id.includes('featured-groups') ? (
                        <Film size={isMobile ? 16 : 20} />
                      ) : (
                        <Tv size={isMobile ? 16 : 20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base text-gray-900">{stream.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{stream.description}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-1 md:mt-2 h-7 md:h-8 text-masters-green hover:text-masters-green/80 hover:bg-masters-green/10 p-0"
                        onClick={() => setActiveStream(stream)}
                      >
                        <Play size={12} className="mr-1" />
                        Watch now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured-groups" className="mt-0">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-4">
              {LIVE_STREAMS.filter(s => s.id.includes('featured-groups')).length ? (
                LIVE_STREAMS
                  .filter(s => s.id.includes('featured-groups'))
                  .map((stream) => (
                    <div 
                      key={stream.id}
                      className={`cursor-pointer p-2 md:p-4 rounded-lg border transition-all ${
                        activeStream.id === stream.id 
                          ? 'border-masters-green/50 bg-masters-green/5 shadow-sm' 
                          : 'border-gray-200 hover:border-masters-green/30 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveStream(stream)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-full bg-masters-green/10 text-masters-green">
                          <Film size={isMobile ? 16 : 20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{stream.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{stream.description}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 h-8 text-masters-green hover:text-masters-green/80 hover:bg-masters-green/10 p-0"
                            onClick={() => setActiveStream(stream)}
                          >
                            <Play size={14} className="mr-1" />
                            Watch now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full p-8 text-center">
                  <p className="text-gray-500">Featured groups coverage will be available during tournament play.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 text-masters-green border-masters-green hover:bg-masters-green hover:text-white transition-colors"
                    onClick={() => setActiveStream(LIVE_STREAMS[0])}
                  >
                    <Tv size={16} className="mr-1" />
                    Watch main stream
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="featured-holes" className="mt-0">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {LIVE_STREAMS.filter(s => s.id.includes('amen-corner') || s.id.includes('holes')).length ? (
                LIVE_STREAMS
                  .filter(s => s.id.includes('amen-corner') || s.id.includes('holes'))
                  .map((stream) => (
                    <div 
                      key={stream.id}
                      className={`cursor-pointer p-2 md:p-4 rounded-lg border transition-all ${
                        activeStream.id === stream.id 
                          ? 'border-masters-green/50 bg-masters-green/5 shadow-sm' 
                          : 'border-gray-200 hover:border-masters-green/30 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveStream(stream)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-full bg-masters-green/10 text-masters-green">
                          <Tv size={isMobile ? 16 : 20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{stream.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{stream.description}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 h-8 text-masters-green hover:text-masters-green/80 hover:bg-masters-green/10 p-0"
                            onClick={() => setActiveStream(stream)}
                          >
                            <Play size={14} className="mr-1" />
                            Watch now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full p-8 text-center">
                  <p className="text-gray-500">Featured holes coverage will be available during tournament play.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 text-masters-green border-masters-green hover:bg-masters-green hover:text-white transition-colors"
                    onClick={() => setActiveStream(LIVE_STREAMS[0])}
                  >
                    <Tv size={16} className="mr-1" />
                    Watch main stream
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <Info size={isMobile ? 14 : 16} className="text-masters-yellow mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Live streaming coverage is provided by Masters.com. For the best experience on mobile, try rotating your device to landscape mode or enabling cookies if you encounter loading issues.
              <a 
                href="https://www.masters.com/en_US/watch/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-masters-green hover:underline mx-1"
              >
                Masters.com
              </a>
              also offers an official mobile app with enhanced features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
