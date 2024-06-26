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
  const { setIsSideMenuOpen } = useStatesContext();
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
      const response = await searchFunction(searchInput);

      setSearchResult(response.data);
      setShowResult(true);

      console.log(response.data);
    } catch (error) {
      toast.error(error);
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
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getLatestMessageFunction();

    socket.on("receiveNotif", (data) => {
      if (data.receiver === user._id) {
        console.log(`From ${data.sender}, to ${data.receiver}`);
        console.log(user.contacts);
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

  return (
    <div className="flex flex-col bg-white shadow-sm md:rounded-lg">
      {/* header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div
          onClick={() => setIsSideMenuOpen(true)}
          className="p-2 rounded-full cursor-pointer hover:bg-slate-100">
          <LuMenu className="text-2xl" />
        </div>
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-6 " />
          <h1 className="text-2xl font-bold ">Meshenger</h1>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="relative p-2 rounded-full cursor-pointer hover:bg-slate-100 ">
            {messageRequests.username && (
              <span className="absolute w-2 bg-red-500 rounded-full right-2 top-2 aspect-square"></span>
            )}
            <LuBell className="text-2xl" />
          </div>
          <div className="z-20 p-4 mt-2 bg-white outline outline-1 outline-slate-200 rounded shadow w-[20rem] sm:w-[20rem] md:w-[16rem] dropdown-content menu lg:w-[20rem]">
            <h1 className="text-lg font-semibold">Message Requests</h1>
            <div className="flex gap-2 mt-4 bg-white">
              <img
                src={user.imageUrl || userImage}
                alt=""
                className="object-cover w-12 rounded-full aspect-square"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{user.username}</h3>
                <p>Oy pre musta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* search bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 px-4 py-2 mx-4 mb-4 bg-white rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300">
        <LuSearch className="text-slate-700" />
        <input
          name="searchInput"
          type="text"
          placeholder="Search a user"
          value={searchInput}
          onChange={handleOnChange}
          className="w-full focus:outline-none"
        />
        {searchInput && (
          <div
            onClick={handleResetSearchInput}
            className="p-1 rounded-full cursor-pointer bg-slate-50 hover:bg-slate-100">
            <LuX className="text-slate-500" />
          </div>
        )}
      </form>

      <p className="text-center">{user._id}</p>

      {/* friends list */}
      <div className="relative flex-1">
        {!showResult ? (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {user.contacts.length > 0 ? (
              <>
                {user.contacts.map((contact) => (
                  <div
                    key={contact.username}
                    onClick={() => handleSelectUserToChat(contact._id)}
                    className={classNames(
                      "flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100",
                      {
                        "bg-slate-100": contact._id === id,
                      }
                    )}>
                    <div className="relative w-12">
                      {activeUsers.includes(contact.username) && (
                        <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
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
                        <p className="text-sm line-clamp-1">
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
        ) : (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {isSearchLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                <p>Loading</p>
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
                        className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100">
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
                          className="p-2 text-xl rounded-full hover:bg-slate-200 ">
                          <LuUserPlus />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsList;
