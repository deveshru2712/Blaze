"use client";

import { useAuthStore } from "@/store/auth.Store";

export const useIsAuthenticated = () => {
  const { User } = useAuthStore();
  return !!User;
};
