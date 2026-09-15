import type {
  StatCardData,
  SalesDataPoint,
  OrderStatusData,
  Order,
  ActivityItem,
} from "@/types";

// ─── Stat Cards ──────────────────────────────────────────────────────────────
export const statCards: StatCardData[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹24,58,790",
    change: 12.5,
    changeLabel: "vs last week",
    icon: "IndianRupee",
    color: "green",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "1,245",
    change: 8.2,
    changeLabel: "vs last week",
    icon: "ShoppingCart",
    color: "blue",
  },
  {
    id: "users",
    title: "Total Users",
    value: "856",
    change: 5.4,
    changeLabel: "vs last week",
    icon: "Users",
    color: "purple",
  },
  {
    id: "inventory",
    title: "Total Inventory",
    value: "2,340",
    change: -3.1,
    changeLabel: "vs last week",
    icon: "Package",
    color: "orange",
  },
];

// ─── Sales Overview Chart Data ────────────────────────────────────────────────
export const salesData: SalesDataPoint[] = [
  { date: "May 20", revenue: 12000 },
  { date: "May 21", revenue: 28000 },
  { date: "May 22", revenue: 22000 },
  { date: "May 23", revenue: 44000 },
  { date: "May 24", revenue: 32000 },
  { date: "May 25", revenue: 30000 },
  { date: "May 26", revenue: 30500 },
];

// ─── Orders By Status Donut Chart ─────────────────────────────────────────────
export const orderStatusData: OrderStatusData[] = [
  { name: "Delivered", value: 850, color: "#16a34a" },
  { name: "Processing", value: 210, color: "#3b82f6" },
  { name: "Pending", value: 120, color: "#f59e0b" },
  { name: "Cancelled", value: 65, color: "#a855f7" },
];

// ─── Recent Orders ────────────────────────────────────────────────────────────
export const recentOrders: Order[] = [
  {
    id: "ORD-1245",
    customer: "Rahul Sharma",
    avatar: "RS",
    date: "May 26, 2024 10:30 AM",
    amount: "₹1,245.00",
    status: "Delivered",
  },
  {
    id: "ORD-1244",
    customer: "Priya Verma",
    avatar: "PV",
    date: "May 26, 2024 09:15 AM",
    amount: "₹890.50",
    status: "Processing",
  },
  {
    id: "ORD-1243",
    customer: "Amit Kumar",
    avatar: "AK",
    date: "May 26, 2024 08:45 AM",
    amount: "₹1,560.75",
    status: "Pending",
  },
  {
    id: "ORD-1242",
    customer: "Neha Singh",
    avatar: "NS",
    date: "May 25, 2024 07:30 PM",
    amount: "₹750.00",
    status: "Delivered",
  },
  {
    id: "ORD-1241",
    customer: "Vikram Patel",
    avatar: "VP",
    date: "May 25, 2024 06:20 PM",
    amount: "₹2,350.00",
    status: "Cancelled",
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────
export const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "order",
    title: 'New order #ORD-1245 received',
    timestamp: "10:30 AM",
  },
  {
    id: "act-2",
    type: "product",
    title: 'Product "Aashirvaad Atta 5kg" updated',
    timestamp: "09:45 AM",
  },
  {
    id: "act-3",
    type: "user",
    title: "New user Priya Verma registered",
    timestamp: "09:15 AM",
  },
  {
    id: "act-4",
    type: "inventory",
    title: "Inventory updated for 15 products",
    timestamp: "08:30 AM",
  },
  {
    id: "act-5",
    type: "delivery",
    title: "Order #ORD-1244 delivered",
    timestamp: "Yesterday",
  },
];
