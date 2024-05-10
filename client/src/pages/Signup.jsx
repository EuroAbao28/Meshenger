import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center w-screen h-svh text-slate-700">
      <form className="w-full max-w-sm mx-6">
        <div className="flex items-center justify-center gap-2 mb-8 ">
          <img className="w-10" src={logo} alt="logo" />
          <h1 className="text-3xl font-bold ">Meshenger</h1>
        </div>
        <input
          className="w-full px-4 py-2 transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
          type="text"
          placeholder="Username"
        />
        <input
          className="w-full px-4 py-2 mt-6 transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
          type="text"
          placeholder="Firstname"
        />
        <input
          className="w-full px-4 py-2 mt-6 transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
          type="text"
          placeholder="Lastname"
        />
        <input
          className="w-full px-4 py-2 mt-6 transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
          type="text"
          placeholder="Password"
        />
        <input
          className="w-full px-4 py-2 mt-6 transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 "
          type="text"
          placeholder="Confirm Password"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 mt-6 font-semibold text-white transition-all rounded outline outline-1 outline-slate-300 focus:outline-sky-500 focus:outline-2 bg-sky-500 active:bg-sky-600">
          Sign Up
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

      <div className="absolute flex flex-col items-center bottom-4 text-slate-500 ">
        <p className="-mb-1 text-sm font-semibold tracking-widest">Euro Abao</p>
        <p className="text-xs font-light bg-white">Developed by</p>
      </div>
    </div>
  );
}

export default Signup;
