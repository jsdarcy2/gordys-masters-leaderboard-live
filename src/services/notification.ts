
import { toast } from "@/hooks/use-toast";

/**
 * Notification types for consistent styling
 */
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'loading';

/**
 * Show a toast notification with consistent styling
 */
export const notify = (
  title: string, 
  message: string, 
  type: NotificationType = 'info', 
  duration: number = 5000
) => {
  // In shadcn/ui, variant only supports 'default' | 'destructive'
  // So we map our types to those variants
  let variant: 'default' | 'destructive';
  
  if (type === 'error') {
    variant = 'destructive';
  } else {
    // All other types use the default variant
    variant = 'default';
  }
        
  toast({
    title,
    description: message,
    variant,
    duration
  });
};

/**
 * Show a notification for data refreshes
 */
export const notifyDataRefresh = (dataType: string, source: string) => {
  notify(
    `${dataType} Updated`,
    `Fresh data loaded from ${source}`,
    'success',
    3000
  );
};

/**
 * Show a notification for data errors
 */
export const notifyDataError = (dataType: string, retryFn?: () => void) => {
  toast({
    title: `${dataType} Error`,
    description: `Could not load fresh ${dataType.toLowerCase()} data. ${retryFn ? 'Trying again...' : ''}`,
    variant: 'destructive',
    duration: 5000
  });
  
  if (retryFn) {
    setTimeout(retryFn, 3000);
  }
};

/**
 * Show a notification for cached data
 */
export const notifyCachedData = (dataType: string, age: string) => {
  toast({
    title: `Using Cached ${dataType}`,
    description: `Live data unavailable. Showing data from ${age}.`,
    variant: 'default', // Using default instead of warning since warning is not supported
    duration: 7000
  });
};

/**
 * Show a notification for tournament status changes
 */
export const notifyTournamentStatus = (isActive: boolean) => {
  if (isActive) {
    toast({
      title: "Tournament In Progress",
      description: "Live data updates are now enabled. Scores will refresh automatically.",
      duration: 7000
    });
  } else {
    toast({
      title: "Tournament Not Active",
      description: "The Masters Tournament is not currently in progress. Data will update less frequently.",
      duration: 7000
    });
  }
};
