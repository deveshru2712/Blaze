import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full h-12 py-4 fixed top-0">
      <div className="max-w-6xl px-4 mx-auto">
        <Link
          href={"/"}
          className="w-fit flex items-center gap-1 text-4xl font-semibold text-white/90"
        >
          <span className="w-fit hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 hover:bg-clip-text hover:text-transparent transition-colors duration-500">
            Blaze
          </span>

          <span className="text-white/90">🔥</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
