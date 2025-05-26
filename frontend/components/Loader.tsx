import React from "react";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const Loader = () => {
  return (
    <>
      <Bouncy size="45" speed="1.75" color="orange" />
    </>
  );
};

export default Loader;
