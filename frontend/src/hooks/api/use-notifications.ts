"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUnreadNotificationsOptions,
  getUnreadNotificationsQueryKey,
  markAllAsReadMutation,
} from "@/client/@tanstack/react-query.gen";
import { useUserStore } from "@/store";
import type { Notification } from "@/client/types.gen";

export function useNotifications() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Fetch initial unread notifications
  const query = useQuery({
    ...getUnreadNotificationsOptions(),
    enabled: !!user,
  });

  // SSE subscription effect
  useEffect(() => {
    if (!user) return;

    // Use relative path since Next.js rewrites it to the backend api
    const eventSource = new EventSource("/api/notifications/subscribe");

    eventSource.addEventListener("CONNECT", (event: MessageEvent) => {
      console.debug("SSE connected:", event.data);
    });

    eventSource.addEventListener("NOTIFICATION", (event: MessageEvent) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        
        // Show sonner toast
        toast.info(notification.message || "New notification received", {
          description: notification.channel ? `Channel: ${notification.channel}` : undefined,
        });

        // Update React Query Cache for unread notifications
        queryClient.setQueryData(
          getUnreadNotificationsQueryKey(),
          (old: Notification[] | undefined) => {
            if (!old) return [notification];
            // Prevent duplicate entries
            if (old.some((n) => n.id === notification.id)) return old;
            return [notification, ...old];
          }
        );
      } catch (err) {
        console.error("Failed to parse notification SSE data:", err);
      }
    });

    eventSource.onerror = (error) => {
      console.warn("SSE connection encountered an error, reconnecting...", error);
    };

    return () => {
      eventSource.close();
    };
  }, [user, queryClient]);

  // Mutation to mark all notifications as read
  const markAllRead = useMutation({
    ...markAllAsReadMutation(),
    onSuccess: () => {
      // Optimistically clear the unread notifications cache
      queryClient.setQueryData(getUnreadNotificationsQueryKey(), []);
      // Invalidate to keep it in sync with the database
      queryClient.invalidateQueries({
        queryKey: getUnreadNotificationsQueryKey(),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    markAllRead,
  };
}
