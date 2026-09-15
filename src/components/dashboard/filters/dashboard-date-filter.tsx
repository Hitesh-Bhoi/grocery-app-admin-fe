"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import {
  setDatePreset,
  setCustomDateRange,
} from "@/store/slices/filterSlice";
import {
  DATE_PRESET_LABELS,
  formatDateRange,
  paramToDate,
} from "@/lib/date-utils";
import type { DatePreset } from "@/lib/date-utils";

// ─── Preset options (in display order) ──────────────────────────────────────
const PRESET_OPTIONS: DatePreset[] = [
  "today",
  "yesterday",
  "last7",
  "last30",
  "thisMonth",
  "lastMonth",
  "custom",
];

// ─── Shared tokens (matched with filter-select.tsx) ─────────────────────────
const TRIGGER_BASE = [
  "inline-flex items-center gap-2",
  "border rounded-lg",
  "text-[13px] font-medium",
  "transition-all duration-150",
  "whitespace-nowrap select-none cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40",
  // default variant
  "bg-white dark:bg-slate-900",
  "border-gray-200 dark:border-slate-700",
  "text-gray-700 dark:text-slate-300",
  "hover:bg-gray-50 dark:hover:bg-slate-800",
  "shadow-sm px-3.5 py-[7px]",
].join(" ");

const TRIGGER_OPEN = "ring-2 ring-green-500/30 border-green-400 dark:border-green-500";

export function DashboardDateFilter() {
  const dispatch = useDispatch();
  const { datePreset, dateFrom, dateTo } = useSelector(
    (s: RootState) => s.filters
  );
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateFrom);
  const [customTo, setCustomTo] = useState(dateTo);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync custom inputs when Redux changes externally
  useEffect(() => {
    setCustomFrom(dateFrom);
    setCustomTo(dateTo);
  }, [dateFrom, dateTo]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // ── Display text ──────────────────────────────────────────────────────────
  const fromDate = paramToDate(dateFrom);
  const toDate = paramToDate(dateTo);
  const displayText =
    fromDate && toDate
      ? formatDateRange(fromDate, toDate)
      : DATE_PRESET_LABELS[datePreset];

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handlePresetClick(preset: DatePreset) {
    if (preset === "custom") {
      dispatch(setDatePreset("custom"));
      return;
    }
    dispatch(setDatePreset(preset));
    setOpen(false);
  }

  function handleApplyCustom() {
    if (customFrom && customTo && customFrom <= customTo) {
      dispatch(setCustomDateRange({ from: customFrom, to: customTo }));
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Trigger — uses exact same tokens as FilterSelect ──────── */}
      <button
        id="date-range-btn"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(TRIGGER_BASE, open && TRIGGER_OPEN)}
      >
        <Calendar size={14} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
        <span className="truncate">{displayText}</span>
        <ChevronDown
          size={13}
          className={cn(
            "text-gray-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-1.5 z-50",
              "w-60 bg-white dark:bg-slate-900",
              "border border-gray-200 dark:border-slate-700",
              "rounded-xl shadow-xl overflow-hidden"
            )}
          >
            {/* Preset list */}
            <div className="p-1">
              <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                Date Range
              </p>
              {PRESET_OPTIONS.map((preset) => {
                const isActive = datePreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-[7px] rounded-lg text-[13px] transition-colors",
                      isActive
                        ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{DATE_PRESET_LABELS[preset]}</span>
                    {isActive && preset !== "custom" && (
                      <Check size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom range inputs */}
            <AnimatePresence>
              {datePreset === "custom" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-100 dark:border-slate-800 px-3 pb-3 pt-3"
                >
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={customFrom}
                        max={customTo}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={customTo}
                        min={customFrom}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    disabled={!customFrom || !customTo || customFrom > customTo}
                    className="w-full py-[7px] text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Apply Range
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
