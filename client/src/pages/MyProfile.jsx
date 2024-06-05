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
        <div className="flex justify-center w-screen h-svh text-slate-700">
          <div className="   w-[58rem] flex flex-col">
            {/* header */}
            <div className="flex items-center gap-2 p-4 md:gap-4 md:pt-12">
              <div
                onClick={() => navigate("/")}
                className="p-2 text-lg rounded-full cursor-pointer md:text-4xl sm:text-2xl hover:bg-slate-100">
                <LuArrowLeft />
              </div>
              <h1 className="text-lg font-semibold sm:text-2xl md:text-5xl">
                My Profile
              </h1>
            </div>

            {/* edit warnign */}
            <div
              className={classNames(
                "flex items-center gap-2 px-4 py-2 text-orange-500 transition-all bg-orange-100",
                {
                  "opacity-0 h-0": !isEditShow,
                  "opacity-100 h-12": isEditShow,
                }
              )}>
              <PiWarningCircleBold />
              Edit Mode
            </div>

            {/* body */}
            {isEditShow ? (
              <div className="flex-1 gap-6 p-4 pt-6 md:flex md:pt-12 ">
                <img
                  src={userImage}
                  alt="user image"
                  className="object-contain w-48 mx-auto rounded-full md:m-0 aspect-square md:w-60 place-self-start"
                />
                <form
                  onSubmit={handleSaveEdit}
                  className="flex-1 mt-6 bg-white md:mt-0">
                  <div className="grid w-full grid-cols-1 gap-6 h-fit sm:grid-cols-2">
                    <div className="flex flex-col gap-1 ">
                      <p className="text-sm text-slate-400">Firstname</p>
                      <input
                        required
                        value={editUser.firstname}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            firstname: e.target.value,
                          })
                        }
                        className="p-2 px-4 rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2"
                      />
                    </div>
                    <div className="flex flex-col gap-1 ">
                      <p className="text-sm text-slate-400">Lastname</p>
                      <input
                        required
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
                        required
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
                  <div className="flex gap-4 mt-6 md:w-1/2 md:ml-auto">
                    <button
                      onClick={() => setIsEditShow(false)}
                      type="button"
                      className="flex-1 px-4 py-2 rounded outline outline-2 text-nowrap text-sky-500 outline-sky-500 focus:outline-sky-500 focus:outline-2">
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
              <div className="flex-1 gap-6 p-4 pt-6 md:flex md:pt-12 ">
                <img
                  src={userImage}
                  alt="user image"
                  className="object-contain w-48 mx-auto rounded-full md:m-0 aspect-square md:w-60 place-self-start"
                />
                <div className="flex-1 mt-6 bg-white md:mt-0">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <div className="flex gap-4 mt-6 md:w-1/2 md:ml-auto">
                    <button className="flex-1 py-2 text-white bg-red-500 rounded">
                      Delete
                    </button>
                    <button
                      onClick={() => setIsEditShow(true)}
                      className="flex-1 py-2 bg-white rounded text-sky-500 outline outline-2 outline-sky-500">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyProfile;
