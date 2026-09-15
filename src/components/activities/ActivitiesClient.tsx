"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Package,
  UserPlus,
  Boxes,
  Truck,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  ArrowRight,
  Clock,
  User
} from "lucide-react";
import { mockActivities } from "@/data/activities";
import { ActivityItem, ActivityType } from "@/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/empty-state";

const actTypeConfig: Record<ActivityType, { Icon: React.ElementType; label: string }> = {
  order: { Icon: ShoppingBag, label: "Orders" },
  product: { Icon: Package, label: "Product" },
  user: { Icon: UserPlus, label: "Users" },
  inventory: { Icon: Boxes, label: "Inventory" },
  delivery: { Icon: Truck, label: "Delivery" },
  payment: { Icon: Activity, label: "Payments" },
  warehouse: { Icon: Boxes, label: "Warehouse" },
  system: { Icon: Activity, label: "System" },
};

const severityConfig = {
  success: { color: "text-green-600", bg: "bg-green-100", border: "border-green-200", Icon: CheckCircle },
  warning: { color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200", Icon: AlertTriangle },
  error: { color: "text-red-600", bg: "bg-red-100", border: "border-red-200", Icon: XCircle },
  info: { color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200", Icon: Info },
};

type DateRange = "all" | "today" | "7days" | "30days" | "custom";

export function ActivitiesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const pageSize = 15;

  const filteredData = useMemo(() => {
    let data = [...mockActivities];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter((item) =>
        item.title.toLowerCase().includes(lowerTerm) ||
        item.description?.toLowerCase().includes(lowerTerm) ||
        item.entityId?.toLowerCase().includes(lowerTerm) ||
        item.user?.toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedType !== "all") {
      data = data.filter((item) => item.type === selectedType);
    }

    if (dateRange !== "all") {
      const now = new Date();
      let startLimit = new Date();
      let endLimit = new Date();

      if (dateRange === "today") {
        startLimit.setHours(0, 0, 0, 0);
        data = data.filter((item) => new Date(item.date!) >= startLimit);
      } else if (dateRange === "7days") {
        startLimit.setDate(now.getDate() - 7);
        data = data.filter((item) => new Date(item.date!) >= startLimit);
      } else if (dateRange === "30days") {
        startLimit.setDate(now.getDate() - 30);
        data = data.filter((item) => new Date(item.date!) >= startLimit);
      } else if (dateRange === "custom") {
        if (customStartDate) {
          data = data.filter((item) => new Date(item.date!) >= new Date(customStartDate));
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          data = data.filter((item) => new Date(item.date!) <= end);
        }
      }
    }

    data.sort((a, b) => {
      const timeA = new Date(a.date!).getTime();
      const timeB = new Date(b.date!).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return data;
  }, [searchTerm, selectedType, dateRange, customStartDate, customEndDate, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, dateRange, customStartDate, customEndDate, sortOrder]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)] xl:h-[calc(100vh-128px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and audit all system and user actions.
          </p>
        </div>
      </div>

      {/* Filters & Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, name, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Activities</option>
            {Object.entries(actTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-700 dark:text-slate-200"
              />
              <span className="text-slate-500">-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-700 dark:text-slate-200"
              />
            </div>
          )}

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        {filteredData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={Activity}
              title="No activities found"
              description="Try adjusting your search or filters to see results."
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedData.map((item, index) => {
                  const TypeIcon = actTypeConfig[item.type].Icon;
                  const sev = severityConfig[item.severity || "info"];
                  const SevIcon = sev.Icon;
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group"
                      onClick={() => setSelectedActivity(item)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", sev.bg, sev.border)}>
                            <TypeIcon size={18} className={sev.color} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                              {item.title}
                              <SevIcon size={14} className={sev.color} />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-[300px]">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.entityId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <User size={14} className="text-slate-400" />
                          {item.user}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          {new Date(item.date!).toLocaleString(undefined, {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-slate-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); setSelectedActivity(item); }}
                        >
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{" "}
              <span className="font-medium text-slate-900 dark:text-white">{filteredData.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[3rem] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Details Drawer/Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedActivity(null)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Details</h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-4 mb-8">
                  {(() => {
                    const sev = severityConfig[selectedActivity.severity || "info"];
                    const TypeIcon = actTypeConfig[selectedActivity.type].Icon;
                    return (
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2", sev.bg, sev.border)}>
                        <TypeIcon size={24} className={sev.color} />
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{selectedActivity.title}</h4>
                    <span className={cn("inline-flex items-center mt-1 text-xs font-medium px-2 py-0.5 rounded-full border", severityConfig[selectedActivity.severity || "info"].bg, severityConfig[selectedActivity.severity || "info"].color, severityConfig[selectedActivity.severity || "info"].border)}>
                      {selectedActivity.severity?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h5>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      {selectedActivity.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block mb-1">Entity ID</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedActivity.entityId}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block mb-1">Date & Time</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {new Date(selectedActivity.date!).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block mb-1">Category</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                        {actTypeConfig[selectedActivity.type].label}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block mb-1">User</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        {selectedActivity.user}
                      </span>
                    </div>
                  </div>

                  {(selectedActivity.previousValue || selectedActivity.updatedValue) && (
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Changes</h5>
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        {selectedActivity.previousValue && (
                          <div className="flex-1">
                            <span className="text-xs text-slate-500 block mb-1">Previous</span>
                            <span className="text-sm font-medium text-slate-600 line-through">{selectedActivity.previousValue}</span>
                          </div>
                        )}
                        <ArrowRight size={16} className="text-slate-400" />
                        {selectedActivity.updatedValue && (
                          <div className="flex-1 text-right">
                            <span className="text-xs text-slate-500 block mb-1">Updated</span>
                            <span className="text-sm font-medium text-green-600">{selectedActivity.updatedValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <Link
                  href={
                    selectedActivity.type === "order" ? `/orders/${selectedActivity.entityId}` :
                      selectedActivity.type === "product" ? `/products/${selectedActivity.entityId}` :
                        selectedActivity.type === "user" ? `/customers/${selectedActivity.entityId}` :
                          selectedActivity.type === "payment" ? `/payments/${selectedActivity.entityId}` :
                            selectedActivity.type === "inventory" || selectedActivity.type === "warehouse" ? `/inventory/${selectedActivity.entityId}` :
                              "#"
                  }
                  className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center justify-center"
                >
                  View Related Entity Details
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
