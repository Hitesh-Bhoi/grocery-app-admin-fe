"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import type { OrderStatusData } from "@/types";

// ─── Component ────────────────────────────────────────────────────────────────
interface OrdersStatusChartProps {
  data: OrderStatusData[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

import { memo } from "react";

export const OrdersStatusChart = memo(function OrdersStatusChart({ data, loading, error, onRetry }: OrdersStatusChartProps) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
      const pct = total > 0 ? ((Number(payload[0]?.value ?? 0) / total) * 100).toFixed(1) : "0.0";
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0]?.name}</p>
          <p className="value">{payload[0]?.value} ({pct}%)</p>
        </div>
      );
    }
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col animate-pulse">
        <div className="h-5 w-32 bg-gray-100 rounded mb-6" />
        <div className="h-[200px] w-[200px] rounded-full border-[15px] border-gray-100 mx-auto mb-5 flex items-center justify-center">
          <div className="text-center">
            <div className="h-6 w-16 bg-gray-100 rounded mx-auto mb-1" />
            <div className="h-3 w-10 bg-gray-100 rounded mx-auto" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.36, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col"
    >
      {/* Header */}
      <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-6 flex-shrink-0">
        Orders by Status
      </h2>

      {/* Body content */}
      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <ErrorState onRetry={onRetry} />
        </div>
      ) : total === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Package}
            title="No orders found"
            description="There are no orders in the selected date range."
          />
        </div>
      ) : (
        <>
          {/* Donut chart */}
          <div className="flex-shrink-0 relative" style={{ height: 200 }}>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            onMouseMove={(state: any, e: any) => {
              if (state && state.chartX !== undefined && state.chartY !== undefined) {
                const chartWidth = e?.currentTarget?.getBoundingClientRect?.()?.width || 300;
                
                // Default offset to bottom-right of cursor
                let x = state.chartX + 10;
                let y = state.chartY + 10;
                
                // If cursor is past half the chart width, show tooltip on the left
                if (state.chartX > chartWidth / 2) {
                   x = state.chartX - 13; 
                }
                
                // If cursor is in bottom half, show tooltip above
                if (state.chartY > 20) {
                   y = state.chartY - 20; 
                }
                
                setTooltipPos({ x, y });
              }
            }}
            onMouseLeave={() => setTooltipPos(undefined)}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              position={tooltipPos}
              wrapperStyle={{ zIndex: 1000 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
            {total.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 mt-5 space-y-3">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={item.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 truncate">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                {item.value}{" "}
                <span className="text-gray-400 font-normal">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
        </>
      )}
    </motion.div>
  );
});
