import React from "react";
import FriendsList from "../components/FriendsList";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Layout() {
  return (
    <div className="relative flex md:p-4 h-svh text-slate-700 bg-slate-100">
      <FriendsList />

      {/* side menu */}
      <SideMenu />

      {/* conversation */}
      <div className="hidden md:block">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
