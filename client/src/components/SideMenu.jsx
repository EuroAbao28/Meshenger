import React, { useState } from "react";
import classnames from "classnames";
import { useStatesContext } from "../context/StatesContextProvider";
import userImage from "../assets/user.png";
import { LuUser, LuSettings2, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
import toast from "react-hot-toast";

function SideMenu() {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { isSideMenuOpen, setIsSideMenuOpen } = useStatesContext();

  // logout
  const handleLogout = () => {
    setIsSideMenuOpen(false);

    // remove userToken
    localStorage.removeItem("userToken");

    toast.success("Logged out succssfully");
    navigate("/login");
  };

  // navigate
  const handleNavigate = (path) => {
    setIsSideMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <div
        onClick={() => setIsSideMenuOpen(false)}
        className={classnames(
          "absolute inset-0 z-40 bg-black/20 dark:bg-black/70",
          {
            block: isSideMenuOpen,
            hidden: !isSideMenuOpen,
          }
        )}></div>

      <div
        className={classnames(
          "absolute inset-0 w-4/5 z-50 transition-all bg-white dark:bg-neutral-900 duration-500 flex flex-col ease-in-out sm:w-2/5 md:w-[20rem] p-4 md:p-6",
          {
            "-left-full": !isSideMenuOpen,
            "left-0": isSideMenuOpen,
          }
        )}>
        <div className="flex gap-3 mb-4">
          <img
            src={user.imageUrl || userImage}
            alt="user image"
            className="object-cover w-12 rounded-full aspect-square"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{`${user.firstname} ${user.lastname}`}</h3>
            <p className="-mt-1 text-sm text-sky-500">{user.username}</p>
          </div>
        </div>

        <div
          onClick={() => handleNavigate("/profile")}
          className="flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
          <LuUser className="text-lg" />
          My Profile
        </div>

        <div className="flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
          <LuSettings2 className="text-lg" />
          Settings
        </div>

        <div
          onClick={handleLogout}
          className="flex items-center gap-4 p-2 text-red-500 rounded cursor-pointer dark:hover:bg-neutral-800 hover:bg-slate-100">
          <LuLogOut className="text-lg" />
          Logout
        </div>
      </div>
    </>
  );
}

export default SideMenu;
