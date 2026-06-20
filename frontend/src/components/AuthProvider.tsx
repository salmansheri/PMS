"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthMe } from "@/hooks/api/use-auth";
import { useUserStore } from "@/store/user-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPage = pathname === "/login" || pathname === "/landing";

  // Run the React Query hook to get authentication state
  const { data: user, isLoading } = useAuthMe();
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useUserStore((state) => state.setLoading);

  // Sync state to the Zustand store
  useEffect(() => {
    setUser(user || null);
    setLoading(isLoading);
  }, [user, isLoading, setUser, setLoading]);

  // Route guarding logic
  useEffect(() => {
    if (!user && !isLoading && !isPublicPage) {
      router.push("/login");
    }
  }, [user, isLoading, isPublicPage, router]);

  return <>{children}</>;
}
