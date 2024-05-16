import React from "react";
import { LuMenu, LuSearch } from "react-icons/lu";
import userImage from "../assets/user.png";
import { DUMMY_USERS } from "../constants/dummyUser";
import { useStatesContext } from "../context/StatesContextProvider";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function FriendsList() {
  const { setIsSideMenuOpen } = useStatesContext();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <LuMenu
          onClick={() => setIsSideMenuOpen(true)}
          className="text-2xl transition-all cursor-pointer active:scale-95"
        />
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-6 " />
          <h1 className="text-2xl font-bold ">Meshenger</h1>
        </div>
        <img src={userImage} alt="image" className="w-10" />
      </div>

      {/* search bar */}
      <form className="flex items-center gap-3 px-4 py-2 mx-4 mb-4 bg-white rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300">
        <LuSearch className="text-slate-700" />
        <input
          type="text"
          placeholder="Search a user"
          className="w-full focus:outline-none"
        />
      </form>

      {/* friends list */}
      <div className="relative flex-1">
        <div className="absolute inset-0 p-2 overflow-y-auto">
          {DUMMY_USERS.map((user) => (
            <div
              onClick={() => navigate("/999")}
              key={user.username}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100">
              <div className="relative">
                <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                <img src={user.image} alt="user image" className="w-12" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold line-clamp-1">{user.username}</h3>
                <p className="w-full text-sm font-light line-clamp-1">
                  Lastest message here Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Ut, accusantium.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
