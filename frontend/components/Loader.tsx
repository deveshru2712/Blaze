import React from "react";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Bouncy size="45" speed="1.75" color="orange" />
    </div>
  );
};

export default Loader;
