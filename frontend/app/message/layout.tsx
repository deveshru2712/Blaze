"use client";
import Loader from "@/components/Loader";
import { SocketContextProvider } from "@/context/SocketContext";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { User, isLoading, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (!isLoading && !User) {
      router.push("/sign-in");
    }
  }, [User, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!User) {
    return null; // The router will handle the redirect
  }

  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default Layout;
