"use client";

import { useDispatch, useSelector } from "react-redux";
import { BarChart3 } from "lucide-react";
import { FilterSelect, type FilterOption } from "./filter-select";
import { RootState } from "@/store";
import { setChartPeriod } from "@/store/slices/filterSlice";
import type { ChartPeriod } from "@/lib/date-utils";

// ─── Options ────────────────────────────────────────────────────────────────
const PERIOD_OPTIONS: FilterOption<ChartPeriod>[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export function ChartPeriodFilter() {
  const dispatch = useDispatch();
  const chartPeriod = useSelector((s: RootState) => s.filters.chartPeriod);

  return (
    <FilterSelect<ChartPeriod>
      id="chart-period-filter"
      icon={BarChart3}
      options={PERIOD_OPTIONS}
      value={chartPeriod}
      onChange={(v) => dispatch(setChartPeriod(v))}
      sectionLabel="Aggregation"
      dropdownWidth="w-44"
      variant="compact"
      align="right"
    />
  );
}
