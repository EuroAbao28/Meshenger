import React, { useEffect, useState } from "react";
import { useStatesContext } from "../context/StatesContextProvider";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { TECH_USED } from "../constants/techUsed";
import { FaCode } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { RiContactsBook3Line } from "react-icons/ri";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";

function About() {
  const navigate = useNavigate();
  const { isDarkMode } = useStatesContext();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const getUserData = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      await axios.get(`${userRoute}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setIsPageLoading(false);
    } catch (error) {
      console.log(error);
      // navigate("/login");
    }
  };

  useEffect(() => {
    AOS.init();

    getUserData();
  }, []);

  return (
    <div className={`${isDarkMode && "dark"}`}>
      {isPageLoading ? (
        <div className="flex items-center justify-center w-screen h-svh text-slate-700 dark:bg-neutral-950">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md"></span>
            <h1 className="text-xl">Authenticating</h1>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-screen bg-white dark:bg-neutral-950 dark:text-slate-100 h-svh text-slate-700">
          <div className="w-[58rem] flex flex-col">
            {/* header */}
            <div className="flex items-center w-full gap-2 p-4 md:gap-4 md:pt-12 ">
              <div
                onClick={() => navigate("/")}
                className="p-2 text-lg rounded-full cursor-pointer md:text-4xl sm:text-2xl dark:hover:bg-neutral-800 hover:bg-slate-100">
                <LuArrowLeft />
              </div>
              <h1 className="text-lg font-semibold sm:text-2xl md:text-5xl">
                About
              </h1>
            </div>

            {/* body */}
            <div className="p-8 mt-6">
              <h2
                data-aos="fade-right"
                className="flex items-center gap-3 font-semibold underline underline-offset-2">
                <FaRegLightbulb className="text-xl text-sky-500" />
                Project Overview
              </h2>
              <p
                data-aos="fade-right"
                className="mt-2 text-sm font-light dark:text-slate-100/70">
                A chat application inspired by popular messaging platforms.
                Meshenger is a personal project developed to enhance my skills
                in building real-time communication tools and to showcase my
                capabilities in full-stack development. This application aims to
                provide a simple and intuitive chat experience.
              </p>

              <h2
                data-aos="fade-left"
                className="flex items-center gap-3 mt-12 font-semibold underline underline-offset-2">
                <FaCode className="text-xl text-sky-500" />
                Technologies Used
              </h2>
              <div
                data-aos="fade-left"
                className="flex flex-wrap w-full gap-2 mt-4 ">
                {TECH_USED.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-2 py-1 transition-all bg-white rounded shadow outline outline-1 outline-slate-300 hover:-translate-y-1 dark:bg-neutral-700 dark:outline-none">
                    <img className="w-6" src={item.icon} alt={item.name} />
                    <p className="text-sm">{item.name} </p>
                  </div>
                ))}
              </div>

              <h2
                data-aos="fade-right"
                className="flex items-center gap-3 mt-12 font-semibold underline underline-offset-2">
                <RiContactsBook3Line className="text-xl text-sky-500" />
                Get in Touch
              </h2>
              <p
                data-aos="fade-right"
                className="mt-2 text-sm font-light dark:text-slate-100/70">
                If you have any questions or feedback about Meshenger, feel free
                to reach out to me at
                <span className="underline text-sky-500 underline-offset-2">
                  {" "}
                  abaoeuro2002@gmail.com
                </span>{" "}
                . I am always open to suggestions and eager to hear your
                thoughts on how I can improve this project.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
