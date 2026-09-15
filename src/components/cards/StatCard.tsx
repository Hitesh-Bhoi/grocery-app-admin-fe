"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/types";

const iconMap = {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
};

const colorConfig = {
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "bg-green-50 text-green-700",
    ring: "ring-green-100",
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
    ring: "ring-blue-100",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "bg-purple-50 text-purple-700",
    ring: "ring-purple-100",
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "bg-orange-50 text-orange-700",
    ring: "ring-orange-100",
  },
};

interface StatCardProps {
  data: StatCardData;
  index: number;
}

export function StatCard({ data, index }: StatCardProps) {
  const colors = colorConfig[data.color];
  const Icon = iconMap[data.icon as keyof typeof iconMap];
  const isPositive = data.change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-default shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{data.title}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.iconBg)}>
          {Icon && <Icon size={18} className={colors.iconColor} />}
        </div>
      </div>

      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        {data.value}
      </p>

      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp size={14} className="text-green-500 flex-shrink-0" />
        ) : (
          <TrendingDown size={14} className="text-red-500 flex-shrink-0" />
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
        <span className="text-xs text-slate-400 dark:text-slate-500">{data.changeLabel}</span>
      </div>
    </motion.div>
  );
}
