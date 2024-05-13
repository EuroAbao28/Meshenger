import React from "react";
import classnames from "classnames";
import { useStatesContext } from "../context/StatesContextProvider";
import userImage from "../assets/user.png";
import { LuUser, LuSettings2, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function SideMenu() {
  const { isSideMenuOpen, setIsSideMenuOpen } = useStatesContext();

  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => setIsSideMenuOpen(false)}
        className={classnames("absolute inset-0 z-10 bg-black/20", {
          block: isSideMenuOpen,
          hidden: !isSideMenuOpen,
        })}></div>

      <div
        className={classnames(
          "absolute inset-0 w-4/5 z-20 transition-all bg-white duration-500 flex flex-col ease-in-out sm:w-2/5 md:w-[20rem] p-4",
          {
            "-left-full": !isSideMenuOpen,
            "left-0": isSideMenuOpen,
          }
        )}>
        <div className="flex gap-3 mb-4">
          <img src={userImage} alt="user image" className="w-10" />
          <div className="flex-1">
            <h3 className="font-semibold">Orue Abao</h3>
            <p className="-mt-1 text-sm text-sky-500">orue2002@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-slate-50">
          <LuUser className="text-lg" />
          My Profile
        </div>

        <div className="flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-slate-50">
          <LuSettings2 className="text-lg" />
          Settings
        </div>

        <div
          onClick={() => navigate("/login")}
          className="flex items-center gap-4 p-2 text-red-500 rounded cursor-pointer hover:bg-slate-50">
          <LuLogOut className="text-lg" />
          Logout
        </div>
      </div>
    </>
  );
}

export default SideMenu;
