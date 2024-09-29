import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/normalApi"; // Ensure the correct path to your api utility
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection

const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Correctly initialize useForm
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm(); // Add parentheses here

  const onSubmit = async (value) => {
    // Check if passwords match
    if (value.password !== value.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: value.name,
        email: value.email,
        password: value.password,
      });

      const responseData = response.data;
      console.log(responseData);

      // Redirect to the home page or desired route
      navigate("/"); // Use navigate instead of redirect
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage); // Set the error message for display
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] p-4">
      <h1 className="text-center text-4xl font-bold text-slate-800 mb-6 border-b-2 border-gray-300 pb-2">
        Sign up
      </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display general error message */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        {/* Name Input */}
        <div className="mt-5">
          <p className="block text-sm font-medium text-gray-700">Name</p>
          <input
            id="name"
            {...register("name", {
              required: "Name is required", // Ensure error message is set correctly
            })}
            placeholder="Name"
            className="border border-gray-400 py-1 px-2 w-full"
          />
        </div>
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}{" "}
        {/* Email Input */}
        <div className="mt-5">
          <p className="block text-sm font-medium text-gray-700">Email</p>
          <input
            id="email"
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
        {/* Password Input */}
        <div className="mt-5">
          <p className="block text-sm font-medium text-gray-700">Password</p>
          <input
            id="password"
            {...register("password", {
              required: "Password is required", // Ensure error message is set correctly
            })}
            type="password" // Add type password
            placeholder="Password"
            className="border border-gray-400 py-1 px-2 w-full"
          />
        </div>
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}{" "}
        {/* Confirm Password Input */}
        <div className="mt-5">
          <p className="block text-sm font-medium text-gray-700">
            Confirm Password
          </p>
          <input
            id="passwordConfirm"
            {...register("passwordConfirm", {
              required: "Password Confirm is required", // Ensure error message is set correctly
            })}
            type="password" // Add type password
            placeholder="Confirm password"
            className="border border-gray-400 py-1 px-2 w-full"
          />
        </div>
        {errors.passwordConfirm && ( // Check for passwordConfirm errors
          <p style={{ color: "red" }}>{errors.passwordConfirm.message}</p>
        )}{" "}
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

export default Signup;
