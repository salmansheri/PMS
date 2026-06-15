"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  searchPatientsOptions,
  registerPatientMutation,
} from "@/client/@tanstack/react-query.gen";
import type { Options } from "@/client";
import type {
  RegisterPatientData,
  RegisterPatientResponse,
} from "@/client/types.gen";

export function useRegisterPatient() {
  const queryClient = useQueryClient();
  return useMutation<RegisterPatientResponse, AxiosError<any>, Options<RegisterPatientData>>({
    ...registerPatientMutation(),
    onSuccess: () => {
      // Invalidate both empty parameters query key and specific search keys by prefix
      queryClient.invalidateQueries({
        queryKey: ["searchPatients"],
      });
      toast.success("Patient registered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register patient");
    },
  });
}

export function useSearchPatients(
  options: Parameters<typeof searchPatientsOptions>[0],
) {
  return useQuery(searchPatientsOptions(options));
}
