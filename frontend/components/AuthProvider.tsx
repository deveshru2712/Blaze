"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Loader from "./Loader";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { User, isLoading, authCheck } = useAuthStore();

  const router = useRouter();

  // Auth check on mount
  useEffect(() => {
    authCheck();
  }, [authCheck]);

  // Redirect logic
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ["/sign-in", "/sign-up", "/"];
    const currentPath = window.location.pathname;

    if (!User && !publicPaths.includes(currentPath)) {
      router.push("/sign-in");
    } else if (User && publicPaths.includes(currentPath)) {
      router.push("/message");
    }
  }, [User, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
};
