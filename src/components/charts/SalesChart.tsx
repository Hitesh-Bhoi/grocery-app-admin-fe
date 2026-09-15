"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch } from "react-redux";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPeriodFilter } from "@/components/dashboard/filters";
import { setDatePreset } from "@/store/slices/filterSlice";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { useSalesAnalytics } from "@/hooks/useDashboard";
import type { SalesDataPoint } from "@/types";

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const val = Number(payload[0]?.value ?? 0);
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">₹{val.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
}

// ─── Dynamic Y-axis tick calculator ──────────────────────────────────────────
function computeYTicks(data: SalesDataPoint[]): number[] {
  if (!data.length) return [0];
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  if (maxRevenue === 0) return [0];

  // Round up to a nice ceiling
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxRevenue)));
  const ceil = Math.ceil(maxRevenue / magnitude) * magnitude;
  const step = ceil / 5;
  return Array.from({ length: 6 }, (_, i) => Math.round(i * step));
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SalesChart() {
  const dispatch = useDispatch();
  const { data: salesData, isLoading: loading, isFetching, isError: error, refetch: onRetry } = useSalesAnalytics();
  
  const data = salesData || [];
  const yTicks = useMemo(() => computeYTicks(data), [data]);

  const hasNoSales = !data || data.length === 0 || data.every((d) => d.revenue === 0);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col animate-pulse">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="h-5 w-32 bg-gray-100 dark:bg-slate-800 rounded" />
          <div className="h-7 w-24 bg-gray-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col"
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Sales Overview
          </h2>
          {isFetching && !loading && (
            <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <ChartPeriodFilter />
      </div>

      {/* Chart container */}
      <div 
        className={cn(
          "flex-1 min-h-[240px] flex flex-col justify-center transition-opacity duration-300",
          isFetching && !loading ? "opacity-50" : "opacity-100"
        )} 
        style={{ height: 240 }}
      >
        {error ? (
          <ErrorState onRetry={onRetry} />
        ) : hasNoSales ? (
          <EmptyState
            icon={BarChart3}
            title="No sales data available"
            description="There are no sales recorded for the selected date range. Try changing the filters or come back later."
            action={
              <button
                type="button"
                onClick={() => dispatch(setDatePreset("last7"))}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset Date Range
              </button>
            }
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v)
                }
                ticks={yTicks}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#16a34a",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={{
                  r: 4,
                  fill: "#16a34a",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#16a34a",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
