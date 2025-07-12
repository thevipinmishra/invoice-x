import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const authStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth",
    }
  )
);

export const useAuthStore = () => {
  const token = authStore((state) => state.token);
  const setToken = authStore((state) => state.setToken);
  const clearToken = authStore((state) => state.clearToken);

  return {
    token,
    setToken,
    clearToken,
  };
};

useAuthStore.getState = authStore.getState;
useAuthStore.setState = authStore.setState;

export const isAuthenticated = (): boolean => {
  const { token } = authStore.getState();
  return !!token;
};

export const getAuthToken = (): string | null => {
  const { token } = authStore.getState();
  return token;
};

export const removeAuthToken = (): void => {
  authStore.getState().clearToken();
};

export const validateAndClearInvalidToken = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    if (token.length < 10) {
      authStore.getState().clearToken();
      return false;
    }
    return true;
  } catch {
    authStore.getState().clearToken();
    return false;
  }
};
