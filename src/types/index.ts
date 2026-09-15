// ─── Stat Card Types ────────────────────────────────────────────────────────
export interface StatCardData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: "green" | "blue" | "purple" | "orange";
}

// ─── Chart & Filter Period Types ────────────────────────────────────────────
export type ChartPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type DatePreset =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth"
  | "custom";

export interface SalesDataPoint {
  date: string;
  revenue: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

// ─── Order Types ─────────────────────────────────────────────────────────────
export type OrderStatus = "Delivered" | "Processing" | "Pending" | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  avatar: string;
  date: string;
  amount: string;
  status: OrderStatus;
}

// ─── Activity Types ──────────────────────────────────────────────────────────
export type ActivityType = "order" | "product" | "user" | "inventory" | "delivery" | "payment" | "warehouse" | "system";

export type ActivitySeverity = "success" | "warning" | "error" | "info";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  description?: string;
  severity?: ActivitySeverity;
  entityId?: string;
  previousValue?: string;
  updatedValue?: string;
  user?: string;
  date?: string; // ISO string for sorting/filtering
}

// ─── Nav Item Types ──────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}
