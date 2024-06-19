import React, { createContext, useContext, useState } from "react";

// create a context object
const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

// Provider component
export const UseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [latestMessages, setLatestMessages] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        latestMessages,
        setLatestMessages,
        activeUsers,
        setActiveUsers,
      }}>
      {children}
    </UserContext.Provider>
  );
};
