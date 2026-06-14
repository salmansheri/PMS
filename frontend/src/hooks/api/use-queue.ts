"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  postQueueCheckInMutation,
  putQueueByIdCallMutation,
  putQueueByIdCompleteMutation,
} from "@/client/@tanstack/react-query.gen";

export function useIssueToken() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postQueueCheckInMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQueueDoctorByDoctorId"],
      });
      toast.success("Queue token generated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to issue token");
    },
  });
}

export function useCallNextToken() {
  const queryClient = useQueryClient();
  return useMutation({
    ...putQueueByIdCallMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQueueDoctorByDoctorId"],
      });
      toast.success("Patient called successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to call patient");
    },
  });
}

export function useCompleteToken() {
  const queryClient = useQueryClient();
  return useMutation({
    ...putQueueByIdCompleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getQueueDoctorByDoctorId"],
      });
      toast.success("Consultation completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete consultation");
    },
  });
}
