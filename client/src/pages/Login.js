import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/normalApi"; // Ensure the correct path to your api utility
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (value) => {
    try {
      const response = await api.post("/auth/login", {
        email: value.email,
        password: value.password,
      });

      const responseData = response.data;
      console.log(responseData);

      // Destructure user correctly
      const { token, data } = responseData; // Assuming `user` is the correct field name in responseData
      localStorage.setItem("token", token); // Store the token
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user data as a string

      // Redirect to the home page or desired route
      navigate("/"); // Use navigate instead of redirect
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage); // Set the error message for display
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] p-4">
      <h1 className="text-center text-4xl font-bold text-slate-800 mb-6 border-b-2 border-gray-300 pb-2">
        Login
      </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="mt-5">
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Email"
            className="border border-gray-400 py-1 px-2 w-full"
          />
        </div>
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}{" "}
        {/* Email error message */}
        <div className="mt-5">
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="Password"
            className="border border-gray-400 py-1 px-2 w-full"
          />
        </div>
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}{" "}
        {/* Password error message */}
        <button
          type="submit"
          className="p-2 border-gray-500 bg-slate-600 text-white mt-5 w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
