import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Page;
