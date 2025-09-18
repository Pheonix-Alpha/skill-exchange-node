"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
    const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/login", form);

      // Save token (simple version)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Login successful!");

     setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold px-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="mb-2 font-semibold px-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="border p-2 w-full mb-4 rounded"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            Login
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
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
