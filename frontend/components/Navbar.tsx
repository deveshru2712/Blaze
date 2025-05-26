"use client";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import React from "react";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const { logOut } = useAuthStore();
  return (
    <nav className="w-full h-20 py-4 fixed top-0 bg-gradient-to-b from-black/80 to-black/50 backdrop-blur-md z-50">
      <div className="max-w-6xl px-4 mx-auto flex justify-between">
        <Link
          href={"/"}
          className="w-fit flex items-center gap-1 text-4xl font-semibold text-white/90"
        >
          <span className="w-fit hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 hover:bg-clip-text hover:text-transparent transition-colors duration-500">
            Blaze
          </span>
          <span className="text-white/90">🔥</span>
        </Link>

        <button onClick={logOut} className="cursor-pointer">
          <BiLogOut size={30} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
