import React, { useEffect, useState } from "react";
import { LuMenu, LuSearch, LuBell, LuX, LuUserPlus } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useStatesContext } from "../context/StatesContextProvider";
import logo from "../assets/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import useSearchUser from "../hooks/useSearchUser";
import toast from "react-hot-toast";
import { useUserContext } from "../context/UserContextProvider";
import axios from "axios";
import { messageRoute, userRoute } from "../utils/APIRoutes";
import useGetUserData from "../hooks/useGetUserData";
import useGetLatestMessage from "../hooks/useGetLatestMessage";
import { socket } from "./Layout";
import myRingTone from "../assets/myRingTone.mp3";
import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import classNames from "classnames";

// Define a custom locale with short formats
const customLocale = (number, index, totalSec) =>
  [
    ["just now", "right now"],
    ["%ss", "in %ss"],
    ["1m", "in 1m"],
    ["%sm", "in %sm"],
    ["1h", "in 1h"],
    ["%sh", "in %sh"],
    ["1d", "in 1d"],
    ["%sd", "in %sd"],
    ["1w", "in 1w"],
    ["%sw", "in %sw"],
    ["1mo", "in 1mo"],
    ["%smo", "in %smo"],
    ["1y", "in 1y"],
    ["%sy", "in %sy"],
  ][index];

// Register the custom locale
timeago.register("short", customLocale);

function FriendsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audio] = useState(new Audio(myRingTone));
  const { setIsSideMenuOpen, isDarkMode, setIsDarkMode } = useStatesContext();
  const { user, latestMessages, setLatestMessages, activeUsers } =
    useUserContext();

  const { searchFunction, isSearchLoading } = useSearchUser();
  const { getUserDataFunction } = useGetUserData();
  const { getLatestMessageFunction } = useGetLatestMessage();

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const [messageRequests, setMessageRequests] = useState([]);

  // search onChange
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);

    // if the input is empty, resset
    if (value.length === 0) {
      setShowResult(false);
      setSearchResult([]);
    }
  };

  //  resert searchInput
  const handleResetSearchInput = () => {
    setSearchInput("");
    setShowResult(false);
    setSearchResult([]);
  };

  // search user
  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchInput.length < 3) return;

    try {
      setShowResult(true);

      const response = await searchFunction(searchInput);

      setSearchResult(response.data);

      // console.log(response.data);
    } catch (error) {
      toast.error(error, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
      console.log(error);
    }
  };

  // select a user
  const handleSelectUserToChat = (id) => {
    navigate(`/${id}`);

    // reset the search
    setSearchInput("");
    setShowResult(false);
    setSearchResult([]);
  };

  // add to contact
  const handleAddToContact = async (user) => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.post(
        `${userRoute}/addToContact/${user._id}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // reset the search
      setSearchInput("");
      setSearchResult([]);
      setShowResult(false);

      getUserDataFunction();
      toast.success(response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
    }
  };

  useEffect(() => {
    getLatestMessageFunction();

    socket.on("receiveNotif", (data) => {
      if (data.receiver === user._id) {
        // console.log(`From ${data.sender}, to ${data.receiver}`);
        // console.log(user.contacts);
        setLatestMessages((prev) => ({ ...prev, [data.sender]: data }));

        // if (user.contacts.find((contact) => contact._id === data.sender)) {
        //   console.log("meron");
        // }

        // audio.play().catch((err) => console.error("Error playing audio:", err));

        // put it the message request
        // setMessageRequests(data);
      }
    });
  }, []);

  // theme toggle
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);

    console.log("theme toggled");
  };

  return (
    <div className="flex flex-col bg-white shadow-sm md:rounded-lg dark:bg-neutral-900">
      {/* header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div
          onClick={() => setIsSideMenuOpen(true)}
          className="p-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
          <LuMenu className="text-2xl" />
        </div>
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-6 " />
          <h1 className="text-2xl font-bold ">Meshenger</h1>
        </div>

        {/* theme toggle */}
        <div className="flex items-center justify-center cursor-pointer ">
          <label className="grid items-center justify-center swap swap-rotate stack">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              onChange={toggleTheme}
              checked={isDarkMode ? true : false}
            />

            {/* sun icon */}
            <svg
              className="w-8 h-8 fill-current swap-off"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="w-6 h-6 fill-current swap-on"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>

      {/* search bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 px-4 py-2 mx-4 mb-4 bg-white rounded-full dark:bg-neutral-900 outline outline-1 focus-within:outline-sky-500 outline-slate-300 dark:outline-neutral-700">
        <LuSearch className="text-slate-700 dark:text-slate-400" />
        <input
          name="searchInput"
          type="text"
          placeholder="Search a user"
          value={searchInput}
          onChange={handleOnChange}
          className="w-full bg-transparent focus:outline-none"
        />
        {searchInput && (
          <div
            onClick={handleResetSearchInput}
            className="p-1 rounded-full cursor-pointer bg-slate-50 dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700">
            <LuX className="text-slate-500" />
          </div>
        )}
      </form>

      {/* <p className="text-center">{user._id}</p> */}

      {/* friends list */}
      <div className="relative flex-1">
        {showResult ? (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {isSearchLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                <p>Searching</p>
              </div>
            ) : (
              <>
                {searchResult.length === 0 ? (
                  <p className="text-center ">No user found</p>
                ) : (
                  <>
                    <p className="px-2 text-slate-400">Search result</p>
                    {searchResult.map((user) => (
                      <div
                        onClick={() => handleSelectUserToChat(user._id)}
                        key={user.username}
                        className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800">
                        <div className="relative w-12">
                          {activeUsers.includes(user.username) && (
                            <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                          )}
                          <img
                            src={user.imageUrl || userImage}
                            alt="user image"
                            className="object-cover w-full rounded-full aspect-square"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold line-clamp-1">
                            {user.username}
                          </h3>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToContact(user);
                          }}
                          className="p-2 text-xl rounded-full hover:bg-slate-200 dark:hover:bg-neutral-900">
                          <LuUserPlus />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {user.contacts.length > 0 ? (
              <>
                {user.contacts.map((contact) => (
                  <div
                    key={contact.username}
                    onClick={() => handleSelectUserToChat(contact._id)}
                    className={classNames(
                      "flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800 ",
                      {
                        "bg-slate-100 dark:bg-neutral-800": contact._id === id,
                      }
                    )}>
                    <div className="relative w-12">
                      {activeUsers.includes(contact.username) && (
                        <span className="absolute top-0 right-0 w-3 rounded-full bg-custom-green aspect-square outline outline-2 outline-white dark:outline-neutral-900"></span>
                      )}
                      <img
                        src={contact.imageUrl || userImage}
                        alt="user image"
                        className="object-cover w-full rounded-full aspect-square"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">
                        {`${contact.firstname} ${contact.lastname}`}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm line-clamp-1 dark:opacity-50">
                          {user._id ===
                            (latestMessages &&
                              latestMessages[contact._id]?.sender) && "You: "}
                          {(latestMessages &&
                            latestMessages[contact._id]?.content) ||
                            "No messages yet"}
                        </p>
                        {latestMessages &&
                          latestMessages[contact._id]?.content && (
                            <div className="text-xs text-nowrap text-slate-500">
                              <TimeAgo
                                datetime={
                                  latestMessages &&
                                  latestMessages[contact._id]?.createdAt
                                }
                                locale="short"
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center text-slate-400">No contacts</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsList;
