import React from "react";
import MessageBox from "./MessageBox";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <MessageBox />
      <MessageBox />
      <MessageBox />
      <MessageBox />
      <MessageBox />
    </div>
  );
};

export default Sidebar;
