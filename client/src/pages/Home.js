import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-[80vh] flex flex-col justify-center items-center">
      <p className="text-4xl font-bold py-4">Welcome Home</p>
      <button
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 hover:opacity-50"
      >
        <Link to={"/leetcode"}>See your leetcode - tracking</Link>
      </button>
    </div>
  );
};

export default Home;
