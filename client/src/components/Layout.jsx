import React, { useEffect, useState } from "react";
import FriendsList from "./FriendsList";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import SideMenu from "./SideMenu";
import classNames from "classnames";
import useGetUserData from "../hooks/useGetUserData";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes";
import { useUserContext } from "../context/UserContextProvider";

// para hindi auto connect
export const socket = io(host, { autoConnect: false });

function Layout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, latestMessages, setActiveUsers } = useUserContext();

  const { getUserDataFunction, isGetUserDataLoading } = useGetUserData();

  const getUserData = async () => {
    try {
      const response = await getUserDataFunction();

      socket.emit("login", response.user.username);
    } catch (error) {
      console.log(error);
      toast.error(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    getUserData();

    socket.on("updatedStatus", (data) => {
      // console.log("UPDATED STATUS", data);
      setActiveUsers(data);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("LAYOUT", user);
  }, [user]);

  return (
    <>
      {isGetUserDataLoading ? (
        <div className="flex items-center justify-center w-screen h-svh text-slate-700">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md"></span>
            <h1 className="text-xl">Authenticating</h1>
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            "grid grid-rows-1 gap-0 md:gap-4 md:grid-cols-20rem lg:grid-cols-24rem md:p-4 h-svh text-slate-700 bg-slate-100",
            {
              "grid-cols-noFriendsList": id,
              "grid-cols-noConversation": !id,
            }
          )}>
          <FriendsList />

          {/* side menu */}
          <SideMenu />

          {/* conversation */}
          <Outlet />
        </div>
      )}
    </>
  );
}

export default Layout;
