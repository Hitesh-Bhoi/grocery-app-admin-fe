"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Search, Download, ChevronLeft, ChevronRight, Package, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";
import { RootState } from "@/store";
import { OrderStatusFilter } from "@/components/dashboard/filters";
import { setOrderStatus, setDatePreset } from "@/store/slices/filterSlice";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import type { OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  Delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/50",
  },
  Pending: {
    label: "Pending",
    className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-900/50",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:ring-purple-900/50",
  },
};

const avatarColors: Record<string, string> = {
  RS: "bg-blue-500",
  PV: "bg-purple-500",
  AK: "bg-orange-500",
  NS: "bg-pink-500",
  VP: "bg-teal-500",
};

export function RecentOrders({ orders: initialOrders, limit = 5 }: { orders?: any[]; limit?: number }) {
  const dispatch = useDispatch();
  const { orderStatus, dateFrom, dateTo } = useSelector((s: RootState) => s.filters);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Synchronously reset pagination when global filters change to avoid double fetches
  const [prevFilters, setPrevFilters] = useState({ orderStatus, dateFrom, dateTo });
  
  if (
    orderStatus !== prevFilters.orderStatus ||
    dateFrom !== prevFilters.dateFrom ||
    dateTo !== prevFilters.dateTo
  ) {
    setPage(1);
    setPrevFilters({ orderStatus, dateFrom, dateTo });
  }

  const { data, isLoading, isFetching, isError, refetch, updateStatus } = useOrders({
    page,
    limit,
    search,
    status: orderStatus,
    sortBy,
    sortOrder
  });

  const ordersList = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit, pages: 1 };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!ordersList.length) return;
    
    const headers = ["Order ID", "Customer", "Date", "Amount", "Status"];
    const csvRows = [
      headers.join(","),
      ...ordersList.map(order => 
        `"${order.id}","${order.customer}","${order.date}","${order.amount.replace("₹", "")}","${order.status}"`
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    updateStatus({ orderId, status: newStatus });
    setActiveMenuId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.44, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full"
    >
      {/* Card header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        
        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID/Customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-1.5 w-48 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Status filter — standardized component synced with Redux */}
          <OrderStatusFilter />

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto flex-1 relative min-h-[300px] flex flex-col">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col divide-y divide-gray-100 dark:divide-slate-800 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex px-6 py-4.5 items-center justify-between">
                <div className="h-4 w-16 bg-gray-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-28 bg-gray-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-24 bg-gray-100 dark:bg-slate-800 rounded hidden md:block" />
                <div className="h-4 w-16 bg-gray-100 dark:bg-slate-800 rounded" />
                <div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-6 bg-gray-100 dark:bg-slate-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <ErrorState onRetry={refetch} />
          </div>
        ) : ordersList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={Package}
              title="No orders found"
              description="No orders match the selected filters."
              action={
                <div className="flex items-center gap-2">
                  {(search || orderStatus) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        dispatch(setOrderStatus(""));
                        setPage(1);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setDatePreset("last7"));
                      setPage(1);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Reset Date Range
                  </button>
                </div>
              }
            />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <th
                  onClick={() => handleSort("orderId")}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white"
                >
                  Order ID {sortBy === "orderId" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("customer")}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white"
                >
                  Customer {sortBy === "customer" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white hidden md:table-cell"
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white"
                >
                  Amount {sortBy === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white"
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={cn("transition-opacity duration-300", isFetching && !isLoading ? "opacity-50 pointer-events-none" : "opacity-100")}>
              {ordersList.map((order, i) => {
                  const status = statusConfig[order.status];
                  const bg = avatarColors[order.avatar] || "bg-gray-500";
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-3.5 text-nowrap">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          #{order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-3.5 text-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                              bg
                            )}
                          >
                            <span className="text-white text-[10px] font-bold leading-none">
                              {order.avatar}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
                            {order.customer}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-3.5 hidden md:table-cell text-nowrap">
                        <span className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                          {order.date}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-3.5 text-nowrap">
                        <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                          {order.amount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5 text-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Action dropdown toggle */}
                      <td className="px-6 py-3.5 text-center relative">
                        <DropdownMenu.Root
                          open={activeMenuId === order.id}
                          onOpenChange={(open) => setActiveMenuId(open ? order.id : null)}
                        >
                          <DropdownMenu.Trigger asChild>
                            <button
                              id={`order-action-${order.id}`}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors mx-auto outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </DropdownMenu.Trigger>

                          <AnimatePresence>
                            {activeMenuId === order.id && (
                              <DropdownMenu.Portal forceMount>
                                <DropdownMenu.Content
                                  asChild
                                  sideOffset={8}
                                  align="end"
                                  className="z-[100]"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="min-w-[160px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden text-left"
                                  >
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-50 dark:border-slate-700/60">
                                      Change Status
                                    </div>
                                    <div className="p-1">
                                      {["Pending", "Processing", "Delivered", "Cancelled"].map((st) => (
                                        <DropdownMenu.Item
                                          key={st}
                                          asChild
                                          onSelect={() => handleUpdateStatus(order.id, st)}
                                        >
                                          <button
                                            className={cn(
                                              "w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors outline-none cursor-pointer focus:bg-gray-50 dark:focus:bg-slate-700",
                                              order.status === st 
                                                ? "text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20" 
                                                : "text-gray-700 dark:text-slate-300"
                                            )}
                                          >
                                            <span>Mark as {st}</span>
                                            {order.status === st && <Check size={14} className="opacity-70" />}
                                          </button>
                                        </DropdownMenu.Item>
                                      ))}
                                    </div>
                                  </motion.div>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            )}
                          </AnimatePresence>
                        </DropdownMenu.Root>
                      </td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls footer */}
      <div className="px-6 py-4.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between flex-shrink-0 text-xs">
        <div className="text-gray-500 dark:text-slate-400">
          Showing <span className="font-semibold text-gray-800 dark:text-slate-200">{Math.min((page - 1) * limit + 1, pagination.total)}</span> to{" "}
          <span className="font-semibold text-gray-800 dark:text-slate-200">{Math.min(page * limit, pagination.total)}</span> of{" "}
          <span className="font-semibold text-gray-800 dark:text-slate-200">{pagination.total}</span> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="text-gray-600 dark:text-gray-400 px-1 font-medium">
            Page {page} of {pagination.pages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="p-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
