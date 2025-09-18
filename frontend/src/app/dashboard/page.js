"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import UserCard from "@/components/UserCard";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function DashboardPage() {
  const [skill, setSkill] = useState("");
  const [type, setType] = useState("offering");
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState([]);

   const router = useRouter();

  // Fetch suggested matches on load
  useEffect(() => {
      if (!isLoggedIn()) {
      router.push("/login"); // redirect to login if not authenticated
    }
    
    const fetchMatches = async () => {
      try {
        const res = await axios.get("/matches"); // backend should have /matches
        setMatches(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, []);

  // Search handler
 const handleSearch = async () => {
  if (!skill.trim()) return;
  setLoading(true);
  try {
    const res = await api.get(`/search/${skill}?type=${type}`);
    setResults(res.data || []);
  } catch (err) {
    console.error("Error searching users:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout>
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Skill Matchmaking
      </h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter a skill..."
          className="border p-2 rounded w-full sm:flex-1"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="offering">Offering</option>
          <option value="wanting">Wanting</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Suggested Matches */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Suggested Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500">No matches found yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>

      {/* Search Results */}
      <section className="mb-20">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No users found for this skill.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>
    </div>
    </Layout>
  );
}
