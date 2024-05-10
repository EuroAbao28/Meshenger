import React from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { LuSearch } from "react-icons/lu";

function Layout() {
  return (
    <div className="relative flex h-svh text-slate-700">
      <SideMenu />

      {/* container for flex-1 */}
      <div className="flex-1 ">
        <Header />

        {/* search bar */}
        <div className="flex items-center m-4 rounded-full md:hidden outline outline-1 outline-slate-300 focus-within:outline-2 focus-within:outline-sky-300">
          <LuSearch className="ml-4 text-xl text-slate-500" />
          <input
            type="text"
            placeholder="Search a user"
            className="w-full px-4 py-2 outline-none"
          />
        </div>

        {/* flex container */}
        <div className="flex justify-between p-4">
          <div>friends list</div>
          <div>chats</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
