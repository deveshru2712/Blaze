"use client";
import React from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <div className="my-20">
      <div className="flex flex-1 min-h-screen justify-center items-center">
        <div className="flex flex-col w-4/5 md:w-1/2 gap-5 justify-center items-center md:items-start mx-10 md:mx-20 py-4">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-wrap text-left group">
            <span className="cursor-pointer">Type. </span>
            <span className="cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
              Send <span className="text-white">🔥.</span>
            </span>
            <span className="text-wrap">
              Bam.
              <br /> Feels like talking in real life.
            </span>
          </div>
          <button
            onClick={() => router.push("/sign-up")}
            className="text-2xl font-semibold px-4 py-2 rounded-2xl bg-black/80 border hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 hover:border-red-600  active:scale-110 cursor-pointer transition-all duration-500"
          >
            Start Chatting 🔥
          </button>
        </div>
        <div className="md:flex w-1/2 relative hidden">
          <div className="w-[700px] h-[550px] bg-gradient-to-r from-orange-400 to-red-400 blur-lg bg-opacity-30 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/4" />
          <div className="w-[700px] h-[550px] border rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/4 bg-white/60"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
