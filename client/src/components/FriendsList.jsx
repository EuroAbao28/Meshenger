import React, { useState } from "react";
import { LuMenu, LuSearch, LuBell, LuX, LuUserPlus } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useStatesContext } from "../context/StatesContextProvider";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import useSearchUser from "../hooks/useSearchUser";
import toast from "react-hot-toast";
import { useUserContext } from "../context/UserContextProvider";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";
import useGetUserData from "../hooks/useGetUserData";

function FriendsList() {
  const navigate = useNavigate();
  const { setIsSideMenuOpen } = useStatesContext();
  const { user, setUser } = useUserContext();

  const { searchFunction, isSearchLoading } = useSearchUser();
  const { getUserDataFunction } = useGetUserData();

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

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
            className="p-2 rounded-full cursor-pointer hover:bg-slate-100 ">
            <LuBell className="text-2xl" />
          </div>
          <ul
            tabIndex={0}
            className="z-20 p-2 mt-2 bg-white outline outline-1 outline-slate-200 rounded shadow w-[16rem] sm:w-[20rem] md:w-[16rem] dropdown-content menu lg:w-[20rem]">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
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

      {/* friends list */}
      <div className="relative flex-1">
        {!showResult ? (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {user.contacts.map((user) => (
              <div
                key={user.username}
                onClick={() => handleSelectUserToChat(user._id)}
                className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100">
                <div className="relative">
                  <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                  <img src={userImage} alt="user image" className="w-12" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {`${user.firstname} ${user.lastname}`}
                  </h3>
                  <p className="w-full text-sm font-light line-clamp-1">
                    Lastest message here Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Ut, accusantium.
                  </p>
                </div>
              </div>
            ))}
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
                        <div className="relative">
                          <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                          <img
                            src={userImage}
                            alt="user image"
                            className="w-12"
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
