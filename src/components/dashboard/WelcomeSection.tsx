"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMounted } from "@/hooks/useMounted";
import { DashboardDateFilter } from "./filters";

export function WelcomeSection() {
  const user = useSelector((state: RootState) => state.auth.user);
  const mounted = useMounted();
  const displayName = (mounted && user?.name) ? user.name : "Hitesh";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      {/* Left — greeting */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          Good Morning, {displayName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-normal">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Right — date range filter */}
      <div className="self-start sm:self-auto flex-shrink-0">
        <DashboardDateFilter />
      </div>
    </motion.div>
  );
}
