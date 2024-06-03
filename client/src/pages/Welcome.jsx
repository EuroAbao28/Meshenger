import React from "react";
import { useUserContext } from "../context/UserContextProvider";

function Welcome() {
  const { user } = useUserContext();

  return (
    <div className="flex-col items-center justify-center hidden p-4 bg-white md:rounded-lg md:flex text-slate-400">
      <h1 className="text-2xl">
        Welcome{" "}
        <span className="font-semibold text-sky-500">{user.username}</span>
      </h1>
      <p className="font-light text-md">
        Select a friend to start a conversation.
      </p>
    </div>
  );
}

export default Welcome;
