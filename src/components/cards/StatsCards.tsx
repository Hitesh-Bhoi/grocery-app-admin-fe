"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/types";

// ─── Color configs ────────────────────────────────────────────────────────────
const colorMap = {
  green: {
    iconWrap: "bg-green-100",
    icon: "text-green-600",
  },
  blue: {
    iconWrap: "bg-blue-100",
    icon: "text-blue-600",
  },
  purple: {
    iconWrap: "bg-purple-100",
    icon: "text-purple-600",
  },
  orange: {
    iconWrap: "bg-orange-100",
    icon: "text-orange-600",
  },
} as const;

const iconMap = {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
} as const;

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ data, index }: { data: StatCardData; index: number }) {
  const colors = colorMap[data.color];
  const Icon = iconMap[data.icon as keyof typeof iconMap];
  
  // A value is considered valid if it's not null/undefined/empty and doesn't contain NaN
  const hasValue =
    data.value !== null &&
    data.value !== undefined &&
    data.value !== "" &&
    !data.value.includes("NaN");

  const displayValue = hasValue ? data.value : "--";
  const tooltipText = hasValue ? undefined : "Data unavailable";
  const isPositive = data.change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-5 shadow-sm flex items-center gap-4 cursor-default relative group"
      title={tooltipText}
    >
      {/* Left: colored icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          colors.iconWrap
        )}
      >
        {Icon && <Icon size={22} className={colors.icon} strokeWidth={1.8} />}
      </div>

      {/* Right: text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {data.title}
        </p>
        <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight flex items-center gap-2">
          {displayValue}
          {!hasValue && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 select-none">
              N/A
            </span>
          )}
        </p>
        {/* Percentage row */}
        {hasValue && data.changeLabel && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {isPositive ? (
              <TrendingUp size={13} className="text-green-500 flex-shrink-0" />
            ) : (
              <TrendingDown size={13} className="text-red-500 flex-shrink-0" />
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                isPositive ? "text-green-600" : "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}
              {data.change}%
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">{data.changeLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Fallback Stat Cards ──────────────────────────────────────────────────────
const fallbackStats: StatCardData[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "",
    change: 0,
    changeLabel: "",
    icon: "IndianRupee",
    color: "green",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "",
    change: 0,
    changeLabel: "",
    icon: "ShoppingCart",
    color: "blue",
  },
  {
    id: "users",
    title: "Total Users",
    value: "",
    change: 0,
    changeLabel: "",
    icon: "Users",
    color: "purple",
  },
  {
    id: "inventory",
    title: "Total Inventory",
    value: "",
    change: 0,
    changeLabel: "",
    icon: "Package",
    color: "orange",
  },
];

// ─── Stats Grid ───────────────────────────────────────────────────────────────
interface StatsCardsProps {
  data?: StatCardData[];
  loading?: boolean;
  error?: boolean;
}

import { memo } from "react";

export const StatsCards = memo(function StatsCards({ data, loading, error }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-5 shadow-sm flex items-center gap-4 cursor-default animate-pulse"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-3 w-20 bg-gray-100 dark:bg-slate-800 rounded-md mb-2" />
              <div className="h-7 w-28 bg-gray-100 dark:bg-slate-800 rounded-md mb-2" />
              <div className="h-3.5 w-32 bg-gray-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayData = error || !data ? fallbackStats : data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {displayData.map((card, i) => (
        <StatCard key={card.id} data={card} index={i} />
      ))}
    </div>
  );
});
