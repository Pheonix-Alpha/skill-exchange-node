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
  <div className="h-screen flex">
    {/* Left: Register Form */}
    <div className="flex-1 flex items-center justify-center bg-gray-200 p-6">
      <div className="bg-white p-6 md:pb-10 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold m-4 text-center text-[#6358DC]">
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col space-y-3">
          {/* Name */}
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
          />

          {/* Skills Offered */}
          <input
            name="skillsOffered"
            type="text"
            value={form.skillsOffered}
            onChange={handleChange}
            placeholder="Skills Offered (e.g. JavaScript, React)"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
          />

          {/* Skills Wanted */}
          <input
            name="skillsWanted"
            type="text"
            value={form.skillsWanted}
            onChange={handleChange}
            placeholder="Skills Wanted (e.g. Python, Django)"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
          />

          <button
            type="submit"
            className="bg-[#6358DC] text-white px-4 py-2 rounded hover:bg-[#4e47b3] transition"
          >
            Register
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded shadow-md z-50 flex items-center">
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="ml-3 font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Login Link */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#6358DC] hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>

    {/* Right: Image (hidden on mobile) */}
    <div className="hidden md:flex md:flex-1">
      <div className="p-20">
        <img
          src="/login-image.jpg"
          alt="Register illustration"
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  </div>
);


}
