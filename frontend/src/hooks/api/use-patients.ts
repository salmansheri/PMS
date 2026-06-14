"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPatientsSearchOptions,
  postPatientsMutation,
} from "@/client/@tanstack/react-query.gen";

export function useRegisterPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    ...postPatientsMutation(),
    onSuccess: () => {
      // Invalidate both empty parameters query key and specific search keys by prefix
      queryClient.invalidateQueries({
        queryKey: ["getPatientsSearch"],
      });
      toast.success("Patient registered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register patient");
    },
  });
}

export function useSearchPatients(
  options: Parameters<typeof getPatientsSearchOptions>[0],
) {
  return useQuery(getPatientsSearchOptions(options));
}
