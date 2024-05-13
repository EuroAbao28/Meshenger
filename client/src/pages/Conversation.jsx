import React from "react";
import { BiSolidSend } from "react-icons/bi";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import user from "../assets/user.png";

function Conversation() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col flex-1 h-full bg-slate-200 md:static md:z-0">
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white">
        <img className="w-12" src={user} alt="" />
        <p className="mr-auto">Kevin Dela Cruz</p>
      </div>
      <div className="flex-1">convos</div>

      {/* chat input */}
      <form className="flex items-center gap-4 p-4 bg-white">
        <div className="">
          <BsFillEmojiSmileFill />
        </div>
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 p-4 py-2 rounded-full outline outline-1 outline-slate-300 focus-within:outline-2 focus-within:outline-sky-300"
        />
        <div className="flex items-center justify-center h-full p-2 text-white rounded-full cursor-pointer bg-sky-500 aspect-square">
          <BiSolidSend />
        </div>
      </form>
    </div>
  );
}

export default Conversation;
