"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useAuthMe, useLogin, useLogout } from "@/hooks/api/use-auth";

interface User {
  id: string;
  username: string;
  role: string;
  fullName: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = pathname === "/login" || pathname === "/landing";

  const { data: user, isLoading, refetch } = useAuthMe();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!user && !isLoading && !isPublicPage) {
      router.push("/login");
    }
  }, [user, isLoading, isPublicPage, router]);

  const login = async (username: string, password: string) => {
    try {
      await loginMutation.mutateAsync({
        body: { username, password },
      });
      router.push("/");
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
    } catch (err) {
      console.error("Logout request failed", err);
    }
  };

  const refresh = async () => {
    await refetch();
  };

  return (
    <UserContext.Provider
      value={{
        user: (user as User) || null,
        loading: isLoading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
