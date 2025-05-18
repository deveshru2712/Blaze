"use client";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FiSend } from "react-icons/fi";
import MessageSkeleton from "./MessageSkeleton";

const Message = () => {
  return (
    <div className="flex flex-col gap-3 px-4 pt-3 h-full">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-700 cursor-pointer">
        <div className="relative h-9 w-9 flex-shrink-0">
          <Image
            src="/avatar.png"
            alt="profile image"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">Username</h1>
          <p className="text-xs text-slate-400">Online</p>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between">
        {/* messages */}
        <div>
          <MessageSkeleton isMine={true} />
          <MessageSkeleton isMine={false} />
        </div>
        {/* send message */}
        <div className="">
          <form className="flex items-center gap-1">
            <Input type="text" placeholder="Message..." />
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:cursor-pointer active:scale-110 duration-500 transition-all  "
            >
              <FiSend />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;
