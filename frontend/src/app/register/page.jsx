"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillsOffered: "",
    skillsWanted: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Convert comma-separated input into arrays
      const payload = {
        ...form,
        skillsOffered: form.skillsOffered.split(",").map((s) => s.trim()),
        skillsWanted: form.skillsWanted.split(",").map((s) => s.trim()),
      };

      await api.post("/auth/register", payload);

      setMessage("✅ Registered successfully!");
      
      // Redirect to login after 1s
      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col">
          <label className="mb-2 font-semibold px-2">Name</label>
          <input
            name="name"
            type="text"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="mb-2 font-semibold px-2">Email</label>
          <input
            name="email"
            type="email"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className="mb-2 font-semibold px-2">Password</label>
          <input
            name="password"
            type="password"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label className="mb-2 font-semibold px-2">Skills Offered</label>
          <input
            name="skillsOffered"
            type="text"
            className="border p-2 w-full mb-2 rounded"
            placeholder="e.g. JavaScript, React"
            value={form.skillsOffered}
            onChange={handleChange}
          />

          <label className="mb-2 font-semibold px-2">Skills Wanted</label>
          <input
            name="skillsWanted"
            type="text"
            className="border p-2 w-full mb-2 rounded"
            placeholder="e.g. Python, Django"
            value={form.skillsWanted}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>

        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50 flex items-center">
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="ml-3 font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
