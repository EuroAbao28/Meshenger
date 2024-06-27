import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";
import { useStatesContext } from "../context/StatesContextProvider";

function Signup() {
  const navigate = useNavigate();
  const { isDarkMode } = useStatesContext();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${userRoute}/signup`, form);

      toast.success(response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message, {
        style: {
          background: isDarkMode && "#262626",
          color: isDarkMode && "#F1F5F9",
        },
      });
      return;
    }
  };

  return (
    <div className={`${isDarkMode && "dark"}`}>
      <div className="relative flex items-center justify-center w-screen h-svh text-slate-700 dark:bg-neutral-950 dark:text-slate-100">
        <form onSubmit={handleSignup} className="w-full max-w-sm mx-6">
          <div className="flex items-center justify-center gap-2 mb-8 ">
            <img className="w-10" src={logo} alt="logo" />
            <h1 className="text-3xl font-bold ">Meshenger</h1>
          </div>
          <input
            className="w-full px-4 py-2 transition-all bg-transparent rounded dark:outline-neutral-700 outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-2 mt-6 transition-all bg-transparent rounded dark:outline-neutral-700 outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
            name="firstname"
            type="text"
            placeholder="Firstname"
            value={form.firstname}
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-2 mt-6 transition-all bg-transparent rounded dark:outline-neutral-700 outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
            name="lastname"
            type="text"
            placeholder="Lastname"
            value={form.lastname}
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-2 mt-6 transition-all bg-transparent rounded dark:outline-neutral-700 outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-2 mt-6 transition-all bg-transparent rounded dark:outline-neutral-700 outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-6 font-semibold text-white transition-all rounded outline dark:outline-neutral-700 dark:focus:outline-sky-500 outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 bg-sky-500 active:bg-sky-600">
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing up
              </>
            ) : (
              "Sign up"
            )}
          </button>
          <p className="mt-4 text-sm font-light text-center text-slate-500">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-slate-600 hover:text-sky-500"
              onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </form>

        <div className="absolute flex flex-col items-center bottom-4 text-slate-500 dark:text-slate-600">
          <p className="-mb-1 text-sm font-semibold tracking-widest">
            Euro Abao
          </p>
          <p className="text-xs font-light ">Developed by</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
