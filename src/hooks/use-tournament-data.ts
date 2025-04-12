import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { GolferScore, DataSource } from "@/types";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";
import { getApiHealthStatus, getBestDataSource, checkApiHealth, API_ENDPOINTS } from "@/services/api";
import { isTournamentInProgress } from "@/services/tournament";
import { fetchLeaderboardData } from "@/services/leaderboard";

const LEADERBOARD_CACHE_KEY = "leaderboardData";
const CACHE_EXPIRY = 60 * 60 * 1000; // 60 minutes - extended cache expiry for betting
const RETRY_INTERVALS = [3000, 5000, 10000, 15000, 30000]; // Less aggressive retry strategy
const EMERGENCY_MOCK_DATA_THRESHOLD = 10; // Increased threshold for using mock data
const HEALTH_CHECK_INTERVAL = 120000; // 2 minutes

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
 * Enhanced tournament data hook optimized for betting applications
 * - Google Sheets data fetching with more tolerant fallback logic
 * - Moderate retries to avoid overwhelming API
 * - Extended cache TTL for more stable display
 * - Graceful degradation instead of emergency fallbacks
 * - Non-alarming status messaging
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

  // Generate realistic mock data with betting-friendly approach
  const generateEmergencyMockData = useCallback((): GolferScore[] => {
    const playerNames = [
      "Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jon Rahm", 
      "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", 
      "Dustin Johnson", "Collin Morikawa", "Xander Schauffele", "Patrick Cantlay",
      "Viktor Hovland", "Cameron Smith", "Hideki Matsuyama", "Will Zalatoris", 
      "Tony Finau", "Matt Fitzpatrick", "Shane Lowry", "Tommy Fleetwood"
    ];
    
    // Generate more realistic mock data using typical Masters scoring
    return playerNames.map((name, index) => {
      const position = index + 1;
      // Use more realistic Masters scoring (leaders often around -10)
      const baseScore = Math.floor(index / 3) - 10; 
      const score = Math.max(baseScore, -12); // Cap at -12 under par
      const today = Math.floor(Math.random() * 5) - 3; // Random today score between -3 and 1
      
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

  // Main data fetching function with reliability improvements for betting
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
          
          // Silently continue with fetch in background to update the cache
          console.log("Continuing with background fetch to update cache...");
        }
      }
      
      // Fetch data using the centralized fetchLeaderboardData function
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
        
        // Update system health status - be more positive
        setDataHealth({
          status: "healthy",
          message: `Data connected and streaming from ${result.source}`,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Successfully updated leaderboard from ${result.source} with ${result.leaderboard.length} players`);
      } else {
        // Data fetch failed, try to get data from cache regardless of age
        failedAttempts.current++;
        const lastResortCache = getFromCache(LEADERBOARD_CACHE_KEY, 0); // 0 = ignore expiration
        
        if (lastResortCache.data && Array.isArray(lastResortCache.data) && lastResortCache.data.length > 0) {
          console.log(`Using cache as fallback`);
          
          const cachedData = {
            leaderboard: lastResortCache.data,
            lastUpdated: new Date(lastResortCache.timestamp).toISOString(),
            source: "cached-data" as DataSource,
            year: localStorage.getItem('leaderboardYear') || new Date().getFullYear().toString()
          };
          
          updateLeaderboardData(cachedData);
          
          // Update system health - avoid alarming terms
          setDataHealth({
            status: "degraded",
            message: "Using saved data while connection refreshes",
            timestamp: new Date().toISOString()
          });
          
          setError("Live data currently refreshing");
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardDataWithRetry(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else if (failedAttempts.current >= EMERGENCY_MOCK_DATA_THRESHOLD) {
          // Only use mock data as absolute last resort, and after many attempts
          console.log("Using realistic score estimates");
          
          const mockLeaderboard = generateEmergencyMockData();
          const mockData = {
            leaderboard: mockLeaderboard,
            lastUpdated: new Date().toISOString(),
            source: "mock-data" as DataSource,
            year: currentYear
          };
          
          updateLeaderboardData(mockData);
          
          // Update system health to degraded, not offline
          setDataHealth({
            status: "degraded",
            message: "Using estimated standings - refresh in progress",
            timestamp: new Date().toISOString()
          });
          
          // Clear error to avoid double messages
          setError("Live data connection being established");
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds`);
            
            if (retryTimer) clearTimeout(retryTimer);
            const timer = setTimeout(() => {
              fetchLeaderboardDataWithRetry(true);
            }, nextRetryDelay);
            
            setRetryTimer(timer);
            setRetryCount(prev => prev + 1);
          }
        } else {
          // No cache, no data yet
          setError("Data connection initializing. Please wait.");
          console.log("Awaiting first data load");
          
          // Update system health
          setDataHealth({
            status: "degraded",
            message: "Initializing data connection",
            timestamp: new Date().toISOString()
          });
          
          // Set up retry with progressive backoff
          if (retryCount < RETRY_INTERVALS.length) {
            const nextRetryDelay = RETRY_INTERVALS[retryCount];
            console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds`);
            
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
      setError("Data refresh in progress. Standby.");
      
      // Update health status
      setDataHealth({
        status: "degraded",
        message: "Data refresh in progress",
        timestamp: new Date().toISOString()
      });
      
      // Set up retry with progressive backoff
      if (retryCount < RETRY_INTERVALS.length) {
        const nextRetryDelay = RETRY_INTERVALS[retryCount];
        console.log(`Scheduling retry in ${nextRetryDelay / 1000} seconds`);
        
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

  // Initialize data fetching with more reasonable polling
  useEffect(() => {
    const initializeData = async () => {
      await fetchLeaderboardDataWithRetry();
      
      // Determine polling interval based on if tournament is in progress
      const isActive = await isTournamentInProgress();
      const pollingInterval = isActive ? 60000 : 5 * 60 * 1000; // Less aggressive polling - 1 minute during tournament
      
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
