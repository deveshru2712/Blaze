"use client";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { User, authCheck, isLoading } = useAuthStore();
  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (!User && isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  } else if (!User && !isLoading) {
    redirect("/sign-in");
  } else {
    return <>{children}</>;
  }
};

export default Layout;
