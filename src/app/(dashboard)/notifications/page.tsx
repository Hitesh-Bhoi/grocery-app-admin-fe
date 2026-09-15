"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { Bell, CheckCheck, CircleAlert, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { markNotificationRead, markAllNotificationsRead, isLoading } = useNotifications();
  const notificationsState = useSelector((state: RootState) => state.notifications);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            Notifications Center
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-normal">
            View system alerts, order updates, and inventory status warnings.
          </p>
        </div>

        {notificationsState.unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-green-600 dark:bg-green-500 text-white rounded-xl font-semibold text-xs transition-colors hover:bg-green-700 dark:hover:bg-green-600 cursor-pointer shadow-sm"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden max-w-3xl">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3.5 bg-gray-100 dark:bg-slate-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notificationsState.items.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">All caught up!</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">You have no system alerts at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-850">
            {notificationsState.items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { if (!item.read) markNotificationRead(item._id); }}
                className={cn(
                  "p-5 text-left transition-colors cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-800/40 flex items-start gap-4",
                  !item.read ? "bg-green-50/20 dark:bg-green-950/10" : ""
                )}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                  <CircleAlert size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={cn("text-sm", !item.read ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300")}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 mt-2 ring-4 ring-green-100 dark:ring-green-950/40" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
