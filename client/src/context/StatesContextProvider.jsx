import { createContext, useContext, useEffect, useState } from "react";

// Create a context object
const StatesContext = createContext();

// Custom hook to access the context value
export const useStatesContext = () => useContext(StatesContext);

// Provider component
export const StatesProvider = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Update local storage whenever the theme changes
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <StatesContext.Provider
      value={{ isSideMenuOpen, setIsSideMenuOpen, isDarkMode, setIsDarkMode }}>
      {children}
    </StatesContext.Provider>
  );
};
