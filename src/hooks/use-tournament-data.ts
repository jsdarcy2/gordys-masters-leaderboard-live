
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { GolferScore, DataSource } from "@/types";
import { formatLastUpdated } from "@/utils/leaderboardUtils";
import { getFromCache, saveToCache } from "@/utils/cacheUtils";

const LEADERBOARD_CACHE_KEY = "leaderboardData";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
const RETRY_INTERVALS = [5000, 15000, 30000, 60000]; // Progressive retry delays in ms

interface UseLeaderboardResult {
  leaderboard: GolferScore[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  dataSource: DataSource | undefined;
  dataYear: string | undefined;
  refreshData: (force?: boolean) => Promise<void>;
  hasLiveData: boolean;
}

/**
 * A custom hook that manages tournament leaderboard data from multiple sources
 * with smart retries, caching, and fallbacks
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
  const { toast } = useToast();

  // Helper function to extract and update leaderboard data
  const updateLeaderboardData = useCallback((data: any) => {
    if (!data || !Array.isArray(data.leaderboard)) {
      throw new Error("Invalid data structure received");
    }

    setLeaderboard(data.leaderboard);
    setLastUpdated(data.lastUpdated || new Date().toISOString());
    setDataSource(data.source);
    setDataYear(data.year);
    setHasLiveData(data.source !== "mock-data" && data.source !== "cached-data");
    
    return data;
  }, []);

  // Try to fetch data from a specific source
  const fetchFromSource = useCallback(async (
    sourceName: string, 
    fetcher: () => Promise<any>
  ): Promise<any | null> => {
    try {
      console.log(`Attempting to fetch data from ${sourceName}...`);
      const data = await fetcher();
      
      console.log(`Successfully fetched data from ${sourceName}:`, 
        Array.isArray(data?.leaderboard) ? `${data.leaderboard.length} players` : "invalid data");
      
      if (!data || !Array.isArray(data.leaderboard) || data.leaderboard.length === 0) {
        console.warn(`${sourceName} returned empty or invalid data`);
        return null;
      }
      
      // Tag the source
      data.source = sourceName as DataSource;
      return data;
    } catch (error) {
      console.error(`Error fetching from ${sourceName}:`, error);
      return null;
    }
  }, []);

  // Try PGA Tour official API (new source)
  const fetchFromPGATour = useCallback(async () => {
    return fetchFromSource("pgatour-api", async () => {
      const response = await fetch("https://statdata.pgatour.com/r/current/leaderboard-v2mini.json", {
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
          status: status
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

  // Try ESPN API (existing source)
  const fetchFromESPN = useCallback(async () => {
    const currentYear = new Date().getFullYear().toString();
    return fetchFromSource("espn-api", async () => {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard/events/${currentYear}/masters/leaderboard`, 
        { headers: { "Cache-Control": "no-cache" } }
      );
      
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
          status: status
        });
      });
      
      // Sort by position
      leaderboard.sort((a, b) => a.position - b.position);
      
      // Get tournament year from ESPN data
      const tournamentYear = events?.date 
        ? new Date(events.date).getFullYear().toString() 
        : currentYear;
      
      return {
        leaderboard,
        lastUpdated: new Date().toISOString(),
        year: tournamentYear
      };
    });
  }, [fetchFromSource]);

  // Try Sports Data API (existing source)
  const fetchFromSportsData = useCallback(async () => {
    const currentYear = new Date().getFullYear().toString();
    return fetchFromSource("sportsdata-api", async () => {
      const response = await fetch(`https://golf-live-data.p.rapidapi.com/leaderboard/masters/${currentYear}`, {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_SPORTS_API_KEY || 'fallback-key-for-dev',
          'X-RapidAPI-Host': 'golf-live-data.p.rapidapi.com',
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
          status: status
        });
      });
      
      // Sort by position
      leaderboard.sort((a, b) => a.position - b.position);
      
      return {
        leaderboard,
        lastUpdated: new Date().toISOString(),
        year: data.year?.toString() || currentYear
      };
    });
  }, [fetchFromSource]);

  // Try Masters.com scraping (existing source)
  const fetchFromMastersScraper = useCallback(async () => {
    return fetchFromSource("masters-scraper", async () => {
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

  // Main data fetching function that tries multiple sources
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
      
      // Try multiple data sources in order of reliability
      let data = null;
      
      // 1. Try PGA Tour API (new source)
      data = await fetchFromPGATour();
      
      // 2. Try ESPN API if PGA Tour failed
      if (!data) {
        data = await fetchFromESPN();
      }
      
      // 3. Try Sports Data API if ESPN failed
      if (!data) {
        data = await fetchFromSportsData();
      }
      
      // 4. Try Masters.com scraping if all else fails
      if (!data) {
        data = await fetchFromMastersScraper();
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
        
        console.log(`Successfully updated leaderboard from ${data.source} with ${data.leaderboard.length} players`);
      } else {
        // All sources failed, try to get data from cache regardless of age
        const lastResortCache = getFromCache(LEADERBOARD_CACHE_KEY, 0); // 0 = ignore expiration
        
        if (lastResortCache.data && Array.isArray(lastResortCache.data) && lastResortCache.data.length > 0) {
          console.log(`All sources failed. Using expired cache as last resort (${Math.round(lastResortCache.age / 60000)}m old)`);
          
          const cachedData = {
            leaderboard: lastResortCache.data,
            lastUpdated: new Date(lastResortCache.timestamp).toISOString(),
            source: "cached-data" as DataSource,
            year: localStorage.getItem('leaderboardYear') || new Date().getFullYear().toString()
          };
          
          updateLeaderboardData(cachedData);
          setError("All data sources are currently unavailable. Using cached data.");
          
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
          // No cache, no data from any source
          setError("Unable to fetch tournament data from any source. Please try again later.");
          console.error("All data sources failed and no cache available");
        }
      }
    } catch (error) {
      console.error("Error in fetchLeaderboardData:", error);
      setError("Failed to load leaderboard data. Please try again later.");
      
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
    updateLeaderboardData
  ]);

  // Initialize data fetching
  useEffect(() => {
    fetchLeaderboardData();
    
    // Set up periodic polling (every 30 seconds during tournament)
    const pollingInterval = setInterval(() => {
      fetchLeaderboardData();
    }, 30000);
    
    return () => {
      clearInterval(pollingInterval);
      if (retryTimer) clearTimeout(retryTimer);
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
    hasLiveData
  };
}
