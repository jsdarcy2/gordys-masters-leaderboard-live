import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { GolferScore, DataSource } from "@/types";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";
import { getApiHealthStatus, getBestDataSource, checkApiHealth, API_ENDPOINTS } from "@/services/api";
import { isTournamentInProgress } from "@/services/tournament";

const LEADERBOARD_CACHE_KEY = "leaderboardData";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
const RETRY_INTERVALS = [3000, 5000, 15000, 30000, 60000]; // More aggressive retry delays in ms
const EMERGENCY_MOCK_DATA_THRESHOLD = 3; // Number of failed attempts before using mock data
const HEALTH_CHECK_INTERVAL = 60000; // Check API health every minute

interface UseLeaderboardResult {
  leaderboard: GolferScore[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  dataSource: DataSource | undefined;
  dataYear: string | undefined;
  refreshData: (force?: boolean) => Promise<void>;
  hasLiveData: boolean;
  dataHealth: {
    status: "healthy" | "degraded" | "offline";
    message: string;
    timestamp: string;
  };
  consecutiveFailures: number; // Added this property to the interface
}

/**
 * Enhanced tournament data hook with high-availability features
 * - Multi-source data fetching with health-aware source selection
 * - Aggressive retries with smart backoff
 * - Persistent cache with TTL and versioning
 * - Fallback mechanisms including mock data generation
 * - Real-time API health monitoring
 */
export function useTournamentData(): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<GolferScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<DataSource | undefined>(undefined);
  const [dataYear, setDataYear] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimer, setRetryTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [dataHealth, setDataHealth] = useState<{
    status: "healthy" | "degraded" | "offline";
    message: string;
    timestamp: string;
  }>({
    status: "healthy",
    message: "Data systems operational",
    timestamp: new Date().toISOString()
  });
  
  const healthCheckRef = useRef<NodeJS.Timeout | null>(null);
  const failedAttempts = useRef(0);
  const { toast } = useToast();
  const currentYear = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();

  // Helper function to extract and update leaderboard data
  const updateLeaderboardData = useCallback((data: any) => {
    if (!data || !Array.isArray(data.leaderboard)) {
      throw new Error("Invalid data structure received");
    }

    setLeaderboard(data.leaderboard);
    setLastUpdated(data.lastUpdated || new Date().toISOString());
    setDataSource(data.source);
    setDataYear(data.year);
    setHasLiveData(data.source !== "mock-data" && data.source !== "cached-data" && data.source !== "historical-data");
    
    // Reset failed attempts counter on success
    failedAttempts.current = 0;
    
    return data;
  }, []);

  // Enhanced fetch from source with health checks and detailed logging
  const fetchFromSource = useCallback(async (
    sourceName: string, 
    fetcher: () => Promise<any>
  ): Promise<any | null> => {
    try {
      // Check if this source has been consistently failing
      const healthStatus = getApiHealthStatus().find(s => 
        s.endpoint.includes(sourceName.toLowerCase().replace('-api', ''))
      );
      
      if (healthStatus && healthStatus.status === 'offline' && healthStatus.consecutiveFailures > 3) {
        console.log(`Skipping ${sourceName} as it's been offline (${healthStatus.consecutiveFailures} consecutive failures)`);
        return null;
      }
      
      console.log(`Attempting to fetch data from ${sourceName}...`);
      const startTime = performance.now();
      const data = await fetcher();
      const endTime = performance.now();
      const fetchTime = endTime - startTime;
      
      console.log(`Successfully fetched data from ${sourceName} in ${fetchTime.toFixed(0)}ms:`, 
        Array.isArray(data?.leaderboard) ? `${data.leaderboard.length} players` : "invalid data");
      
      if (!data || !Array.isArray(data.leaderboard) || data.leaderboard.length === 0) {
        console.warn(`${sourceName} returned empty or invalid data`);
        return null;
      }
      
      // Tag the source
      data.source = sourceName as DataSource;
      
      // Update the data health based on success
      setDataHealth({
        status: "healthy",
        message: `Data successfully retrieved from ${sourceName}`,
        timestamp: new Date().toISOString()
      });
      
      return data;
    } catch (error) {
      console.error(`Error fetching from ${sourceName}:`, error);
      return null;
    }
  }, []);

