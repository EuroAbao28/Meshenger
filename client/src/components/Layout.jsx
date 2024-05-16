import React from "react";
import FriendsList from "./FriendsList";
import { Outlet, useParams } from "react-router-dom";
import SideMenu from "./SideMenu";

function Layout() {
  const { id } = useParams();

  console.log(id);
  return (
    <>
      <div className="grid grid-rows-1 gap-0 md:gap-4 md:grid-cols-20rem grid-cols-noFriendsList lg:grid-cols-24rem md:p-4 h-svh text-slate-700 bg-slate-100">
        <FriendsList />

        {/* side menu */}
        <SideMenu />

        {/* conversation */}
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
