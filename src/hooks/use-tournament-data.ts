import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { GolferScore, DataSource } from "@/types";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";
import { isTournamentInProgress } from "@/services/tournament";
import { fetchLeaderboardData } from "@/services/leaderboard";

const LEADERBOARD_CACHE_KEY = "leaderboardData";
const CACHE_EXPIRY = 60 * 60 * 1000; // 60 minutes cache expiry
const RETRY_INTERVALS = [3000, 5000, 10000]; // Retry intervals in ms

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
    setDataSource(data.source as DataSource);
    setDataYear(data.year);
    setHasLiveData(data.source === "masters-scores-api");
    
    // Reset failed attempts counter on success
    failedAttempts.current = 0;
    
    return data;
  }, []);

  // Main data fetching function
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
        
        // Always set hasLiveData to true for our hosted data
        setHasLiveData(true);
        
        // Update system health status
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
          
          // Update system health
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
        } else {
          setError("Data connection initializing. Please wait.");
          
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
    currentYear
  ]);

  // Initialize data fetching
  useEffect(() => {
    const initializeData = async () => {
      await fetchLeaderboardDataWithRetry();
      
      // Determine polling interval based on if tournament is in progress
      const isActive = await isTournamentInProgress();
      const pollingInterval = isActive ? 60000 : 5 * 60 * 1000; // 1 minute during tournament, 5 minutes otherwise
      
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
