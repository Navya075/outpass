import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Custom event key for same-tab triggers
export const CUSTOM_SYNC_EVENT = 'docflow_storage_updated';

export function useStorageSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handler for local updates (same window)
    const handleLocalUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    };

    // Handler for other tabs
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'docflow_db') {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      }
    };

    window.addEventListener(CUSTOM_SYNC_EVENT, handleLocalUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(CUSTOM_SYNC_EVENT, handleLocalUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [queryClient]);
}
