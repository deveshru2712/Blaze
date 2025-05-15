import React from "react";

const HeroSection = () => {
  return (
    <div className="mt-16">
      <div className="flex flex-1 min-h-screen justify-center items-center">
        <div className="flex flex-col w-1/2 gap-5 justify-center items-start px-20 py-4">
          <h1 className="text-4xl font-bold text-wrap text-left">
            Type.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
              Send
            </span>
            🔥. Bam. <br /> Feels like talking in real life.
          </h1>
          <button className="text-2xl font-semibold px-4 py-2 rounded-2xl bg-black/80 border hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 hover:border-transparent  active:scale-110 cursor-pointer transition-all duration-500">
            Start Chatting 🔥
          </button>
        </div>
        <div className="flex w-1/2 relative">
          <div className="w-[700px] h-[550px] bg-gradient-to-r from-orange-400 to-red-400 blur-lg bg-opacity-30 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/4" />
          <div className="w-[700px] h-[550px] border rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/4 bg-white/60"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
