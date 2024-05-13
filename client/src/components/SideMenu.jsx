import React from "react";
import classnames from "classnames";
import { useStatesContext } from "../context/StatesContextProvider";

function SideMenu() {
  const { isSideMenuOpen, setIsSideMenuOpen } = useStatesContext();

  return (
    <>
      <div
        onClick={() => setIsSideMenuOpen(false)}
        className={classnames("absolute inset-0 z-10 bg-black/30", {
          block: isSideMenuOpen,
          hidden: !isSideMenuOpen,
        })}></div>
      <div
        className={classnames(
          "absolute inset-0 w-4/5 z-20 transition-all bg-white duration-500 ease-in-out",
          {
            "-left-full": !isSideMenuOpen,
            "left-0": isSideMenuOpen,
          }
        )}>
        tanga
      </div>
    </>
  );
}

export default SideMenu;
