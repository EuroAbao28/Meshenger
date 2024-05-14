import React from "react";
import FriendsList from "../components/FriendsList";
import { Outlet, useParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Layout() {
  const { id } = useParams();

  console.log(id);
  return (
    <div className="flex gap-4  md:p-4 h-svh text-slate-700 bg-slate-100">
      <FriendsList isIdParamsValid={id} />

      {/* side menu */}
      <SideMenu />

      {/* conversation */}
      <Outlet />
    </div>
  );
}

export default Layout;
