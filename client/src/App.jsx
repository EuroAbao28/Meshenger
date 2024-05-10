import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./pages/Layout";
import { StatesProvider } from "./context/StatesContextProvider";

function App() {
  return (
    <>
      <StatesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </StatesProvider>
    </>
  );
}

export default App;
