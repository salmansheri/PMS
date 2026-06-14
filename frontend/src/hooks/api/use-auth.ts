"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getAuthMeOptions,
  getAuthMeQueryKey,
  postAuthLoginMutation,
  postAuthLogoutMutation,
  postAuthRegisterMutation,
} from "@/client/@tanstack/react-query.gen";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postAuthLoginMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      toast.success("Login Successful");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to authenticate");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    ...postAuthLogoutMutation(),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to logout");
    },
  });
}

export function useRegister() {
  return useMutation({
    ...postAuthRegisterMutation(),
    onSuccess: () => {
      toast.success("Staff node registration complete! Please log in.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration rejected");
    },
  });
}

export function useAuthMe(options?: Parameters<typeof getAuthMeOptions>[0]) {
  return useQuery(getAuthMeOptions(options));
}
