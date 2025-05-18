import { useIsAuthenticated } from "@/lib/auth.utils";
import { redirect } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useIsAuthenticated;
  if (!isAuth) redirect("/sign-in");
  else {
    return <>{children}</>;
  }
};

export default Layout;
