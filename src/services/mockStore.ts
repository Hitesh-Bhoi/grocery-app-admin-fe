import { mockActivities } from "@/data/activities";
import type {
  ActivityItem,
  ChartPeriod,
  Order,
  OrderStatus,
  OrderStatusData,
  SalesDataPoint,
  StatCardData,
} from "@/types";

export interface ProductItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image?: string;
}

export interface StoredOrder {
  id: string;
  customer: string;
  avatar: string;
  amount: number;
  status: OrderStatus;
  date: string; // Display date string
  createdAt: string; // ISO date string
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  avatar: string;
}

// ─── Initial Mock Data Generators ───────────────────────────────────────────

const INITIAL_PRODUCTS: ProductItem[] = [
  { _id: "prod-1", name: "Aashirvaad Superior MP Atta 5kg", category: "Atta & Flours", price: 299, stock: 120, sku: "FLR-101", status: "In Stock" },
  { _id: "prod-2", name: "Amul Pasteurised Butter 500g", category: "Dairy & Eggs", price: 275, stock: 45, sku: "DRY-102", status: "In Stock" },
  { _id: "prod-3", name: "Fortune Sunlite Refined Sunflower Oil 1L", category: "Oils & Ghee", price: 175, stock: 80, sku: "OIL-103", status: "In Stock" },
  { _id: "prod-4", name: "Surf Excel Easy Wash Detergent Powder 1kg", category: "Household Care", price: 140, stock: 150, sku: "HHC-104", status: "In Stock" },
  { _id: "prod-5", name: "Tata Salt Vacuum Evaporated 1kg", category: "Salt & Sugar", price: 28, stock: 300, sku: "SLT-105", status: "In Stock" },
  { _id: "prod-6", name: "Maggi 2-Minute Masala Noodles 12-Pack", category: "Instant Food", price: 168, stock: 8, sku: "INS-106", status: "Low Stock" },
  { _id: "prod-7", name: "Coca-Cola Original Taste 2L Bottle", category: "Beverages", price: 95, stock: 0, sku: "BEV-107", status: "Out of Stock" },
  { _id: "prod-8", name: "Dettol Liquid Handwash Refill 250ml", category: "Personal Care", price: 99, stock: 65, sku: "PER-108", status: "In Stock" },
  { _id: "prod-9", name: "India Gate Basmati Rice Classic 5kg", category: "Atta & Flours", price: 625, stock: 52, sku: "FLR-109", status: "In Stock" },
  { _id: "prod-10", name: "Epigamia Greek Yogurt Natural 400g", category: "Dairy & Eggs", price: 120, stock: 18, sku: "DRY-110", status: "In Stock" },
  { _id: "prod-11", name: "Nutella Hazelnut Spread 350g", category: "Instant Food", price: 340, stock: 6, sku: "INS-111", status: "Low Stock" },
  { _id: "prod-12", name: "Britannia Good Day Butter Cookies 600g", category: "Snacks", price: 150, stock: 95, sku: "SNK-112", status: "In Stock" },
  { _id: "prod-13", name: "Farm Fresh Washington Apples 1kg", category: "Fruits & Vegetables", price: 210, stock: 35, sku: "FNV-113", status: "In Stock" },
  { _id: "prod-14", name: "Nescafe Classic Instant Coffee 100g Jar", category: "Beverages", price: 360, stock: 40, sku: "BEV-114", status: "In Stock" },
  { _id: "prod-15", name: "Colgate Total Clean Mint Toothpaste 150g", category: "Personal Care", price: 135, stock: 85, sku: "PER-115", status: "In Stock" },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: "notif-1",
    title: "Low Stock Alert: Maggi 2-Min Noodles",
    message: "Stock has fallen below safe threshold. Only 8 units remaining in warehouse.",
    type: "warning",
    read: false,
    timestamp: "10 minutes ago",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-2",
    title: "Out of Stock: Coca-Cola 2L",
    message: "Coca-Cola 2L Bottle is completely out of stock. Please restock soon.",
    type: "error",
    read: false,
    timestamp: "1 hour ago",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-3",
    title: "Daily Sales Target Exceeded",
    message: "Today's gross order revenue passed ₹45,000 threshold!",
    type: "success",
    read: false,
    timestamp: "3 hours ago",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-4",
    title: "New Team Member Onboarded",
    message: "Priya Verma joined as Store Manager with inventory management scope.",
    type: "info",
    read: true,
    timestamp: "Yesterday",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const CUSTOMERS = [
  "Rahul Sharma", "Priya Verma", "Amit Kumar", "Neha Singh", "Vikram Patel",
  "Sanjay Gupta", "Karan Johar", "Rohan Das", "Ananya Gupta", "Aarav Patel",
  "Diya Kumar", "Aditya Desai", "Sai Reddy", "Arjun Mehta", "Riya Joshi",
  "Neha Kapoor", "Krishna Iyer", "Ishaan Nair", "Shaurya Chatterjee", "Aadhya Menon"
];

const ORDER_STATUSES: OrderStatus[] = ["Delivered", "Processing", "Pending", "Cancelled"];

function generateInitialOrders(): StoredOrder[] {
  const orders: StoredOrder[] = [];
  const now = new Date();

  // Distribution:
  // Today: 15 orders
  // Yesterday: 15 orders
  // Last 7 days: 40 orders
  // Last 30 days: 70 orders
  // Last 365 days: 120 orders
  const dayDist: number[] = [
    ...Array(15).fill(0),
    ...Array(15).fill(1),
    ...Array.from({ length: 40 }, () => Math.floor(Math.random() * 5) + 2),
    ...Array.from({ length: 70 }, () => Math.floor(Math.random() * 23) + 7),
    ...Array.from({ length: 120 }, () => Math.floor(Math.random() * 335) + 30),
  ];

  for (let i = 0; i < dayDist.length; i++) {
    const daysAgo = dayDist[i];
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    orderDate.setHours(
      Math.floor(Math.random() * 14) + 8,
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const parts = customer.split(" ");
    const avatar = (parts[0][0] + parts[1][0]).toUpperCase();

    // 80% realistic order values between 350 and 3800, 20% higher between 4000 and 15000
    const isHigh = Math.random() > 0.8;
    const amount = isHigh
      ? Math.floor(Math.random() * 11000) + 4000
      : Math.floor(Math.random() * 3450) + 350;

    // Status weighted: 60% Delivered, 20% Processing, 12% Pending, 8% Cancelled
    const r = Math.random();
    let status: OrderStatus = "Delivered";
    if (daysAgo === 0 && r < 0.4) {
      status = "Processing";
    } else if (daysAgo <= 1 && r < 0.25) {
      status = "Pending";
    } else if (r > 0.92) {
      status = "Cancelled";
    } else if (r > 0.78) {
      status = "Pending";
    } else if (r > 0.60) {
      status = "Processing";
    }

    orders.push({
      id: `ORD-${1245 - i > 0 ? 1245 - i : 10000 + i}`,
      customer,
      avatar,
      amount,
      status,
      date: orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: orderDate.toISOString(),
    });
  }

  // Sort newest first
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── LocalStorage Persistence Layer ──────────────────────────────────────────

const STORAGE_KEYS = {
  PRODUCTS: "grocery_admin_products",
  ORDERS: "grocery_admin_orders",
  NOTIFICATIONS: "grocery_admin_notifications",
  ACTIVITIES: "grocery_admin_activities",
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist ${key}:`, err);
  }
}

// ─── In-Memory Master Data ──────────────────────────────────────────────────

let inMemoryProducts: ProductItem[] | null = null;
let inMemoryOrders: StoredOrder[] | null = null;
let inMemoryNotifications: NotificationItem[] | null = null;
let inMemoryActivities: ActivityItem[] | null = null;

function getProducts(): ProductItem[] {
  if (!inMemoryProducts) {
    inMemoryProducts = getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  return inMemoryProducts;
}

function saveProducts(products: ProductItem[]): void {
  inMemoryProducts = products;
  setStored(STORAGE_KEYS.PRODUCTS, products);
}

function getOrdersList(): StoredOrder[] {
  if (!inMemoryOrders) {
    inMemoryOrders = getStored(STORAGE_KEYS.ORDERS, generateInitialOrders());
  }
  return inMemoryOrders;
}

function saveOrders(orders: StoredOrder[]): void {
  inMemoryOrders = orders;
  setStored(STORAGE_KEYS.ORDERS, orders);
}

function getNotificationsList(): NotificationItem[] {
  if (!inMemoryNotifications) {
    inMemoryNotifications = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  return inMemoryNotifications;
}

function saveNotifications(notifications: NotificationItem[]): void {
  inMemoryNotifications = notifications;
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

function getActivitiesList(): ActivityItem[] {
  if (!inMemoryActivities) {
    inMemoryActivities = getStored(STORAGE_KEYS.ACTIVITIES, mockActivities);
  }
  return inMemoryActivities;
}

function logActivity(activity: Partial<ActivityItem>): void {
  const current = getActivitiesList();
  const newActivity: ActivityItem = {
    id: `ACT-${Date.now()}`,
    type: activity.type || "system",
    title: activity.title || "Action performed",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: new Date().toISOString(),
    severity: activity.severity || "info",
    description: activity.description,
    entityId: activity.entityId,
    user: activity.user || "Current User",
  };
  inMemoryActivities = [newActivity, ...current];
  setStored(STORAGE_KEYS.ACTIVITIES, inMemoryActivities);
}

// ─── Mock Store Service ─────────────────────────────────────────────────────

export const mockStore = {
  // ── Authentication ──
  login(email: string, password: string): { user: UserProfile; token: string } {
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === "admin@grocery.com" && password === "admin123") {
      return {
        user: {
          id: "usr-admin-101",
          name: "Hitesh",
          email: "admin@grocery.com",
          role: "Admin",
          avatar: "HP",
        },
        token: `mock-token-${Date.now()}`,
      };
    }

    if (cleanEmail === "manager@grocery.com" && password === "manager123") {
      return {
        user: {
          id: "usr-mgr-102",
          name: "Priya Verma",
          email: "manager@grocery.com",
          role: "Manager",
          avatar: "PV",
        },
        token: `mock-token-${Date.now()}`,
      };
    }

    if (cleanEmail === "staff@grocery.com" && password === "staff123") {
      return {
        user: {
          id: "usr-stf-103",
          name: "Staff User",
          email: "staff@grocery.com",
          role: "Staff",
          avatar: "SU",
        },
        token: `mock-token-${Date.now()}`,
      };
    }

    throw new Error("Invalid email or password. Please use demo credentials.");
  },

  // ── Inventory / Products ──
  getInventory(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const search = (params.search || "").toLowerCase().trim();
    const status = params.status || "";
    const category = params.category || "";

    let items = [...getProducts()];

    if (search) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    if (status) {
      items = items.filter((p) => p.status === status);
    }

    if (category) {
      items = items.filter((p) => p.category === category);
    }

    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;
    const paginated = items.slice(skip, skip + limit);

    return {
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  },

  updateProduct(id: string, updates: { price?: number; stock?: number; status?: string; name?: string }) {
    const items = getProducts();
    const index = items.findIndex((p) => p._id === id);
    if (index === -1) throw new Error("Product not found");

    const current = items[index];
    let newStatus = updates.status || current.status;

    if (updates.stock !== undefined) {
      if (updates.stock === 0) newStatus = "Out of Stock";
      else if (updates.stock < 10) newStatus = "Low Stock";
      else newStatus = "In Stock";
    }

    const updated: ProductItem = {
      ...current,
      ...updates,
      status: newStatus as ProductItem["status"],
    };

    items[index] = updated;
    saveProducts([...items]);

    logActivity({
      type: "product",
      title: `Product "${updated.name}" updated`,
      description: `Stock set to ${updated.stock}, price set to ₹${updated.price}`,
      entityId: updated.sku,
      severity: updated.status === "Out of Stock" ? "error" : updated.status === "Low Stock" ? "warning" : "info",
    });

    return updated;
  },

  // ── Orders ──
  getOrders(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    from?: string;
    to?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const search = (params.search || "").toLowerCase().trim();
    const status = params.status || "";
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";

    let orders = [...getOrdersList()];

    // Date range filter
    if (params.from && params.to) {
      const fromDate = new Date(`${params.from}T00:00:00.000Z`);
      const toDate = new Date(`${params.to}T23:59:59.999Z`);
      orders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= fromDate && d <= toDate;
      });
    }

    // Search filter
    if (search) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search) ||
          o.customer.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    // Sorting
    orders.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "orderId" || sortBy === "id") {
        comparison = a.id.localeCompare(b.id);
      } else if (sortBy === "customer") {
        comparison = a.customer.localeCompare(b.customer);
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      } else {
        // Default to createdAt date
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    const total = orders.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;
    const paginated = orders.slice(skip, skip + limit).map((o) => ({
      id: o.id,
      customer: o.customer,
      avatar: o.avatar,
      date: o.date,
      amount: `₹${o.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: o.status,
    }));

    return {
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const orders = getOrdersList();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error("Order not found");

    orders[index] = {
      ...orders[index],
      status: newStatus,
    };
    saveOrders([...orders]);

    logActivity({
      type: "order",
      title: `Order #${orderId} marked as ${newStatus}`,
      description: `Customer: ${orders[index].customer}, Amount: ₹${orders[index].amount}`,
      entityId: orderId,
      severity: newStatus === "Delivered" ? "success" : newStatus === "Cancelled" ? "error" : "info",
    });

    return orders[index];
  },

  createOrder(newOrder: { customer: string; amount: number; status: OrderStatus }) {
    const orders = getOrdersList();
    const parts = newOrder.customer.split(" ");
    const avatar = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : "CU";
    const now = new Date();

    const created: StoredOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customer: newOrder.customer,
      avatar,
      amount: newOrder.amount,
      status: newOrder.status,
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now.toISOString(),
    };

    saveOrders([created, ...orders]);
    return created;
  },

  // ── Activities ──
  getActivities(limit = 10, from?: string, to?: string): ActivityItem[] {
    let list = [...getActivitiesList()];

    if (from && to) {
      const fromDate = new Date(`${from}T00:00:00.000Z`);
      const toDate = new Date(`${to}T23:59:59.999Z`);
      list = list.filter((a) => {
        if (!a.date) return true;
        const d = new Date(a.date);
        return d >= fromDate && d <= toDate;
      });
    }

    return list.slice(0, limit);
  },

  // ── Notifications ──
  getNotifications(): NotificationItem[] {
    return getNotificationsList();
  },

  markNotificationRead(id: string) {
    const items = getNotificationsList();
    const index = items.findIndex((n) => n._id === id);
    if (index !== -1) {
      items[index] = { ...items[index], read: true };
      saveNotifications([...items]);
    }
    return items;
  },

  markAllNotificationsRead() {
    const items = getNotificationsList().map((n) => ({ ...n, read: true }));
    saveNotifications(items);
    return items;
  },

  // ── Dashboard Metrics & Dynamic Analytics ──
  getDashboardMetrics(fromStr?: string, toStr?: string) {
    const now = new Date();
    let from: Date;
    let to: Date;

    if (fromStr && toStr) {
      from = new Date(`${fromStr}T00:00:00.000Z`);
      to = new Date(`${toStr}T23:59:59.999Z`);
    } else {
      to = now;
      from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
    }

    const allOrders = getOrdersList();
    const currentOrders = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to;
    });

    // Revenue from Delivered or Processing
    const totalRevenue = currentOrders
      .filter((o) => o.status === "Delivered" || o.status === "Processing")
      .reduce((sum, o) => sum + o.amount, 0);

    const totalOrders = currentOrders.length;
    const totalUsers = 856; // Mock total user count
    const totalStock = getProducts().reduce((sum, p) => sum + p.stock, 0);

    // Calculate percentage change compared to equal prior duration
    const durationMs = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - durationMs);

    const prevOrders = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= prevFrom && d <= prevTo;
    });

    const prevRevenue = prevOrders
      .filter((o) => o.status === "Delivered" || o.status === "Processing")
      .reduce((sum, o) => sum + o.amount, 0);

    const prevOrderCount = prevOrders.length;

    const revenueChange = prevRevenue > 0
      ? parseFloat((((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
      : totalRevenue > 0 ? 100 : 0;

    const ordersChange = prevOrderCount > 0
      ? parseFloat((((totalOrders - prevOrderCount) / prevOrderCount) * 100).toFixed(1))
      : totalOrders > 0 ? 100 : 0;

    const stats: StatCardData[] = [
      {
        id: "revenue",
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString("en-IN")}`,
        change: revenueChange,
        changeLabel: "vs prev. period",
        icon: "IndianRupee",
        color: "green",
      },
      {
        id: "orders",
        title: "Total Orders",
        value: totalOrders.toLocaleString("en-IN"),
        change: ordersChange,
        changeLabel: "vs prev. period",
        icon: "ShoppingCart",
        color: "blue",
      },
      {
        id: "users",
        title: "Total Users",
        value: totalUsers.toLocaleString("en-IN"),
        change: 5.4,
        changeLabel: "all time",
        icon: "Users",
        color: "purple",
      },
      {
        id: "inventory",
        title: "Total Inventory",
        value: totalStock.toLocaleString("en-IN"),
        change: -3.1,
        changeLabel: "all time",
        icon: "Package",
        color: "orange",
      },
    ];

    // Order status donut chart counts
    const statusCounts: Record<OrderStatus, number> = {
      Delivered: 0,
      Processing: 0,
      Pending: 0,
      Cancelled: 0,
    };

    currentOrders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    const colorsMap: Record<OrderStatus, string> = {
      Delivered: "#16a34a",
      Processing: "#3b82f6",
      Pending: "#f59e0b",
      Cancelled: "#a855f7",
    };

    const orderStatusData: OrderStatusData[] = ORDER_STATUSES.map((st) => ({
      name: st,
      value: statusCounts[st],
      color: colorsMap[st],
    }));

    return {
      stats,
      orderStatusData,
      salesData: [] as SalesDataPoint[],
    };
  },

  // ── Sales Chart Aggregations ──
  getSalesAnalytics(fromStr?: string, toStr?: string, period: ChartPeriod = "daily"): SalesDataPoint[] {
    const now = new Date();
    let from: Date;
    let to: Date;

    if (fromStr && toStr) {
      from = new Date(`${fromStr}T00:00:00.000Z`);
      to = new Date(`${toStr}T23:59:59.999Z`);
    } else {
      to = now;
      from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
    }

    const allOrders = getOrdersList();
    const filteredOrders = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to && (o.status === "Delivered" || o.status === "Processing");
    });

    // Helper functions for bucket keys and labels
    const getBucketKey = (d: Date): string => {
      if (period === "daily") {
        return d.toISOString().slice(0, 10);
      }
      if (period === "weekly") {
        const day = d.getUTCDay();
        const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(d);
        mon.setUTCDate(diff);
        return mon.toISOString().slice(0, 10);
      }
      if (period === "monthly") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      if (period === "quarterly") {
        const q = Math.ceil((d.getMonth() + 1) / 3);
        return `${d.getFullYear()}-Q${q}`;
      }
      return String(d.getFullYear());
    };

    const getBucketLabel = (key: string): string => {
      if (period === "daily") {
        const d = new Date(`${key}T00:00:00Z`);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      if (period === "weekly") {
        const start = new Date(`${key}T00:00:00Z`);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      }
      if (period === "monthly") {
        const [y, m] = key.split("-");
        const d = new Date(parseInt(y), parseInt(m) - 1, 1);
        return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      }
      if (period === "quarterly") {
        const [y, q] = key.split("-Q");
        return `Q${q} '${y.slice(2)}`;
      }
      return key;
    };

    // Generate full list of expected continuous bucket keys
    const bucketKeys: string[] = [];
    const seen = new Set<string>();

    const cursor = new Date(from);
    while (cursor <= to) {
      const k = getBucketKey(cursor);
      if (!seen.has(k)) {
        seen.add(k);
        bucketKeys.push(k);
      }
      if (period === "daily" || period === "weekly") {
        cursor.setDate(cursor.getDate() + 1);
      } else if (period === "monthly" || period === "quarterly") {
        cursor.setDate(cursor.getDate() + 5);
      } else {
        cursor.setFullYear(cursor.getFullYear() + 1);
      }
    }

    // Accumulate revenue
    const revenueMap = new Map<string, number>();
    filteredOrders.forEach((order) => {
      const k = getBucketKey(new Date(order.createdAt));
      revenueMap.set(k, (revenueMap.get(k) || 0) + order.amount);
    });

    return bucketKeys.map((k) => ({
      date: getBucketLabel(k),
      revenue: revenueMap.get(k) || 0,
    }));
  },
};
