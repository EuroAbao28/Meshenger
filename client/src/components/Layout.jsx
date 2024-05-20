import React, { useEffect, useState } from "react";
import FriendsList from "./FriendsList";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import SideMenu from "./SideMenu";
import classNames from "classnames";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";
import { useUserContext } from "../context/UserContextProvider";
import toast from "react-hot-toast";

function Layout() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${userRoute}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setUser(response.data.user);

      setIsLoading(false);
    } catch (error) {
      navigate("/login");
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      {isLoading ? (
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
