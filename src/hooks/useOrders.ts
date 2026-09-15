import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { mockStore } from "@/services/mockStore";
import { RootState } from "@/store";
import type { OrderStatus } from "@/types";

export interface OrderItem {
  id: string;
  customer: string;
  avatar: string;
  date: string;
  amount: string;
  status: OrderStatus;
}

export interface OrdersResponse {
  data: OrderItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface OrdersQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Fetches orders with date-range-aware filtering from local mockStore.
 * Pulls global date range from Redux; merges with local params.
 */
export function useOrders(params: OrdersQueryParams) {
  const queryClient = useQueryClient();
  const { dateFrom, dateTo } = useSelector((s: RootState) => s.filters);

  const query = useQuery<OrdersResponse>({
    queryKey: ["orders", params, dateFrom, dateTo],
    queryFn: async () => {
      return mockStore.getOrders({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        from: dateFrom,
        to: dateTo,
      });
    },
    placeholderData: keepPreviousData,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return mockStore.updateOrderStatus(orderId, status as OrderStatus);
    },
    onSuccess: () => {
      // Invalidate both orders query, dashboard metrics, sales analytics, and activities
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["sales-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (newOrder: { customer: string; amount: number; status: string }) => {
      return mockStore.createOrder({
        customer: newOrder.customer,
        amount: newOrder.amount,
        status: newOrder.status as OrderStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["sales-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    ...query,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
}
