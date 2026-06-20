"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { client } from "@/client/client.gen";

import { queryClient } from "@/lib/query-client";

// Configure the generated client once during initialization
client.setConfig({
  baseURL: "/api",
  withCredentials: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
