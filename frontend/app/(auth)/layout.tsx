"use client";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { User, isLoading } = useAuthStore();
  if (User && !isLoading) {
    redirect("/message");
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
