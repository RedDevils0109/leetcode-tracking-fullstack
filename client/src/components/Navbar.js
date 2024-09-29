import React from "react";
import { Link,  useNavigate } from "react-router-dom";
import api from "../utils/normalApi";

const Navbar = () => {
  const token = localStorage.getItem("token");
  // Retrieve the user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // Parse the JSON string back to an object

  // Access the user's image
  const userImage = user?.image; // Optional chaining to avoid errors if user is null
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await api.get("/auth/logout"); // Make sure this endpoint is correct
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
              <Link to={"/profile"}>
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${userImage})` }}
                ></div>
              </Link>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <a
                  onClick={() => logout()}
                  className="relative inline-block hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all duration-300"
                >
                  Sign out
                </a>
              </button>
            </>
          ) : (
            <>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <Link
                  to={"/sign-in"}
                  className="relative inline-block hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all duration-300"
                >
                  Sign in
                </Link>
              </button>
              <button className="text-slate-200 px-1 py-2 rounded-full">
                <Link
                  to={"/sign-up"}
                  className="relative inline-block hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all duration-300"
                >
                  Sign up
                </Link>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
