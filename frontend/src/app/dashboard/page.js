"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import UserCard from "@/components/UserCard";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function DashboardPage() {
  const [skill, setSkill] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [type, setType] = useState("offering");
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState([]);
  const [disabledRequests, setDisabledRequests] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [fetchingMatches, setFetchingMatches] = useState(false);

  const router = useRouter();

  // Hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load disabled requests from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("disabledRequests") || "[]");
    setDisabledRequests(new Set(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "disabledRequests",
      JSON.stringify([...disabledRequests])
    );
  }, [disabledRequests]);

  // Fetch matches after hydration & auth check
  useEffect(() => {
    if (!hydrated) return;

    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const fetchMatches = async () => {
      try {
        setFetchingMatches(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setFetchingMatches(false);
      }
    };

    fetchMatches();
  }, [hydrated, router]);

  const handleSearch = async () => {
    if (!skill.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/search/${skill}?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSent = (userId) => {
    setDisabledRequests((prev) => new Set(prev).add(userId));
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-black text-center sm:text-left">
          Skill Matchmaking
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Enter a skill..."
            className="border p-2 rounded w-full sm:flex-1 text-black"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded w-full text-white bg-indigo-600 sm:w-auto hover:bg-white hover:text-black"
          >
            <option value="offering">Offering</option>
            <option value="wanting">Wanting</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-white hover:text-black w-full sm:w-auto flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
            ) : null}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Suggested Matches */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Suggested Matches</h2>

          {fetchingMatches ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-gray-300 rounded animate-pulse"
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <p className="text-gray-500 text-center sm:text-left">
              No matches found yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {matches.map((user) => (
                <UserCard
                  key={user._id || user.id}
                  user={user}
                  disabledRequests={disabledRequests}
                  onRequestSent={handleRequestSent}
                  isFromMatch={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Search Results */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>

          {results.length === 0 ? (
            <p className="text-gray-500 text-center sm:text-left">
              No users found for this skill.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {results.map((user) => (
                <UserCard
                  key={user._id || user.id}
                  user={user}
                  disabledRequests={disabledRequests}
                  onRequestSent={handleRequestSent}
                  isFromMatch={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
