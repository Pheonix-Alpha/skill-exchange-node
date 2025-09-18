"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Skill Exchange
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
