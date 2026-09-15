"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  Delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 ring-1 ring-green-200",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  Pending: {
    label: "Pending",
    className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  },
};

// Avatar colors for customers
const avatarColors: Record<string, string> = {
  RS: "bg-blue-500",
  PV: "bg-purple-500",
  AK: "bg-orange-500",
  NS: "bg-pink-500",
  VP: "bg-teal-500",
};

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
        <button
          id="view-all-orders-btn"
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View All Orders
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Order ID
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                Date
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Amount
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {orders.map((order, i) => {
              const status = statusConfig[order.status];
              const avatarBg = avatarColors[order.avatar] || "bg-slate-500";

              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-green-600">
                      #{order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                          avatarBg
                        )}
                      >
                        <span className="text-white text-[10px] font-bold">
                          {order.avatar}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {order.customer}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      {order.date}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {order.amount}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5">
                    <button
                      id={`order-action-${order.id}`}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={`Actions for ${order.id}`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
