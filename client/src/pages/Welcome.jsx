import React from "react";

function Welcome() {
  return (
    <div className=" hidden md:flex flex-col bg-white p-4  items-center justify-center text-slate-400">
      <h1 className="text-2xl">
        Welcome <span className="text-sky-500 font-semibold">Orue</span>
      </h1>
      <p className="font-light text-lg">
        Select a friend to start a conversation.
      </p>
    </div>
  );
}

export default Welcome;
