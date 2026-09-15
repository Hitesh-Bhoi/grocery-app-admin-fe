"use client";
import { RecentOrders } from "@/components/tables/RecentOrders";

export default function OrdersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          Orders Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-normal">
          View, filter, search, and update customer order details.
        </p>
      </div>

      <div className="w-full">
        <RecentOrders limit={10} />
      </div>
    </>
  );
}
