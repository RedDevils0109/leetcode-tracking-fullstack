import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for query parameters
    const query = new URLSearchParams(location.search);
    const auth = query.get("auth"); 
    const token = query.get("token"); 
    const name = query.get("name"); 
    const image = query.get("image"); 
    const email = query.get("email"); 

    if (auth === "true" && token) {
      // Create user data object
      const userData = {
        name: name,
        image: image,
        email: email,
      };

      // Store the token and user data in localStorage
   
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data as a JSON string

      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location.search, navigate]);

  return <></>;
};

export default GoogleAuthCallback;
