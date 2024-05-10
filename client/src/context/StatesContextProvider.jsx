import { createContext, useContext, useState } from "react";

// Create a context object
const StatesContext = createContext();

// Custom hook to access the context value
export const useStatesContext = () => useContext(StatesContext);

// Provider component
export const StatesProvider = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <StatesContext.Provider value={{ isSideMenuOpen, setIsSideMenuOpen }}>
      {children}
    </StatesContext.Provider>
  );
};
