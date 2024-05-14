import React from "react";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import { LuArrowLeft } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useNavigate } from "react-router-dom";

function Conversation() {
  const navigate = useNavigate();
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col flex-1 h-full bg-white rounded-lg md:static">
      <div className="flex items-center gap-4 p-4 border-b-4 border-slate-100">
        <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100">
          <LuArrowLeft className="text-2xl" onClick={() => navigate("/")} />
        </div>
        <div className="flex items-center">
          <img src={userImage} alt="user image" className="w-10" />
          <h3>Astrii Claude</h3>
        </div>
      </div>
      <div className="flex-1">Convo</div>
      <div className="bg-white border-t-4 border-slate-100">
        <form className="flex items-center gap-4 p-4">
          <div className="text-2xl text-slate-500">
            <BsFillEmojiSmileFill />
          </div>
          <input
            type="text"
            placeholder="Write a mesage"
            className="flex-1 px-4 py-2 rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300"
          />
          <div className="flex items-center justify-center w-10 text-lg text-white bg-red-500 rounded-full aspect-square">
            <BiSolidSend />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Conversation;
