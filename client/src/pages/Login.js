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

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const responseData = response.data;
      console.log(responseData)

      

      if (responseData.success === true) {
        const { token, data } = responseData; // Destructure user correctly
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data as a string

        // Redirect to the home page or desired route
        navigate("/"); // Use navigate instead of redirect
      } else {
        setError(responseData.message);
        navigate("/log-in"); // Fixed redirect path
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again."; 
      setError(errorMessage); 
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}{" "}
        {/* Email error message */}
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
          placeholder="Password"
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}{" "}
        {/* Password error message */}
        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;
