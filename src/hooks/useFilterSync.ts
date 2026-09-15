"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RootState } from "@/store";
import {
  setDatePreset,
  setCustomDateRange,
  setChartPeriod,
  setOrderStatus,
} from "@/store/slices/filterSlice";
import type { DatePreset, ChartPeriod } from "@/lib/date-utils";

const VALID_PRESETS = new Set<string>([
  "today", "yesterday", "last7", "last30", "thisMonth", "lastMonth", "custom",
]);

const VALID_PERIODS = new Set<string>([
  "daily", "weekly", "monthly", "quarterly", "yearly",
]);

/**
 * Two-way sync between Redux filter state and URL search params.
 * Reads URL on mount to hydrate, then pushes Redux changes → URL.
 */
export function useFilterSync() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { datePreset, dateFrom, dateTo, chartPeriod, orderStatus } = useSelector(
    (s: RootState) => s.filters
  );

  const hydrated = useRef(false);

  // ── 1. On mount: read URL → Redux ────────────────────────────────────────
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const urlPreset = searchParams.get("preset");
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    const urlPeriod = searchParams.get("period");
    const urlStatus = searchParams.get("status");

    if (urlPreset && VALID_PRESETS.has(urlPreset) && urlPreset !== "custom") {
      dispatch(setDatePreset(urlPreset as DatePreset));
    } else if (urlFrom && urlTo) {
      dispatch(setCustomDateRange({ from: urlFrom, to: urlTo }));
    }

    if (urlPeriod && VALID_PERIODS.has(urlPeriod)) {
      dispatch(setChartPeriod(urlPeriod as ChartPeriod));
    }

    if (urlStatus !== null) {
      dispatch(setOrderStatus(urlStatus));
    }
  }, [searchParams, dispatch]);

  // ── 2. Redux changes → URL (shallow push) ────────────────────────────────
  const prevRef = useRef({ datePreset, dateFrom, dateTo, chartPeriod, orderStatus });

  useEffect(() => {
    const prev = prevRef.current;
    if (
      !hydrated.current ||
      (prev.datePreset === datePreset &&
        prev.dateFrom === dateFrom &&
        prev.dateTo === dateTo &&
        prev.chartPeriod === chartPeriod &&
        prev.orderStatus === orderStatus)
    ) {
      prevRef.current = { datePreset, dateFrom, dateTo, chartPeriod, orderStatus };
      return;
    }
    prevRef.current = { datePreset, dateFrom, dateTo, chartPeriod, orderStatus };

    const params = new URLSearchParams();

    if (datePreset !== "custom") {
      params.set("preset", datePreset);
    } else {
      params.set("preset", "custom");
      params.set("from", dateFrom);
      params.set("to", dateTo);
    }

    if (chartPeriod !== "daily") {
      params.set("period", chartPeriod);
    }

    if (orderStatus) {
      params.set("status", orderStatus);
    }

    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [datePreset, dateFrom, dateTo, chartPeriod, orderStatus, pathname, router]);

  return { datePreset, dateFrom, dateTo, chartPeriod, orderStatus };
}
