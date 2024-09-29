import React, { useEffect, useState } from "react";
import authApi from "../utils/authApi";
import api from "../utils/normalApi";
import { Link } from "react-router-dom";

const Leetcode = () => {
  const [leetcodes, setLeetcodes] = useState([]); // Original data
  const [filteredLeetcodes, setFilteredLeetcodes] = useState([]); // Filtered data
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("");

  useEffect(() => {
    const fetchAllLeetCode = async () => {
      try {
        const response = await authApi.get("/leetcode/all");
        const { data } = response.data;
        setLeetcodes(data.list);
        setFilteredLeetcodes(data.list); // Set both original and filtered data initially
      } catch (error) {
        console.error("Error fetching Leetcode data", error);
      }
    };

    const fetchAllTopic = async () => {
      try {
        const response = await api.get("/topic/all");
        const { data } = response.data;
        setTopics(data.topics);
      } catch (error) {
        console.error("Error fetching topics", error);
      }
    };

    fetchAllLeetCode();
    fetchAllTopic();
  }, []);

  useEffect(() => {
    const filterLeetcodes = () => {
      const filtered = leetcodes.filter((leetcode) => {
        const matchesDifficulty =
          currentDifficulty === "" || leetcode.difficulty === currentDifficulty;
        const matchesTopic =
          currentTopic === "" ||
          leetcode.topics.map((topic) => topic.slug).includes(currentTopic);

        return matchesDifficulty && matchesTopic;
      });
      setFilteredLeetcodes(filtered);
    };

    filterLeetcodes();
  }, [currentDifficulty, currentTopic, leetcodes]);

  const difficulty = ["easy", "medium", "hard"];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center text-4xl font-bold text-slate-800 w-[80%] my-3">
        <a href="/leetcode">Leetcode-Tracking</a>
      </div>
      <div className="flex justify-end items-center my-3 w-[80%]">
        <Link to={"/leetcode/new"} className="text-left basis-8/10 w-full">
          Add new problem
        </Link>
        <select
          onChange={(e) => setCurrentDifficulty(e.target.value)}
          className="py-3 px-4 m-4 mx-5 pe-9 block basis-2/10 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          <option value="">Difficulty</option>
          {difficulty.map((level) => (
            <option value={level} key={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setCurrentTopic(e.target.value)}
          className="py-3 px-4 pe-9 block basis-2/10 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          <option value="">Topics</option>
          {topics.map((topic) => (
            <option value={topic.slug} key={topic.slug}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
      <table className="w-[70%] mt-6">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="p-3 text-sm">Name</th>
            <th className="p-3 text-sm">Link URL</th>
            <th className="p-3 text-sm">Difficulty</th>
            <th className="p-3 text-sm">Note</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeetcodes.length > 0 ? (
            filteredLeetcodes.map((leetcode) => (
              <tr key={leetcode.slug} className="bg-white border-b">
                <td className="p-3 text-sm font-semibold">
                  <Link to={`/leetcode/${leetcode.slug}`}>{leetcode.name}</Link>
                </td>
                <td className="p-3 text-sm text-center">
                  <a
                    href={leetcode.linkURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-center"
                  >
                    link...
                  </a>
                </td>
                <td className="p-3 text-sm text-center">
                  <span
                    className={`rounded-lg uppercase font-medium p-2 ${
                      leetcode.difficulty === "easy"
                        ? "bg-green-200"
                        : leetcode.difficulty === "medium"
                        ? "bg-yellow-200"
                        : leetcode.difficulty === "hard"
                        ? "bg-red-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {leetcode.difficulty || "N/A"}
                  </span>
                </td>
                <td className="p-3 text-sm text-center overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
                  {leetcode.note || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-sm">
                No Leetcode problems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leetcode;
