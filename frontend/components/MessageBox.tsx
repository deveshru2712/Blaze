import Image from "next/image";
import React from "react";

const MessageBox = () => {
  const latestMessage = "This is a sample message content";
  return (
    <div className="cursor-pointer relative w-full max-w-md mx-auto group">
      {/* border */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      <div className="p-[1px] rounded-md bg-slate-800 group-hover:bg-transparent transition-all duration-500">
        <div className="bg-black rounded-md p-3 border border-slate-700 group-hover:border-transparent transition-all duration-300">
          <div className="flex flex-row justify-between items-start gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">
                <Image
                  src={"/avatar.png"}
                  alt="profile_image"
                  height={45}
                  width={45}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-semibold text-white truncate">Username</h2>
                <span className="text-slate-300/80 truncate">
                  {latestMessage.slice(0, 25)}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 whitespace-nowrap text-slate-400 text-sm">
              11:28 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
