import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { mockStore } from "@/services/mockStore";
import {
  setNotifications,
  markAsRead as rxMarkAsRead,
  markAllAsRead as rxMarkAllAsRead,
  NotificationItem,
} from "@/store/slices/notificationSlice";

export function useNotifications() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const query = useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      return mockStore.getNotifications();
    },
  });

  // Sync to Redux store when data loads
  useEffect(() => {
    if (query.data) {
      dispatch(setNotifications(query.data));
    }
  }, [query.data, dispatch]);

  const readMutation = useMutation({
    mutationFn: async (id: string) => {
      return mockStore.markNotificationRead(id);
    },
    onSuccess: (_, id) => {
      dispatch(rxMarkAsRead(id));
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (old) => {
        if (!old) return [];
        return old.map((item) => (item._id === id ? { ...item, read: true } : item));
      });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: async () => {
      return mockStore.markAllNotificationsRead();
    },
    onSuccess: () => {
      dispatch(rxMarkAllAsRead());
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (old) => {
        if (!old) return [];
        return old.map((item) => ({ ...item, read: true }));
      });
    },
  });

  return {
    ...query,
    markNotificationRead: readMutation.mutate,
    markAllNotificationsRead: readAllMutation.mutate,
  };
}
