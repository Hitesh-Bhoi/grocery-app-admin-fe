import { ActivityItem, ActivityType, ActivitySeverity } from "@/types";

const generateActivities = (): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  const types: ActivityType[] = ["order", "product", "user", "inventory", "delivery", "payment", "warehouse", "system"];
  const severities: ActivitySeverity[] = ["success", "warning", "error", "info"];
  
  const now = new Date();
  
  for (let i = 1; i <= 250; i++) {
    const date = new Date(now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    let title = "";
    let description = "";
    let entityId = `ENT-${1000 + i}`;
    
    switch (type) {
      case "order":
        title = `Order #${1000 + i} ${severity === "success" ? "placed" : severity === "warning" ? "delayed" : "failed"}`;
        description = `Customer John Doe updated order status.`;
        break;
      case "product":
        title = `Product "${Math.random().toString(36).substring(7)}" updated`;
        description = `Price changed from $10 to $12.`;
        break;
      case "user":
        title = `New user registration: user${i}@example.com`;
        description = `User signed up via email.`;
        break;
      case "inventory":
        title = `Inventory alert for SKU-${2000 + i}`;
        description = severity === "error" ? "Out of stock" : "Low stock warning.";
        break;
      case "payment":
        title = `Payment ${severity === "success" ? "successful" : "failed"} for Order #${1000 + i}`;
        description = `Processed via Stripe.`;
        break;
      case "warehouse":
        title = `Stock transfer to Warehouse B`;
        description = `Moved 50 units of SKU-${2000 + i}.`;
        break;
      case "system":
        title = `System backup ${severity === "success" ? "completed" : "failed"}`;
        description = `Automated nightly backup.`;
        break;
      case "delivery":
        title = `Delivery for Order #${1000 + i} ${severity === "success" ? "completed" : "delayed"}`;
        description = `Driver reported status update.`;
        break;
    }

    activities.push({
      id: `ACT-${10000 + i}`,
      type,
      title,
      timestamp: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toISOString(),
      description,
      severity,
      entityId,
      user: type === "system" ? "System" : `Admin User ${Math.floor(Math.random() * 5) + 1}`,
      previousValue: type === "product" ? "$10.00" : undefined,
      updatedValue: type === "product" ? "$12.00" : undefined,
    });
  }
  
  return activities.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
};

export const mockActivities = generateActivities();
