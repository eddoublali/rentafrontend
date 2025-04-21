import React from "react";

export default function LoadingSpiner() {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    </>
  );
}
