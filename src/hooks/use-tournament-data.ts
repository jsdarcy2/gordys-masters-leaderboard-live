
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { GolferScore, DataSource } from "@/types";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";
import { getApiHealthStatus, getBestDataSource, checkApiHealth, API_ENDPOINTS } from "@/services/api";
import { isTournamentInProgress } from "@/services/tournament";
import { fetchLeaderboardData } from "@/services/leaderboard";

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
  consecutiveFailures: number;
}

/**
 * Enhanced tournament data hook with high-availability features
 * - Google Sheets data fetching with health-aware fallback
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
  const fetchLeaderboardDataWithRetry = useCallback(async (force = false): Promise<void> => {
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
      
      // Fetch data from Google Sheets using the centralized fetchLeaderboardData function
      const result = await fetchLeaderboardData();
      
      if (result && Array.isArray(result.leaderboard) && result.leaderboard.length > 0) {
        // Reset retry count on success
        setRetryCount(0);
        if (retryTimer) {
          clearTimeout(retryTimer);
          setRetryTimer(null);
        }
        
        // Update the state with the new data
        updateLeaderboardData({
          leaderboard: result.leaderboard,
          lastUpdated: result.lastUpdated,
          source: result.source,
          year: currentYear
        });
        setError(null);
        
        // Cache the successful data
        saveToCache(LEADERBOARD_CACHE_KEY, result.leaderboard, result.source);
        localStorage.setItem('leaderboardLastUpdated', result.lastUpdated);
        localStorage.setItem('leaderboardSource', result.source);
        localStorage.setItem('leaderboardYear', currentYear);
        
        // Update system health status
        setDataHealth({
          status: "healthy",
          message: `Data successfully retrieved from ${result.source}`,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Successfully updated leaderboard from ${result.source} with ${result.leaderboard.length} players`);
      } else {
        // Data fetch failed, try to get data from cache regardless of age
        failedAttempts.current++;
        const lastResortCache = getFromCache(LEADERBOARD_CACHE_KEY, 0); // 0 = ignore expiration
        
        if (lastResortCache.data && Array.isArray(lastResortCache.data) && lastResortCache.data.length > 0) {
          console.log(`Google Sheets failed. Using expired cache as fallback (${Math.round(lastResortCache.age / 60000)}m old)`);
          
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
            message: "Using cached data - Google Sheets unavailable",
            timestamp: new Date().toISOString()
          });
          
          setError("Google Sheets is currently unavailable. Using cached data.");
          
          // Generate and show emergency notification for site administrators
          if (failedAttempts.current >= 5) {
            console.error("CRITICAL: Google Sheets data source has failed 5+ times in a row");
            toast({
              title: "Data Access Critical",
              description: "Google Sheets data source has failed multiple times. Emergency protocols activated.",
              variant: "destructive",
            });
          }
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardDataWithRetry(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else if (failedAttempts.current >= EMERGENCY_MOCK_DATA_THRESHOLD) {
          // EMERGENCY: If Google Sheets failed and no cache, generate mock data with clear warning
          console.error("CRITICAL: No data available from Google Sheets or cache! Using emergency mock data");
          
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
            message: "GOOGLE SHEETS OFFLINE - Emergency mock data activated",
            timestamp: new Date().toISOString()
          });
          
          // Clear error to avoid double messages
          setError("EMERGENCY MODE: Using mock data as Google Sheets failed");
          
          // Show emergency toast for users
          toast({
            title: "Emergency Data Mode",
            description: "Google Sheets is currently unavailable. Displaying backup data.",
            variant: "destructive",
          });
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardDataWithRetry(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else {
          // No cache, no data from Google Sheets, but not enough failures for mock data yet
          setError("Unable to fetch tournament data from Google Sheets. Please try again later.");
          console.error("Google Sheets data source failed and no cache available");
          
          // Update system health
          setDataHealth({
            status: "offline",
            message: "Google Sheets data source unavailable",
            timestamp: new Date().toISOString()
          });
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds (attempt ${retryCount + 1})`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardDataWithRetry(true);
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
          fetchLeaderboardDataWithRetry(true);
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
    updateLeaderboardData,
    toast,
    generateEmergencyMockData,
    currentYear
  ]);

  // Setup health monitoring and periodic check for API health
  useEffect(() => {
    const checkAllApiHealth = async () => {
      // Check health of Google Sheets endpoint
      await checkApiHealth(API_ENDPOINTS.GOOGLE_SHEETS);
      
      // Get all health statuses
      const allStatus = getApiHealthStatus();
      const sheetsStatus = allStatus.find(s => s.endpoint === API_ENDPOINTS.GOOGLE_SHEETS);
      
      // Update overall system health based on API health
      if (sheetsStatus && sheetsStatus.status === 'offline') {
        setDataHealth({
          status: "offline",
          message: "Google Sheets data source is currently offline",
          timestamp: new Date().toISOString()
        });
      } else if (sheetsStatus && sheetsStatus.status === 'degraded') {
        setDataHealth({
          status: "degraded",
          message: "Google Sheets data source is experiencing issues",
          timestamp: new Date().toISOString()
        });
      } else if (sheetsStatus) {
        setDataHealth({
          status: "healthy",
          message: "Google Sheets data source is operational",
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
      await fetchLeaderboardDataWithRetry();
      
      // Determine polling interval based on if tournament is in progress
      const isActive = await isTournamentInProgress();
      const pollingInterval = isActive ? 30000 : 5 * 60 * 1000; // 30 seconds during tournament, 5 minutes otherwise
      
      console.log(`Setting up polling interval: ${pollingInterval / 1000} seconds (tournament active: ${isActive})`);
      
      // Set up periodic polling
      const interval = setInterval(() => {
        fetchLeaderboardDataWithRetry();
      }, pollingInterval);
      
      return interval;
    };
    
    const pollingIntervalPromise = initializeData();
    
    return () => {
      pollingIntervalPromise.then(interval => clearInterval(interval));
      if (retryTimer) clearTimeout(retryTimer);
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
    };
  }, [fetchLeaderboardDataWithRetry]);

  return {
    leaderboard,
    loading,
    error,
    lastUpdated,
    dataSource,
    dataYear,
    refreshData: fetchLeaderboardDataWithRetry,
    hasLiveData,
    dataHealth,
    consecutiveFailures: failedAttempts.current
  };
}
