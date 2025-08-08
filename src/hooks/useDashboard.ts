import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { dashboardApi } from '../services/api';
import { DashboardData } from '../types';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getData();
      setDashboardData(response.data.dashboard);
      setLastUpdated(new Date());
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard data';
      setError(message);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dashboardData,
    loading,
    error,
    lastUpdated,
    fetchDashboardData,
  };
};
