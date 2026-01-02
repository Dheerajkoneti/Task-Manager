import { create } from "zustand";

export const useAuth = create(set => ({
  token: null,
  setToken: (token: string) => set({ token }),
  logout: () => set({ token: null })
}));
