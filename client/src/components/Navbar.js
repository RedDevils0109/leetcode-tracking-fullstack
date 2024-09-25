import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import api from "../utils/normalApi";
import axios from "axios";
const Navbar = () => {
  const token = localStorage.getItem("token");
  // Retrieve the user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // Parse the JSON string back to an object

  // Access the user's image
  const userImage = user?.image; // Optional chaining to avoid errors if user is null
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.get("/auth/logout"); // Make sure this endpoint is correct
      const data = response.data;

      if (data.success === true) {
        // Clear local storage on successful logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to the home page or desired route
        navigate("/"); // Use navigate for redirection
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error); // Log any error that occurs
      // Optionally handle logout error, e.g., show a message
    }
  };

  return (
    <header className="bg-black">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div>
          <Link to={"/"}>
            <img
              className="w-16 cursor-pointer"
              src="https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {token ? (
            <>
              <div
                className="w-10 h-10 rounded-full bg-cover"
                style={{ backgroundImage: `url(${userImage})` }}
              ></div>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <a onClick={() => logout()}>Sign out</a>
              </button>
            </>
          ) : (
            <>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <Link to={"/sign-in"}>Sign in</Link>
              </button>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <Link to={"/sign-up"}>Sign up</Link>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
