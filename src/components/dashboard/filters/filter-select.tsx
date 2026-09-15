"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  /** Optional colored dot indicator */
  dot?: string;
}

export interface FilterSelectProps<T extends string = string> {
  /** Unique ID for a11y & testing */
  id: string;
  /** Left icon in trigger */
  icon?: LucideIcon;
  /** Label shown when nothing is selected (or as fallback) */
  placeholder?: string;
  /** The list of selectable options */
  options: FilterOption<T>[];
  /** Current selected value */
  value: T;
  /** Callback on selection */
  onChange: (value: T) => void;
  /** Optional section header text inside dropdown */
  sectionLabel?: string;
  /** Width class for the dropdown panel — defaults to w-52 */
  dropdownWidth?: string;
  /** Optional: render extra content below options (e.g. custom date inputs) */
  footer?: ReactNode;
  /** Variant: "default" pill trigger or "compact" inline trigger */
  variant?: "default" | "compact";
  /** Alignment of dropdown: "left" or "right" */
  align?: "left" | "right";
}

// ─── Shared design tokens ───────────────────────────────────────────────────
const TRIGGER_BASE = [
  "inline-flex items-center gap-2",
  "border rounded-lg",
  "text-[13px] font-medium",
  "transition-all duration-150",
  "whitespace-nowrap select-none cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40",
].join(" ");

const TRIGGER_DEFAULT = [
  "bg-white dark:bg-slate-900",
  "border-gray-200 dark:border-slate-700",
  "text-gray-700 dark:text-slate-300",
  "hover:bg-gray-50 dark:hover:bg-slate-800",
  "shadow-sm px-3.5 py-[7px]",
].join(" ");

const TRIGGER_COMPACT = [
  "bg-gray-50 dark:bg-slate-800",
  "border-gray-200 dark:border-slate-700",
  "text-gray-600 dark:text-slate-300",
  "hover:bg-gray-100 dark:hover:bg-slate-700",
  "px-3 py-[5px]",
].join(" ");

const TRIGGER_OPEN = "ring-2 ring-green-500/30 border-green-400 dark:border-green-500";

// ─── Component ──────────────────────────────────────────────────────────────
export function FilterSelect<T extends string = string>({
  id,
  icon: Icon,
  placeholder = "Select",
  options,
  value,
  onChange,
  sectionLabel,
  dropdownWidth = "w-52",
  footer,
  variant = "default",
  align = "right",
}: FilterSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label || placeholder;

  function handleSelect(optionValue: T) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Trigger ────────────────────────────────────────────────── */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          TRIGGER_BASE,
          variant === "compact" ? TRIGGER_COMPACT : TRIGGER_DEFAULT,
          open && TRIGGER_OPEN
        )}
      >
        {Icon && <Icon size={14} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />}
        {selected?.dot && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: selected.dot }}
          />
        )}
        <span className="truncate max-w-[140px]">{displayLabel}</span>
        <ChevronDown
          size={13}
          className={cn(
            "text-gray-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Dropdown panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-1.5 z-50",
              align === "right" ? "right-0" : "left-0",
              dropdownWidth,
              "bg-white dark:bg-slate-900",
              "border border-gray-200 dark:border-slate-700",
              "rounded-xl shadow-xl",
              "overflow-hidden"
            )}
          >
            <div className="p-1">
              {sectionLabel && (
                <p className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  {sectionLabel}
                </p>
              )}

              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors",
                      isActive
                        ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {option.dot && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.dot }}
                      />
                    )}
                    <span className="flex-1 text-left truncate">{option.label}</span>
                    {isActive && (
                      <Check size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {footer && (
              <div className="border-t border-gray-100 dark:border-slate-800">
                {footer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
