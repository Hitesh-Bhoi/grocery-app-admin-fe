"use client";

import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
import { FilterSelect, type FilterOption } from "./filter-select";
import { RootState } from "@/store";
import { setOrderStatus } from "@/store/slices/filterSlice";

// ─── Options with color dots ────────────────────────────────────────────────
const STATUS_OPTIONS: FilterOption[] = [
  { value: "",          label: "All Statuses" },
  { value: "Delivered",  label: "Delivered",  dot: "#16a34a" },
  { value: "Processing", label: "Processing", dot: "#3b82f6" },
  { value: "Pending",    label: "Pending",    dot: "#f59e0b" },
  { value: "Cancelled",  label: "Cancelled",  dot: "#a855f7" },
];

export function OrderStatusFilter() {
  const dispatch = useDispatch();
  const orderStatus = useSelector((s: RootState) => s.filters.orderStatus);

  return (
    <FilterSelect
      id="orders-status-filter"
      icon={Filter}
      options={STATUS_OPTIONS}
      value={orderStatus}
      onChange={(v) => dispatch(setOrderStatus(v))}
      sectionLabel="Order Status"
      dropdownWidth="w-48"
      variant="compact"
      align="right"
    />
  );
}
