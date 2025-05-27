"use client";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { User, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && User) {
      router.push("/message");
    }
  }, [User, isLoading, router]);

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
