import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import { StatesProvider } from "./context/StatesContextProvider";
import Welcome from "./pages/Welcome";
import Conversation from "./pages/Conversation";
import { Toaster } from "react-hot-toast";
import { UseProvider } from "./context/UserContextProvider";

function App() {
  return (
    <>
      <UseProvider>
        <StatesProvider>
          <Toaster position="top-right" />

          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Welcome />} />
                <Route path="/:id" element={<Conversation />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </StatesProvider>
      </UseProvider>
    </>
  );
}

export default App;
