import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { mockStore } from "@/services/mockStore";
import { ActivityItem } from "@/types";
import { RootState } from "@/store";

/**
 * Fetches activity feed filtered by the global date range from local mockStore.
 */
export function useActivities(limit = 10) {
  const { dateFrom, dateTo } = useSelector((s: RootState) => s.filters);

  return useQuery<ActivityItem[]>({
    queryKey: ["activities", limit, dateFrom, dateTo],
    queryFn: async () => {
      return mockStore.getActivities(limit, dateFrom, dateTo);
    },
  });
}
