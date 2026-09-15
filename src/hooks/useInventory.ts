import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockStore, ProductItem } from "@/services/mockStore";

export type { ProductItem };

export interface InventoryResponse {
  data: ProductItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface InventoryQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  category?: string;
}

export function useInventory(params: InventoryQueryParams) {
  const queryClient = useQueryClient();

  const query = useQuery<InventoryResponse>({
    queryKey: ["inventory", params],
    queryFn: async () => {
      return mockStore.getInventory({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        category: params.category,
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, price, stock, status, name }: { id: string; price?: number; stock?: number; status?: string; name?: string }) => {
      return mockStore.updateProduct(id, { price, stock, status, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    ...query,
    updateProduct: updateProductMutation.mutate,
    isUpdatingProduct: updateProductMutation.isPending,
  };
}
