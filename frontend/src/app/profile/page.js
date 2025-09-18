"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // read-only
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.name);
        setEmail(res.data.email);
        setSkillsOffered(res.data.skillsOffered.join(", "));
        setSkillsWanted(res.data.skillsWanted.join(", "));
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/profile-edit",
        {
          name,
          skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
          skillsWanted: skillsWanted.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

        <label className="block mb-4">
          <span className="font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Email (read-only)</span>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full border p-2 rounded bg-gray-100"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Skills Offered (comma separated)</span>
          <input
            type="text"
            value={skillsOffered}
            onChange={(e) => setSkillsOffered(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-6">
          <span className="font-medium">Skills Wanted (comma separated)</span>
          <input
            type="text"
            value={skillsWanted}
            onChange={(e) => setSkillsWanted(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Layout>
  );
}
