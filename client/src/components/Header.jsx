import React from "react";
import { LuMenu } from "react-icons/lu";
import user from "../assets/user.png";
import { useStatesContext } from "../context/StatesContextProvider";
import { LuSearch } from "react-icons/lu";

function Header() {
  const { setIsSideMenuOpen } = useStatesContext();

  return (
    <>
      <div className="flex items-center justify-between p-4 ">
        <LuMenu
          onClick={() => setIsSideMenuOpen(true)}
          className="mr-2 text-2xl cursor-pointer text-slate-700 sm:hidden"
        />
        <h1 className="mr-auto text-2xl font-bold md:mr-0 ">Chats</h1>

        {/* search bar */}
        <div className="items-center hidden m-auto rounded-full md:w-1/2 lg:w-2/5 md:flex outline outline-1 outline-slate-300 focus-within:outline-2 focus-within:outline-sky-300">
          <LuSearch className="ml-4 text-xl text-slate-500" />
          <input
            type="text"
            placeholder="Search a user"
            className="w-full px-4 py-2 outline-none"
          />
        </div>

        <img className="w-10" src={user} alt="" />
      </div>
    </>
  );
}

export default Header;
