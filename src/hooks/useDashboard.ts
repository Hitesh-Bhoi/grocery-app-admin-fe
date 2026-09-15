import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { mockStore } from "@/services/mockStore";
import { RootState } from "@/store";
import type { ChartPeriod } from "@/types";

export interface StatData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: "green" | "blue" | "purple" | "orange";
}

export interface SalesData {
  date: string;
  revenue: number;
}

export interface OrderStatus {
  name: string;
  value: number;
  color: string;
}

export interface DashboardAnalytics {
  stats: StatData[];
  salesData: SalesData[];
  orderStatusData: OrderStatus[];
}

/**
 * Fetches dashboard metrics (Stats and Order Status) filtered by global date range.
 * Pure frontend implementation querying the local mockStore.
 */
export function useDashboardMetrics() {
  const { dateFrom, dateTo } = useSelector(
    (s: RootState) => s.filters
  );

  return useQuery<DashboardAnalytics>({
    queryKey: ["dashboard-metrics", dateFrom, dateTo],
    queryFn: async () => {
      // Simulate micro async tick for consistent React Query lifecycles
      return mockStore.getDashboardMetrics(dateFrom, dateTo);
    },
    refetchInterval: false, // Pure frontend, no need for background HTTP polling
  });
}

/**
 * Fetches sales data, depending on both date range and aggregation period.
 */
export function useSalesAnalytics() {
  const { dateFrom, dateTo, chartPeriod } = useSelector(
    (s: RootState) => s.filters
  );

  return useQuery<SalesData[]>({
    queryKey: ["sales-analytics", dateFrom, dateTo, chartPeriod],
    queryFn: async () => {
      return mockStore.getSalesAnalytics(dateFrom, dateTo, chartPeriod as ChartPeriod);
    },
    placeholderData: keepPreviousData,
  });
}
