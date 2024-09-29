import React, { useEffect, useState } from "react";
import authApi from "../utils/authApi";

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authApi.get("/user/profile");
        const { data } = response.data; // Access the correct data structure
        console.log(data);
        setUser(data.user); // Correctly set the user state with the fetched data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col h-[80vh] justify-center items-center">
      <div
        className="w-20 h-20 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${user.image})` }}
      ></div>

      <h1>Name : {user.name}</h1>
      <h1>Email : {user.email}</h1>
    </div>
  );
};

export default Profile;
