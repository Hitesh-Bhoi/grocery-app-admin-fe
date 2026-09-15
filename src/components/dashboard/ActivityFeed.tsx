"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  UserPlus,
  Boxes,
  Truck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import type { ActivityItem, ActivityType } from "@/types";

// ─── Activity type config ─────────────────────────────────────────────────────
const actConfig: Record<
  ActivityType,
  { Icon: React.ElementType; bg: string; color: string }
> = {
  order: { Icon: ShoppingBag, bg: "bg-green-100", color: "text-green-600" },
  product: { Icon: Package, bg: "bg-blue-100", color: "text-blue-600" },
  user: { Icon: UserPlus, bg: "bg-orange-100", color: "text-orange-600" },
  inventory: { Icon: Boxes, bg: "bg-purple-100", color: "text-purple-600" },
  delivery: { Icon: Truck, bg: "bg-teal-100", color: "text-teal-600" },
  payment: { Icon: Activity, bg: "bg-emerald-100", color: "text-emerald-600" },
  warehouse: { Icon: Boxes, bg: "bg-indigo-100", color: "text-indigo-600" },
  system: { Icon: Activity, bg: "bg-gray-100", color: "text-gray-600" },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface ActivityFeedProps {
  items?: ActivityItem[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function ActivityFeed({ items, loading, error, onRetry }: ActivityFeedProps) {
  if (loading || !items) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col animate-pulse">
        {/* Card header */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div className="h-5 w-32 bg-gray-100 rounded" />
          <div className="h-4 w-12 bg-gray-100 rounded" />
        </div>

        {/* Activity list skeleton */}
        <div className="flex-1 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
              <div className="h-3.5 w-12 bg-gray-100 rounded flex-shrink-0" />
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
      transition={{ duration: 0.45, delay: 0.52, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full flex flex-col"
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <Link
          href="/activities"
          id="view-all-activity-btn"
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Content body */}
      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <ErrorState onRetry={onRetry} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Activity}
            title="No recent activity"
            description="User actions, order updates, and inventory changes will appear here."
          />
        </div>
      ) : (
        <div className="flex-1 space-y-4">
        {items.map((item, i) => {
          const { Icon, bg, color } = actConfig[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.54 + i * 0.07, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              {/* Colored icon circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                  bg
                )}
              >
                <Icon size={15} className={color} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium leading-snug">
                  {item.title}
                </p>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                {item.timestamp}
              </span>
            </motion.div>
          );
        })}
      </div>
      )}
    </motion.div>
  );
}
