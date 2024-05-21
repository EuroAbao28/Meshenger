import React, { useState } from "react";
import { LuMenu, LuSearch, LuBell } from "react-icons/lu";
import userImage from "../assets/user.png";
import { DUMMY_USERS } from "../constants/dummyUser";
import { useStatesContext } from "../context/StatesContextProvider";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import useSearchUser from "../hooks/useSearchUser";
import toast from "react-hot-toast";

function FriendsList() {
  const navigate = useNavigate();
  const { setIsSideMenuOpen } = useStatesContext();

  const { searchFunction, isSearchLoading } = useSearchUser();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // search user
  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchInput.length < 3) return;

    try {
      const response = await searchFunction(searchInput);

      setSearchResult(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100">
          <LuMenu
            className="text-2xl"
            onClick={() => setIsSideMenuOpen(true)}
          />
        </div>
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-6 " />
          <h1 className="text-2xl font-bold ">Meshenger</h1>
        </div>
        <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100 ">
          <LuBell className="text-2xl" />
        </div>
      </div>

      {/* search bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 px-4 py-2 mx-4 mb-4 bg-white rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300">
        <LuSearch className="text-slate-700" />
        <input
          type="text"
          placeholder="Search a user"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full focus:outline-none"
        />
      </form>

      {/* friends list */}
      <div className="relative flex-1">
        {!searchInput ? (
          <div className="absolute inset-0 p-2 overflow-y-auto">
            {DUMMY_USERS.map((user) => (
              <div
                onClick={() => navigate("/999")}
                key={user.username}
                className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100">
                <div className="relative">
                  <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                  <img src={user.image} alt="user image" className="w-12" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {user.username}
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
            <p className="px-2 text-slate-400">Search result</p>
            {searchResult.map((user) => (
              <div
                onClick={() => navigate("/999")}
                key={user.username}
                className="flex items-center gap-4 p-2 cursor-pointer hover:bg-slate-100">
                <div className="relative">
                  <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                  <img src={userImage} alt="user image" className="w-12" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {user.username}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsList;