  // Try PGA Tour official API (primary source)
  const fetchFromPGATour = useCallback(async () => {
    return fetchFromSource("pgatour-api", async () => {
      // Check API health first
      await checkApiHealth(API_ENDPOINTS.PGA_TOUR);
      
      const response = await fetch(API_ENDPOINTS.PGA_TOUR, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      
      if (!response.ok) throw new Error(`PGA Tour API error: ${response.status}`);
      
      const data = await response.json();
      const tournament = data?.leaderboard?.tournament;
      const players = data?.leaderboard?.players;
      
      if (!tournament || !players || !Array.isArray(players)) {
        throw new Error("Invalid PGA Tour data structure");
      }
      
      // Transform PGA Tour data to our application format
      const leaderboard: GolferScore[] = players.map((player: any) => {
        // Handle player status
        const status = player.status === "cut" 
          ? "cut" 
          : player.status === "wd" 
            ? "withdrawn" 
            : "active";
            
        // Parse scores, handling "E" for even par
        const totalScore = player.total && player.total !== "E" 
          ? parseInt(player.total, 10) 
          : 0;
          
        const todayScore = player.today && player.today !== "E" 
          ? parseInt(player.today, 10) 
          : 0;
        
        return {
          position: parseInt(player.current_position || "0", 10),
          name: player.player_bio?.first_name + " " + player.player_bio?.last_name,
          score: totalScore,
          today: todayScore,
          thru: player.thru || "F",
          status: status,
          strokes: player.total_strokes ? parseInt(player.total_strokes, 10) : undefined
        };
      });
      
      // Sort by position
      leaderboard.sort((a, b) => a.position - b.position);
      
      const tournamentYear = tournament.start_date 
        ? new Date(tournament.start_date).getFullYear().toString() 
        : new Date().getFullYear().toString();
      
      return {
        leaderboard,
        lastUpdated: new Date().toISOString(),
        year: tournamentYear
      };
    });
  }, [fetchFromSource]);

  // Try ESPN API (first backup source)
  const fetchFromESPN = useCallback(async () => {
    const year = currentYear;
    const endpoint = API_ENDPOINTS.ESPN.replace('{year}', year);
    
    return fetchFromSource("espn-api", async () => {
      // Check API health first
      await checkApiHealth(endpoint);
      
      const response = await fetch(endpoint, { 
        headers: { "Cache-Control": "no-cache" } 
      });
      
      if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);
      
      const data = await response.json();
      
      // Transform ESPN data to our application format
      const events = data?.events?.[0];
      const competitors = events?.competitions?.[0]?.competitors || [];
      const leaderboard: GolferScore[] = [];
      
      competitors.forEach((player: any) => {
        // Handle status
        const status = player.status?.type?.description?.toLowerCase() === "cut" 
          ? "cut" 
          : player.status?.type?.description?.toLowerCase() === "withdrawn" 
            ? "withdrawn" 
            : "active";
            
        // Parse score values
        const totalScore = player.score || "0";
        const todayScore = player.linescores?.[events.status.period - 1]?.value || "0";
        
        // Format scores as numbers (handling "E" for even par)
        const totalScoreNum = totalScore === "E" ? 0 : parseInt(totalScore, 10);
        const todayScoreNum = todayScore === "E" ? 0 : parseInt(todayScore, 10);
        
        leaderboard.push({
          position: parseInt(player.status?.position?.id || "0", 10),
          name: player.athlete?.displayName || "",
          score: totalScoreNum,
          today: todayScoreNum,
          thru: player.status?.thru || player.status?.type?.shortDetail || "F", 
          status: status,
          strokes: player.statistics?.find((s: any) => s.name === "totalStrokes")?.value
        });
      });
      
      // Sort by position
      leaderboard.sort((a, b) => a.position - b.position);
      
      // Get tournament year from ESPN data
      const tournamentYear = events?.date 
        ? new Date(events.date).getFullYear().toString() 
        : year;
      
      return {
        leaderboard,
        lastUpdated: new Date().toISOString(),
        year: tournamentYear
      };
    });
  }, [fetchFromSource, currentYear]);

