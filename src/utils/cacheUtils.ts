
/**
 * Utility functions for managing cached data with timestamps and expiration
 */

// Default cache expiration in milliseconds (5 minutes)
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

// Cache item interface with timestamp
interface CacheItem<T> {
  data: T;
  timestamp: number;
  source: string;
}

/**
 * Save data to cache with timestamp
 */
export const saveToCache = <T>(key: string, data: T, source: string = "api"): void => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      source
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
    console.log(`Cached ${key} data from ${source} at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error(`Error saving to cache: ${error}`);
  }
};

/**
 * Get data from cache with optional expiration check
 * Returns null if cache is expired or not found
 */
export const getFromCache = <T>(
  key: string, 
  maxAge: number = DEFAULT_CACHE_EXPIRATION
): { data: T | null; timestamp: number; age: number; source: string } => {
  try {
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return { data: null, timestamp: 0, age: Infinity, source: "none" };
    }
    
    const cacheItem: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();
    const age = now - cacheItem.timestamp;
    
    // If maxAge is 0, return cache regardless of age
    if (maxAge > 0 && age > maxAge) {
      console.log(`Cache for ${key} is expired (${Math.round(age / 1000)}s old)`);
      return { 
        data: null, 
        timestamp: cacheItem.timestamp, 
        age, 
        source: cacheItem.source 
      };
    }
    
    console.log(`Using cached ${key} from ${cacheItem.source} (${Math.round(age / 1000)}s old)`);
    return { 
      data: cacheItem.data, 
      timestamp: cacheItem.timestamp, 
      age, 
      source: cacheItem.source 
    };
  } catch (error) {
    console.error(`Error reading from cache: ${error}`);
    return { data: null, timestamp: 0, age: Infinity, source: "error" };
  }
};

/**
 * Format time elapsed since last update in human-readable form
 */
export const formatCacheAge = (timestamp: number): string => {
  if (!timestamp) return "Unknown";
  
  const now = Date.now();
  const diffMs = now - timestamp;
  
  // Less than 1 minute
  if (diffMs < 60000) {
    return "Just now";
  }
  
  // Less than 1 hour
  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // More than 1 hour
  const hours = Math.floor(diffMs / 3600000);
  return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
};
