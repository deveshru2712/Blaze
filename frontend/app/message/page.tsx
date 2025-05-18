import Message from "@/components/Message";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const Page = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-20 h-[calc(100vh-5rem)]">
      <Navbar />
      <div className="flex flex-1 py-4">
        <div className="hidden md:block w-1/4 border p-4 border-slate-100/20 overflow-y-auto sticky top-20 rounded-2xl">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Message />
        </div>
      </div>
    </div>
  );
};

export default Page;
