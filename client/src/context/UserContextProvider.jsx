import React, { createContext, useContext, useState } from "react";

// create a context object
const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

// Provider component
export const UseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
