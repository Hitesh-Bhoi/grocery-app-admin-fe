import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  isValid,
  parseISO,
} from "date-fns";

// ─── Date Range Preset Definitions ──────────────────────────────────────────
export type DatePreset =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateRangeWithPreset {
  preset: DatePreset;
  from: Date;
  to: Date;
}

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 Days",
  last30: "Last 30 Days",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  custom: "Custom Range",
};

// ─── Chart Period / Aggregation ─────────────────────────────────────────────
export type ChartPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export const CHART_PERIOD_LABELS: Record<ChartPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

// ─── Resolve preset to actual date range ────────────────────────────────────
export function resolvePreset(preset: DatePreset): DateRange {
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const yesterday = subDays(now, 1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    }
    case "last7":
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    case "last30":
      return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    case "thisMonth":
      return { from: startOfMonth(now), to: endOfDay(now) };
    case "lastMonth": {
      const last = subMonths(now, 1);
      return { from: startOfMonth(last), to: endOfMonth(last) };
    }
    case "custom":
      // Default to last 7 days when custom has no user selection yet
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    default:
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  }
}

// ─── Format for display ─────────────────────────────────────────────────────
export function formatDateRange(from: Date, to: Date): string {
  const fromStr = format(from, "MMM d, yyyy");
  const toStr = format(to, "MMM d, yyyy");
  if (fromStr === toStr) return fromStr;
  // Same year → omit year on first part
  if (from.getFullYear() === to.getFullYear()) {
    return `${format(from, "MMM d")} – ${toStr}`;
  }
  return `${fromStr} – ${toStr}`;
}

// ─── Serialize / deserialize for URL params ─────────────────────────────────
export function dateToParam(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function paramToDate(s: string): Date | null {
  const d = parseISO(s);
  return isValid(d) ? d : null;
}

// ─── Serialize for API query string ─────────────────────────────────────────
export function dateToISO(d: Date): string {
  return d.toISOString();
}
