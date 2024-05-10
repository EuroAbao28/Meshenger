import React from "react";
import classnames from "classnames";
import { useStatesContext } from "../context/StatesContextProvider";
import { LuChevronLeft, LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import user from "../assets/user.png";
import logo from "../assets/logo.png";
import { SIDEMENU_LINKS } from "../constants/sideNav";
import { Link } from "react-router-dom";

function SideMenu() {
  const { isSideMenuOpen, setIsSideMenuOpen } = useStatesContext();
  return (
    <>
      {/* backdrop */}
      {isSideMenuOpen && (
        <div
          onClick={() => setIsSideMenuOpen(false)}
          className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-black/10 sm:hidden"></div>
      )}

      {/*  sidemenu for small screen */}
      <div
        className={classnames(
          " bg-white sm:relative absolute z-20 top-0 bottom-0 transition-all overflow-hidden p-4 sm:hidden w-4/5 ease-in-out duration-300",
          {
            "left-0": isSideMenuOpen,
            "-left-full": !isSideMenuOpen,
          }
        )}>
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-4">
            <img className="w-10" src={user} alt="" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold ">Orue Abao</p>
              <p className="-mt-1 text-sm text-sky-500">euro@gmail.com</p>
            </div>
          </div>
          <LuChevronLeft
            onClick={() => setIsSideMenuOpen(false)}
            className="text-xl"
          />
        </div>
        <div className="flex flex-col mt-8 ">
          {SIDEMENU_LINKS.map((item) => (
            <Link
              className="flex items-center gap-4 px-3 py-2 text-lg hover:bg-slate-50"
              key={item.label}
              to={item.path}>
              {item.icon} {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-4 px-3 py-2 text-lg hover:bg-slate-50">
            <LuLogOut className="text-xl" />
            Logout
          </div>
        </div>
      </div>

      {/* side menu for big screen */}
      <div className="flex-col items-center hidden p-3 text-3xl text-sky-600/70 sm:flex bg-sky-100 ">
        <img className="w-10 mb-6" src={logo} alt="" />
        {SIDEMENU_LINKS.map((item) => (
          <Link key={item.label} className="p-3 hover:bg-slate-50">
            {" "}
            {item.icon}
          </Link>
        ))}
        <div className="p-3">
          <LuLogOut />
        </div>
      </div>
    </>
  );
}

export default SideMenu;
