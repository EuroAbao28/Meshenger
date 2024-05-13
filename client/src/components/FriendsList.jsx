import React from "react";
import { DUMMY_USERS } from "../constants/dummyUser";
import { useNavigate } from "react-router-dom";

function FriendsList() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-white md:w-[18rem] lg:w-[23rem]">
      <div className="absolute top-0 bottom-0 left-0 right-0 p-4 overflow-y-auto ">
        {DUMMY_USERS.map((user) => (
          <div
            onClick={() => navigate("/9999")}
            key={user.username}
            className="flex items-center gap-4 p-2 rounded hover:bg-slate-100">
            <img
              src={user.image}
              alt="user image"
              className="w-12 aspect-square"
            />
            <div className="flex flex-col justify-center ">
              <p className=" line-clamp-1">{user.username}</p>
              <p className="-mt-1 text-sm font-light">Latest message here.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