  // Try Sports Data API (second backup)
  const fetchFromSportsData = useCallback(async () => {
    const year = currentYear;
    const endpoint = API_ENDPOINTS.SPORTS_DATA.replace('{year}', year);
    
    return fetchFromSource("sportsdata-api", async () => {
      // Check API health first
      await checkApiHealth(endpoint, {
        headers: {
          'X-RapidAPI-Key': 'nEUPNJrOuvmshtV5BfQlMr2X2nwNp19eRh3jsn3oXRwhhypbcb',
          'X-RapidAPI-Host': 'masters-score-stream-hub.lovable.app'
        }
      });
      
      const response = await fetch(endpoint, {
        headers: {
          'X-RapidAPI-Key': 'nEUPNJrOuvmshtV5BfQlMr2X2nwNp19eRh3jsn3oXRwhhypbcb',
          'X-RapidAPI-Host': 'masters-score-stream-hub.lovable.app',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error(`Sports Data API error: ${response.status}`);
      
      const data = await response.json();
      
      // Transform Sports Data API format to our application format
      const players = data?.leaderboard?.players || [];
      const leaderboard: GolferScore[] = [];
      
      players.forEach((player: any) => {
        const status = player.status?.toLowerCase() === "cut" 
          ? "cut" 
          : player.status?.toLowerCase() === "wd" 
            ? "withdrawn" 
            : "active";
            
        // Calculate score and today score
        const totalScore = player.total_to_par || "0";
        const todayScore = player.today || "0";
        
        // Parse scores, handling "E" for even par
        const totalScoreNum = totalScore === "E" ? 0 : parseInt(totalScore, 10);
        const todayScoreNum = todayScore === "E" ? 0 : parseInt(todayScore, 10);
        
        leaderboard.push({
          position: parseInt(player.position || "0", 10),
          name: player.player_name || "",
          score: totalScoreNum,
          today: todayScoreNum,
          thru: player.thru || "F",
          status: status,
          strokes: player.total_strokes ? parseInt(player.total_strokes, 10) : undefined
        });
      });
      
      // Sort by position
      leaderboard.sort((a, b) => a.position - b.position);
      
      return {
        leaderboard,
        lastUpdated: new Date().toISOString(),
        year: data.year?.toString() || year
      };
    });
  }, [fetchFromSource, currentYear]);

  // Try Masters.com scraping (final backup)
  const fetchFromMastersScraper = useCallback(async () => {
    return fetchFromSource("masters-scraper", async () => {
      // Check API health first
      await checkApiHealth(API_ENDPOINTS.MASTERS_WEB);
      
      // Import the scraper function dynamically to avoid initialization issues
      const { scrapeMastersWebsite } = await import("@/services/leaderboard/scraper");
      const scrapedLeaderboard = await scrapeMastersWebsite();
      
      if (!scrapedLeaderboard || !Array.isArray(scrapedLeaderboard) || scrapedLeaderboard.length === 0) {
        throw new Error("Masters.com scraping returned no data");
      }
      
      return {
        leaderboard: scrapedLeaderboard,
        lastUpdated: new Date().toISOString(),
        year: new Date().getFullYear().toString()
      };
    });
  }, [fetchFromSource]);

  // Generate realistic mock data with warning as absolute last resort
  const generateEmergencyMockData = useCallback((): GolferScore[] => {
    const playerNames = [
      "Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jon Rahm", 
      "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", 
      "Dustin Johnson", "Collin Morikawa", "Xander Schauffele", "Patrick Cantlay",
      "Viktor Hovland", "Cameron Smith", "Hideki Matsuyama", "Will Zalatoris", 
      "Tony Finau", "Matt Fitzpatrick", "Shane Lowry", "Tommy Fleetwood"
    ];
    
    // Generate more realistic mock data
    return playerNames.map((name, index) => {
      const position = index + 1;
      const score = Math.floor(Math.random() * 10) - 5; // Random score between -5 and 4
      const today = Math.floor(Math.random() * 6) - 3; // Random today score between -3 and 2
      
      return {
        position,
        name,
        score,
        today,
        thru: "F",
        status: "active" as const
      };
    });
  }, []);

  // Main data fetching function with improved reliability
  const fetchLeaderboardData = useCallback(async (force = false): Promise<void> => {
    // If not forcing a refresh and we already have data, don't fetch again
    if (!force && leaderboard.length > 0 && !loading) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Check cache first (unless forced refresh)
      if (!force) {
        const cachedData = getFromCache(LEADERBOARD_CACHE_KEY, CACHE_EXPIRY);
        if (cachedData.data && Array.isArray(cachedData.data) && cachedData.data.length > 0) {
          console.log(`Using cached leaderboard data (${Math.round(cachedData.age / 1000)}s old)`);
          
          const dataToUse = {
            leaderboard: cachedData.data,
            lastUpdated: new Date(cachedData.timestamp).toISOString(),
            source: cachedData.source as DataSource,
            year: localStorage.getItem('leaderboardYear') || new Date().getFullYear().toString()
          };
          
          updateLeaderboardData(dataToUse);
          setError(null);
          
          // Continue with the fetch in the background to update the cache
          console.log("Continuing with background fetch to update cache...");
        }
      }
      
      // Get the best data source based on health checks
      const recommendedSource = getBestDataSource();
      console.log(`Health system recommends using ${recommendedSource} as primary data source`);
      
      // Try data sources in intelligent order based on health status
      let data = null;
      
      // Use recommended source first, then try others as fallback
      if (recommendedSource === 'pgatour-api' || recommendedSource === 'cached-data') {
        data = await fetchFromPGATour();
        if (!data) data = await fetchFromESPN();
        if (!data) data = await fetchFromSportsData();
        if (!data) data = await fetchFromMastersScraper();
      } else if (recommendedSource === 'espn-api') {
        data = await fetchFromESPN();
        if (!data) data = await fetchFromPGATour();
        if (!data) data = await fetchFromSportsData();
        if (!data) data = await fetchFromMastersScraper();
      } else if (recommendedSource === 'sportsdata-api') {
        data = await fetchFromSportsData();
        if (!data) data = await fetchFromPGATour();
        if (!data) data = await fetchFromESPN();
        if (!data) data = await fetchFromMastersScraper();
      } else if (recommendedSource === 'masters-scraper') {
        data = await fetchFromMastersScraper();
        if (!data) data = await fetchFromPGATour();
        if (!data) data = await fetchFromESPN();
        if (!data) data = await fetchFromSportsData();
      }
      
      // If we got data from any source, update the state and cache
      if (data && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
        // Reset retry count on success
        setRetryCount(0);
        if (retryTimer) {
          clearTimeout(retryTimer);
          setRetryTimer(null);
        }
        
        // Update the state with the new data
        updateLeaderboardData(data);
        setError(null);
        
        // Cache the successful data
        saveToCache(LEADERBOARD_CACHE_KEY, data.leaderboard, data.source);
        localStorage.setItem('leaderboardLastUpdated', data.lastUpdated);
        localStorage.setItem('leaderboardSource', data.source);
        if (data.year) {
          localStorage.setItem('leaderboardYear', data.year);
        }
        
        // Update system health status
        setDataHealth({
          status: "healthy",
          message: `Data successfully retrieved from ${data.source}`,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Successfully updated leaderboard from ${data.source} with ${data.leaderboard.length} players`);
      } else {
        // All sources failed, try to get data from cache regardless of age
        failedAttempts.current++;
        const lastResortCache = getFromCache(LEADERBOARD_CACHE_KEY, 0); // 0 = ignore expiration
        
        if (lastResortCache.data && Array.isArray(lastResortCache.data) && lastResortCache.data.length > 0) {
          console.log(`All sources failed. Using expired cache as fallback (${Math.round(lastResortCache.age / 60000)}m old)`);
          
          const cachedData = {
            leaderboard: lastResortCache.data,
            lastUpdated: new Date(lastResortCache.timestamp).toISOString(),
            source: "cached-data" as DataSource,
            year: localStorage.getItem('leaderboardYear') || new Date().getFullYear().toString()
          };
          
          updateLeaderboardData(cachedData);
          
          // Update system health
          setDataHealth({
            status: "degraded",
            message: "Using cached data - live sources unavailable",
            timestamp: new Date().toISOString()
          });
          
          setError("All data sources are currently unavailable. Using cached data.");
          
          // Generate and show emergency notification for site administrators
          if (failedAttempts.current >= 5) {
            console.error("CRITICAL: All data sources have failed 5+ times in a row");
            toast({
              title: "Data Access Critical",
              description: "All data sources have failed multiple times. Emergency protocols activated.",
              variant: "destructive",
            });
          }
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardData(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else if (failedAttempts.current >= EMERGENCY_MOCK_DATA_THRESHOLD) {
          // EMERGENCY: If all sources failed and no cache, generate mock data with clear warning
          console.error("CRITICAL: No data available from any source or cache! Using emergency mock data");
          
          const mockLeaderboard = generateEmergencyMockData();
          const mockData = {
            leaderboard: mockLeaderboard,
            lastUpdated: new Date().toISOString(),
            source: "mock-data" as DataSource,
            year: currentYear
          };
          
          updateLeaderboardData(mockData);
          
          // Update system health to offline
          setDataHealth({
            status: "offline",
            message: "ALL DATA SOURCES OFFLINE - Emergency mock data activated",
            timestamp: new Date().toISOString()
          });
          
          // Clear error to avoid double messages
          setError("EMERGENCY MODE: Using mock data as all data sources failed");
          
          // Show emergency toast for users
          toast({
            title: "Emergency Data Mode",
            description: "All data sources are currently unavailable. Displaying backup data.",
            variant: "destructive",
          });
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardData(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else {
          // No cache, no data from any source, but not enough failures for mock data yet
          setError("Unable to fetch tournament data from any source. Please try again later.");
          console.error("All data sources failed and no cache available");
          
          // Update system health
          setDataHealth({
            status: "offline",
            message: "All data sources unavailable",
            timestamp: new Date().toISOString()
          });
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardData(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error in fetchLeaderboardData:", error);
      setError("Failed to load leaderboard data. Please try again later.");
      
      // Update health status
      setDataHealth({
        status: "degraded",
        message: "Error fetching data: " + (error instanceof Error ? error.message : "Unknown error"),
        timestamp: new Date().toISOString()
      });
      
      // Set up retry with progressive backoff
      if (retryCount < RETRY_INTERVALS.length) {
        const nextRetryDelay = RETRY_INTERVALS[retryCount];
        console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
        
        if (retryTimer) clearTimeout(retryTimer);
        const timer = setTimeout(() => {
          fetchLeaderboardData(true);
        }, nextRetryDelay);
        
        setRetryTimer(timer);
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [
    leaderboard.length, 
    loading, 
    retryCount, 
    retryTimer, 
    fetchFromPGATour, 
    fetchFromESPN, 
    fetchFromSportsData, 
    fetchFromMastersScraper, 
    updateLeaderboardData,
    toast,
    generateEmergencyMockData,
    currentYear
  ]);

  // Setup health monitoring and periodic check for API health
  useEffect(() => {
    const checkAllApiHealth = async () => {
      const year = import.meta.env.VITE_TOURNAMENT_YEAR || new Date().getFullYear().toString();
      
      // Check health of all endpoints
      await checkApiHealth(API_ENDPOINTS.PGA_TOUR);
      await checkApiHealth(API_ENDPOINTS.ESPN.replace('{year}', year));
      await checkApiHealth(API_ENDPOINTS.SPORTS_DATA.replace('{year}', year), {
        headers: {
          'X-RapidAPI-Key': 'nEUPNJrOuvmshtV5BfQlMr2X2nwNp19eRh3jsn3oXRwhhypbcb',
          'X-RapidAPI-Host': 'masters-score-stream-hub.lovable.app'
        }
      });
      await checkApiHealth(API_ENDPOINTS.MASTERS_WEB);
      
      // Get all health statuses
      const allStatus = getApiHealthStatus();
      const offlineCount = allStatus.filter(s => s.status === 'offline').length;
      const totalSources = allStatus.length;
      
      // Update overall system health based on API health
      if (offlineCount === totalSources && totalSources > 0) {
        setDataHealth({
          status: "offline",
          message: "All data sources are currently offline",
          timestamp: new Date().toISOString()
        });
      } else if (offlineCount > 0 || allStatus.some(s => s.status === 'degraded')) {
        setDataHealth({
          status: "degraded",
          message: `${offlineCount} of ${totalSources} data sources offline`,
          timestamp: new Date().toISOString()
        });
      } else if (allStatus.length > 0) {
        setDataHealth({
          status: "healthy",
          message: "All data systems operational",
          timestamp: new Date().toISOString()
        });
      }
    };
    
    // Run initial health check
    checkAllApiHealth();
    
    // Set up periodic health monitoring
    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current);
    }
    
    healthCheckRef.current = setInterval(checkAllApiHealth, HEALTH_CHECK_INTERVAL);
    
    return () => {
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, []);

  // Initialize data fetching and set up polling
  useEffect(() => {
    const initializeData = async () => {
      await fetchLeaderboardData();
      
      // Determine polling interval based on if tournament is in progress
      const isActive = await isTournamentInProgress();
      const pollingInterval = isActive ? 30000 : 5 * 60 * 1000; // 30 seconds during tournament, 5 minutes otherwise
      
      console.log(`Setting up polling interval: ${pollingInterval / 1000} seconds (tournament active: ${isActive})`);
      
      // Set up periodic polling
      const interval = setInterval(() => {
        fetchLeaderboardData();
      }, pollingInterval);
      
      return interval;
    };
    
    const pollingIntervalPromise = initializeData();
    
    return () => {
      pollingIntervalPromise.then(interval => clearInterval(interval));
      if (retryTimer) clearTimeout(retryTimer);
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
    };
  }, [fetchLeaderboardData]);

  return {
    leaderboard,
    loading,
    error,
    lastUpdated,
    dataSource,
    dataYear,
    refreshData: fetchLeaderboardData,
    hasLiveData,
    dataHealth,
    consecutiveFailures: failedAttempts.current
  };
}
