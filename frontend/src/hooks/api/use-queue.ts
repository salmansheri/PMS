"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  checkInMutation,
  callPatientMutation,
  completeConsultationMutation,
} from "@/client/@tanstack/react-query.gen";
import type { Options } from "@/client";
import type {
  CheckInData,
  CheckInResponse,
  CallPatientData,
  CallPatientResponse,
  CompleteConsultationData,
  CompleteConsultationResponse,
} from "@/client/types.gen";

export function useIssueToken() {
  const queryClient = useQueryClient();
  return useMutation<CheckInResponse, AxiosError<any>, Options<CheckInData>>({
    ...checkInMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDoctorQueue"],
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
  return useMutation<CallPatientResponse, AxiosError<any>, Options<CallPatientData>>({
    ...callPatientMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDoctorQueue"],
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
  return useMutation<CompleteConsultationResponse, AxiosError<any>, Options<CompleteConsultationData>>({
    ...completeConsultationMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDoctorQueue"],
      });
      toast.success("Consultation completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete consultation");
    },
  });
}
