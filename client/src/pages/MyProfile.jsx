import React, { useEffect, useState } from "react";
import userImage from "../assets/user.png";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { PiWarningCircleBold } from "react-icons/pi";
import classNames from "classnames";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";
import toast from "react-hot-toast";

function MyProfile() {
  const navigate = useNavigate();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isEditShow, setIsEditShow] = useState(false);
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState({});
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const getUserData = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${userRoute}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setUser(response.data.user);
      setEditUser(response.data.user);
      setIsPageLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaveLoading(true);
    try {
      console.log(editUser);

      const userToken = localStorage.getItem("userToken");
      const response = await axios.patch(
        `${userRoute}/${user._id}`,
        {
          firstname: editUser.firstname,
          lastname: editUser.lastname,
          username: editUser.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setIsSaveLoading(false);
      setIsEditShow(false);
      getUserData();

      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {isPageLoading ? (
        <div className="flex items-center justify-center w-screen h-svh text-slate-700">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md"></span>
            <h1 className="text-xl">Authenticating</h1>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-screen h-svh text-slate-700">
          <div className=" flex items-center gap-2 md:gap-12 p-4 mx-auto w-full max-w-[50rem] md:top-16     md:pt-12">
            <div
              onClick={() => navigate("/")}
              className="p-2 text-2xl rounded-full cursor-pointer hover:bg-slate-100 md:text-4xl">
              <LuArrowLeft />
            </div>
            <h1 className="text-xl md:text-5xl md:font-semibold">My Profile</h1>
          </div>
          <div
            className={classNames(
              "px-4 py-2 bg-orange-100 transition-all text-orange-500 w-full md:w-[50rem] mx-auto flex items-center gap-4",
              {
                "opacity-100 h-10": isEditShow,
                "opacity-0 h-0": !isEditShow,
              }
            )}>
            <PiWarningCircleBold className="text-lg" />
            Edit mode
          </div>
          {isEditShow ? (
            // edit
            <div className="md:w-[50rem] w-full p-4 md:p-0 mx-auto  md:flex gap-6  flex-1    md:pt-20 ">
              <img
                className="mx-auto mb-6 rounded-full h-fit w-44 md:w-52"
                src={userImage}
                alt="user image"
              />
              <form
                onSubmit={handleSaveEdit}
                className="flex flex-col items-end flex-1 gap-14">
                <div className="grid w-full grid-cols-1 gap-6 h-fit sm:grid-cols-2">
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Firstname</p>
                    <input
                      value={editUser.firstname}
                      onChange={(e) =>
                        setEditUser({ ...editUser, firstname: e.target.value })
                      }
                      className="p-2 px-4 rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Lastname</p>
                    <input
                      value={editUser.lastname}
                      onChange={(e) =>
                        setEditUser({ ...editUser, lastname: e.target.value })
                      }
                      className="p-2 px-4 rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Username</p>
                    <input
                      value={editUser.username}
                      onChange={(e) =>
                        setEditUser({ ...editUser, username: e.target.value })
                      }
                      className="p-2 px-4 rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Password</p>
                    <p className="p-2 px-4 rounded outline outline-1 outline-slate-300">
                      ••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex w-1/2 gap-4 ">
                  <button
                    onClick={() => setIsEditShow(false)}
                    type="button"
                    className="flex-1 px-4 py-2 rounded outline outline-2 text-nowrap outline-sky-500 text-slate-400 focus:outline-sky-500 focus:outline-2">
                    Cancel
                  </button>
                  <button
                    disabled={isSaveLoading}
                    type="submit"
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white bg-green-500 rounded text-nowrap">
                    {isSaveLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="md:w-[50rem] w-full p-4 md:p-0 mx-auto  md:flex gap-6  flex-1    md:pt-20 ">
              <img
                className="mx-auto mb-6 rounded-full w-44 md:w-52 md:place-self-start "
                src={userImage}
                alt="user image"
              />
              <div className="flex flex-col items-end flex-1 gap-14">
                <div className="grid w-full grid-cols-1 gap-6 h-fit sm:grid-cols-2">
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Firstname</p>
                    <p className="p-2 px-4 rounded outline outline-1 outline-slate-300">
                      {user.firstname}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Lastname</p>
                    <p className="p-2 px-4 rounded outline outline-1 outline-slate-300">
                      {user.lastname}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Username</p>
                    <p className="p-2 px-4 rounded outline outline-1 outline-slate-300">
                      {user.username}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm text-slate-400">Password</p>
                    <p className="p-2 px-4 rounded outline outline-1 outline-slate-300">
                      ••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex w-1/2 gap-4 ">
                  <button className="flex-1 px-4 py-2 text-white bg-red-400 rounded text-nowrap">
                    Delete
                  </button>
                  <button
                    onClick={() => setIsEditShow(true)}
                    className="flex-1 px-4 py-2 rounded outline outline-2 text-nowrap outline-sky-500 text-slate-400">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyProfile;
