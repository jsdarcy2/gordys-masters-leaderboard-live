
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCacheAge } from "@/utils/cacheUtils";

/**
 * Options for the useDataFetching hook
 */
interface UseDataFetchingOptions<T> {
  // Function to fetch the data
  fetchFn: () => Promise<T>;
  
  // How often to poll for new data in milliseconds (0 = no polling)
  pollingInterval?: number;
  
  // Whether polling should only happen when the tournament is active
  onlyPollDuringTournament?: boolean;
  
  // Initial data value
  initialData?: T;
  
  // Name of the data being fetched (for notifications)
  dataName?: string;
  
  // Function to check if tournament is active
  isTournamentActiveFn?: () => Promise<boolean>;
  
  // Whether to show notifications
  showNotifications?: boolean;
  
  // Whether to refetch on mount and focus
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  
  // Dependencies for refetching
  dependencies?: any[];
}

/**
 * Custom hook for data fetching with smart polling, caching, and error handling
 */
export function useDataFetching<T>({
  fetchFn,
  pollingInterval = 0,
  onlyPollDuringTournament = true,
  initialData,
  dataName = "Data",
  isTournamentActiveFn,
  showNotifications = true,
  refetchOnMount = true,
  refetchOnWindowFocus = true,
  dependencies = []
}: UseDataFetchingOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const mountedRef = useRef(true);
  
  // Check tournament status if needed
  const checkTournamentStatus = useCallback(async () => {
    if (isTournamentActiveFn) {
      try {
        const active = await isTournamentActiveFn();
        setIsTournamentActive(active);
        return active;
      } catch (error) {
        console.error("Error checking tournament status:", error);
        return false;
      }
    }
    return true;
  }, [isTournamentActiveFn]);
  
  // Fetch data with error handling and loading states
  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else if (loading === false) {
        setLoading(true);
      }
      
      const result = await fetchFn();
      
      if (!mountedRef.current) return;
      
      setData(result);
      setError(null);
      const timestamp = new Date().toISOString();
      setLastUpdated(timestamp);
      
      if (showRefreshing && showNotifications) {
        toast({
          title: `${dataName} Updated`,
          description: "Fresh data loaded successfully.",
        });
      }
      
      return result;
    } catch (err) {
      if (!mountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load ${dataName.toLowerCase()}: ${errorMessage}`);
      
      if (showRefreshing && showNotifications) {
        toast({
          title: `${dataName} Error`,
          description: `Could not refresh ${dataName.toLowerCase()} data. Please try again later.`,
          variant: "destructive",
        });
      }
      
      return undefined;
    } finally {
      if (mountedRef.current) {
        setIsRefreshing(false);
        setLoading(false);
      }
    }
  }, [fetchFn, loading, dataName, showNotifications, toast]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);
  
  // Set up polling based on tournament status
  useEffect(() => {
    const setupPolling = async () => {
      // Clear any existing interval
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      // Check if we should poll
      const shouldPoll = pollingInterval > 0 && 
        (!onlyPollDuringTournament || await checkTournamentStatus());
      
      // Set up polling if needed
      if (shouldPoll) {
        console.log(`Setting up ${pollingInterval/1000}s polling for ${dataName.toLowerCase()}`);
        
        pollingRef.current = setInterval(() => {
          if (document.visibilityState === 'visible') {
            fetchData(false);
          }
        }, pollingInterval);
      } else {
        console.log(`Polling disabled for ${dataName.toLowerCase()}`);
      }
    };
    
    setupPolling();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [pollingInterval, onlyPollDuringTournament, fetchData, checkTournamentStatus, dataName]);
  
  // Initial fetch and dependency-triggered refetches
  useEffect(() => {
    mountedRef.current = true;
    
    if (refetchOnMount) {
      fetchData(false);
    }
    
    // Check tournament status every 15 minutes
    const statusInterval = setInterval(() => {
      checkTournamentStatus();
    }, 15 * 60 * 1000);
    
    return () => {
      mountedRef.current = false;
      clearInterval(statusInterval);
    };
  }, [...dependencies, checkTournamentStatus, fetchData, refetchOnMount]);
  
  // Handle refetching when window regains focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    
    const onFocus = () => {
      fetchData(false);
    };
    
    window.addEventListener('focus', onFocus);
    
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [refetchOnWindowFocus, fetchData]);
  
  // Format last updated time
  const formattedLastUpdated = lastUpdated ? formatCacheAge(new Date(lastUpdated).getTime()) : "";
  
  return {
    data,
    loading,
    error,
    lastUpdated,
    formattedLastUpdated,
    isRefreshing,
    isTournamentActive,
    refresh: handleRefresh
  };
}
