"use client";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { User, isLoading } = useAuthStore();
  if (User && !isLoading) {
    redirect("/message");
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
