"use client";

import { Suspense } from "react";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsCards } from "@/components/cards/StatsCards";
import { SalesChartDynamic, OrdersStatusChartDynamic } from "@/components/charts/ChartLoader";
import { RecentOrders } from "@/components/tables/RecentOrders";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useDashboardMetrics } from "@/hooks/useDashboard";
import { useActivities } from "@/hooks/useActivities";
import { useFilterSync } from "@/hooks/useFilterSync";

function FilterSync() {
  useFilterSync();
  return null;
}

function DashboardContent() {

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useDashboardMetrics();

  const {
    data: activities,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
    refetch: refetchActivities,
  } = useActivities(5);

  return (
    <>
      <FilterSync />
      {/* ── Greeting + Date Range Filter ── */}
      <WelcomeSection />

      {/* ── Stats Cards (4-col) ── */}
      <StatsCards
        data={analytics?.stats}
        loading={isAnalyticsLoading}
        error={isAnalyticsError}
      />

      {/* ── Charts row: 2/3 + 1/3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5" style={{ minHeight: 360 }}>
        {/* Sales Overview — 2 cols */}
        <div className="lg:col-span-2">
          <SalesChartDynamic />
        </div>

        {/* Orders by Status — 1 col */}
        <div className="lg:col-span-1">
          <OrdersStatusChartDynamic
            data={analytics?.orderStatusData || []}
            loading={isAnalyticsLoading}
            error={isAnalyticsError}
            onRetry={refetchAnalytics}
          />
        </div>
      </div>

      {/* ── Bottom row: orders table + activity feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders — 2 cols */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Recent Activity — 1 col */}
        <div className="lg:col-span-1">
          <ActivityFeed
            items={activities}
            loading={isActivitiesLoading}
            error={isActivitiesError}
            onRetry={refetchActivities}
          />
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
