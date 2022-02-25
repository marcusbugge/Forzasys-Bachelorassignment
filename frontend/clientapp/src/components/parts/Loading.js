import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div>
      <ReactLoading
        className="loading"
        type={"bars"}
        color={"var(--primary)"}
        height={70}
        width={70}
      />
    </div>
  );
}
