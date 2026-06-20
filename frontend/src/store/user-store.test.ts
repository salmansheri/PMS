// Ambient declarations for test runner globals to prevent compilation errors
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const describe: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const it: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const expect: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const beforeEach: any;

import { useUserStore } from "./user-store";

describe("User Store", () => {
  beforeEach(() => {
    useUserStore.getState().setUser(null);
    useUserStore.getState().setLoading(true);
  });

  it("should initialize with null user and true loading state", () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it("should set user correctly", () => {
    const mockUser = {
      id: "usr_123",
      username: "doctor_sato",
      role: "ROLE_DOCTOR",
      fullName: "Kenji Sato",
    };
    useUserStore.getState().setUser(mockUser);
    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
  });

  it("should set loading correctly", () => {
    useUserStore.getState().setLoading(false);
    const state = useUserStore.getState();
    expect(state.loading).toBe(false);
  });
});
