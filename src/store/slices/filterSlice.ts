import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DatePreset, ChartPeriod } from "@/lib/date-utils";
import { resolvePreset, dateToParam } from "@/lib/date-utils";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface FilterState {
  // Global date range — stored as serializable strings
  datePreset: DatePreset;
  dateFrom: string; // yyyy-MM-dd
  dateTo: string;   // yyyy-MM-dd

  // Sales chart aggregation period
  chartPeriod: ChartPeriod;

  // Orders status filter
  orderStatus: string; // "" = all
}

// ─── Initial state ──────────────────────────────────────────────────────────
const defaultPreset: DatePreset = "last7";
const defaultRange = resolvePreset(defaultPreset);

const initialState: FilterState = {
  datePreset: defaultPreset,
  dateFrom: dateToParam(defaultRange.from),
  dateTo: dateToParam(defaultRange.to),
  chartPeriod: "daily",
  orderStatus: "",
};

// ─── Slice ──────────────────────────────────────────────────────────────────
const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDatePreset(state, action: PayloadAction<DatePreset>) {
      const preset = action.payload;
      const range = resolvePreset(preset);
      state.datePreset = preset;
      state.dateFrom = dateToParam(range.from);
      state.dateTo = dateToParam(range.to);
    },

    setCustomDateRange(
      state,
      action: PayloadAction<{ from: string; to: string }>
    ) {
      state.datePreset = "custom";
      state.dateFrom = action.payload.from;
      state.dateTo = action.payload.to;
    },

    setChartPeriod(state, action: PayloadAction<ChartPeriod>) {
      state.chartPeriod = action.payload;
    },

    setOrderStatus(state, action: PayloadAction<string>) {
      state.orderStatus = action.payload;
    },

    /** Hydrate filters from URL params on initial load */
    hydrateFromParams(
      state,
      action: PayloadAction<{
        preset?: string;
        from?: string;
        to?: string;
        period?: string;
        status?: string;
      }>
    ) {
      const { preset, from, to, period, status } = action.payload;

      if (preset && preset !== "custom") {
        state.datePreset = preset as DatePreset;
        const range = resolvePreset(preset as DatePreset);
        state.dateFrom = dateToParam(range.from);
        state.dateTo = dateToParam(range.to);
      } else if (from && to) {
        state.datePreset = "custom";
        state.dateFrom = from;
        state.dateTo = to;
      }

      if (period) {
        state.chartPeriod = period as ChartPeriod;
      }

      if (status !== undefined) {
        state.orderStatus = status;
      }
    },
  },
});

export const {
  setDatePreset,
  setCustomDateRange,
  setChartPeriod,
  setOrderStatus,
  hydrateFromParams,
} = filterSlice.actions;

export default filterSlice.reducer;
