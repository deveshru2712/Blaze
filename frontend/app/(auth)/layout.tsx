"use client";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth.Store";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { User, isLoading } = useAuthStore();
  console.log(User);
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
