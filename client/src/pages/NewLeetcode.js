import React, { useState, useEffect } from "react";
import authApi from "../utils/authApi";
import { useForm } from "react-hook-form";
import api from "../utils/normalApi";
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection
const NewLeetcode = () => {
  const [error, setError] = useState("");
  const [topics, setTopics] = useState([]);
  const [currentTopics, setCurrentTopics] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchAllTopic = async () => {
      try {
        const response = await api.get("/topic/all");
        const { data } = response.data;
        setTopics(data.topics);
      } catch (error) {
        console.error("Error fetching topics", error);
      }
    };

    fetchAllTopic();
  }, []);

  const handleTopic = (e) => {
    const newValue = e.target.value;
    if (newValue && !currentTopics.includes(newValue)) {
      setCurrentTopics((prev) => [...prev, newValue]);
    }
  };

  const removeTopic = (removed) => {
    const newTopics = currentTopics.filter((e) => e !== removed);
    setCurrentTopics(newTopics);
  };

  const onSubmit = async (value) => {
    try {
      const body = {
        name: value.name,
        difficulty: value.difficulty,
        linkUrl: value.linkUrl,
        note: value.note,
        topics: currentTopics.join(","),
      };
      console.log(body);
      await authApi.post("/leetcode/new", body);
      navigate("/leetcode");
    } catch (error) {
      console.log("Catch error");
      if (error.response) {
        // Handle 403 Forbidden specifically
        if (error.response.status === 403) {
          setError(error.response.data.message || "Forbidden request.");
        } else {
          setError(
            error.response.data.message || "An unexpected error occurred."
          );
        }
      } else {
        // Handle any other errors (like network issues)
        setError("An unexpected error occurred. Please try again.");
      }
      console.log("Error:", error.response?.data || error.message);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const difficulty = ["easy", "medium", "hard"];

  return (
    <div className="flex flex-col justify-center items-center p-6 max-w-3xl mx-auto">
      <h1 className="text-center text-4xl font-bold text-slate-800 mb-8 border-b-4 border-gray-300 pb-4">
        New Problem
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full gap-4 mb-6">
          {/* Name Field - 80% */}
          <div className="w-4/5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name:
            </label>
            <input
              placeholder="Enter problem name"
              {...register("name", { required: "Name is required" })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Difficulty Field - 20% */}
          <div className="w-1/5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty:
            </label>
            <select
              {...register("difficulty", {
                required: "Difficulty is required",
              })}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              {difficulty.map((e) => (
                <option key={e} value={e} className="uppercase">
                  {e}
                </option>
              ))}
            </select>
            {errors.difficulty && (
              <p className="text-red-500 mt-2">{errors.difficulty.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link URL:
          </label>
          <input
            placeholder="e.g. https://leetcode.com/problem-url"
            {...register("linkUrl", { required: "Link URL is required" })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.linkUrl && (
            <p className="text-red-500 mt-2">{errors.linkUrl.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics:
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            onClick={(e) => handleTopic(e)}
          >
            <option value="">Select topics</option>
            {topics.map((topic) => (
              <option value={topic.slug} key={topic.slug}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {currentTopics.length > 0 && (
          <div className="flex flex-wrap mb-6">
            {currentTopics.map((topic) => (
              <span
                key={topic}
                className="bg-slate-700 text-white px-2 py-1 rounded-full mx-2 my-1 cursor-pointer hover:bg-slate-600 transition"
                onClick={() => removeTopic(topic)}
              >
                {topic.replaceAll("-", " ")}
              </span>
            ))}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Note:
          </label>
          <textarea
            id="note"
            rows="5"
            className="w-full p-3 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your thoughts here..."
            {...register("note")}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewLeetcode;
