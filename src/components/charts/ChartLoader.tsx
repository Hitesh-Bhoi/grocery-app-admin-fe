"use client";

import dynamic from "next/dynamic";
import type { SalesDataPoint } from "@/types";
import type { OrderStatusData } from "@/types";

// Skeleton used while charts load
function ChartSkeleton({ height = 360 }: { height?: number }) {
  return (
    <div
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex items-center justify-center"
      style={{ height }}
    >
      <div className="w-7 h-7 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Dynamic imports — avoids Recharts SSR dimension issues
export const SalesChartDynamic = dynamic(
  () => import("./SalesChart").then((m) => m.SalesChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={360} />,
  }
) as React.ComponentType;

export const OrdersStatusChartDynamic = dynamic(
  () => import("./OrdersStatusChart").then((m) => m.OrdersStatusChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={360} />,
  }
) as React.ComponentType<{ data: OrderStatusData[]; loading?: boolean; error?: boolean; onRetry?: () => void }>;
