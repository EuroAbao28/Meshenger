import React from "react";
import { DUMMY_USERS } from "../constants/dummyUser";

function FriendsList() {
  return (
    <div className="relative w-full h-full md:w-auto">
      <div className="absolute top-0 bottom-0 left-0 right-0 p-4 overflow-y-auto ">
        {DUMMY_USERS.map((user) => (
          <div
            key={user.username}
            className="flex gap-2 p-2 rounded hover:bg-slate-100">
            <img src={user.image} alt="user image" className="w-12" />
            <div className="flex flex-col">
              <p className="font-semibold">{user.username}</p>
              <p className="-mt-1 font-light">Latest message here.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
