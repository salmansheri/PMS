"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  getCurrentUserOptions,
  getCurrentUserQueryKey,
  loginMutation,
  logoutMutation,
  registerMutation,
} from "@/client/@tanstack/react-query.gen";
import type { Options } from "@/client";
import type {
  LoginData,
  LoginResponse,
  LogoutData,
  RegisterData,
  RegisterResponse,
} from "@/client/types.gen";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, AxiosError<any>, Options<LoginData>>({
    ...loginMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCurrentUserQueryKey() });
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
  return useMutation<unknown, AxiosError<any>, Options<LogoutData>>({
    ...logoutMutation(),
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
  return useMutation<RegisterResponse, AxiosError<any>, Options<RegisterData>>({
    ...registerMutation(),
    onSuccess: () => {
      toast.success("Staff node registration complete! Please log in.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration rejected");
    },
  });
}

export function useAuthMe(options?: Parameters<typeof getCurrentUserOptions>[0]) {
  return useQuery(getCurrentUserOptions(options));
}
