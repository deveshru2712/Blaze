import React from "react";

interface MessageSkeletonProps {
  isMine: boolean;
}

const MessageSkeleton = ({ isMine }: MessageSkeletonProps) => {
  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      } w-full px-2 py-1`}
    >
      <div
        className={`${
          isMine ? "bg-slate-700/80" : "bg-slate-900/80"
        } w-2/5 h-fit px-3 py-2 rounded-3xl`}
      >
        hii
      </div>
    </div>
  );
};

export default MessageSkeleton;
