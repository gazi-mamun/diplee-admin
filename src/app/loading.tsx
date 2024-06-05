import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

function Loading() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center z-50 bg-white">
      <svg width="100px" height="100px" viewBox="-4 -1 38 28">
        <polygon
          fill="transparent"
          stroke="#000"
          strokeWidth="2"
          points="15,0 30,30 0,30"
        ></polygon>
      </svg>
    </div>
  );
}

export default Loading;
