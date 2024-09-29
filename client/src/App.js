import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Leetcode from "./pages/Leetcode";
import NewLeetcode from "./pages/NewLeetcode";
import EditLeetcode from "./pages/EditLeetcode";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<Login />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/leetcode" element={<Leetcode />}></Route>
        <Route path="/leetcode/new" element={<NewLeetcode />}></Route>
        <Route path="/leetcode/:slug" element={<EditLeetcode />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
