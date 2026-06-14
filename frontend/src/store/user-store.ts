import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { UserResponse } from "@/client/types.gen";

export type User = UserResponse;

export interface UserState {
  user: User | null;
  loading: boolean;
}

export interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export type UserStore = UserState & UserActions;

/**
 * Zustand store for operator authentication and session management.
 * Follows the separated state and actions pattern, utilizing subscribeWithSelector.
 * Serves as the global client-side cache for the logged-in user state.
 */
export const useUserStore = create<UserStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
  })),
);
