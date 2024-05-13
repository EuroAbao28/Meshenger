import React from "react";
import { LuMenu, LuSearch } from "react-icons/lu";
import userImage from "../assets/user.png";
import { DUMMY_USERS } from "../constants/dummyUser";
import { useStatesContext } from "../context/StatesContextProvider";

function FriendsList() {
  const { setIsSideMenuOpen } = useStatesContext();

  return (
    <div className="w-full md:w-[18rem] lg:w-[24rem] bg-white shadow-sm rounded-lg flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <LuMenu
          onClick={() => setIsSideMenuOpen(true)}
          className="text-2xl transition-all cursor-pointer active:scale-95"
        />
        <h1 className="mr-auto text-xl font-bold">Meshenger</h1>
        <img src={userImage} alt="image" className="w-10" />
      </div>

      {/* search bar */}
      <form className="flex items-center gap-3 px-4 py-2 mx-4 mb-4 bg-white rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300">
        <LuSearch className="text-slate-300" />
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
              key={user.username}
              className="flex items-center gap-4 p-2 hover:bg-sky-50">
              <img src={user.image} alt="user image" className="w-10" />
              <div className="flex-1">
                <h3 className="">{user.username}</h3>
                <p className="text-sm font-light">Lastest message here</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
