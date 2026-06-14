"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuthMe, postAuthLogin, postAuthLogout } from "@/client";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = pathname === "/login" || pathname === "/landing";

  const refresh = useCallback(async () => {
    try {
      const { data } = await getAuthMe({ throwOnError: true });
      setUser(data as User);
    } catch {
      setUser(null);
      if (!isPublicPage) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [isPublicPage, router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await postAuthLogin({
        body: { username, password },
        throwOnError: true,
      });
      setUser(data as User);
      router.push("/");
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await postAuthLogout({ throwOnError: true });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refresh }}>
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
