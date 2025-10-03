"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LayoutDashboard, MessageSquareText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";

export default function Layout({ children }) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [initials, setInitials] = useState("?");
  const [requests, setRequests] = useState([]);

  const bellRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.name) {
          const nameParts = res.data.name.split(" ");
          const initials = nameParts
            .map((part) => part[0]?.toUpperCase())
            .slice(0, 2)
            .join("");
          setInitials(initials || "?");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch recent requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) return;

        const currentUserId =
          JSON.parse(storedUser).id || JSON.parse(storedUser)._id;

        const res = await axios.get("/exchange/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pending = res.data
          .filter(
            (r) =>
              r.recipient?._id?.toString() === currentUserId.toString() &&
              r.status === "pending"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRequests(pending);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    fetchRequests();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target) &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setBellOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-gray-200">
      {/* Navbar */}
      <nav className="bg-indigo-600 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          Skill Exchange
        </Link>

        {/* Desktop & Mobile Right Menu */}
        <div className="flex items-center gap-4 md:gap-6 relative">
          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-black">
              <LayoutDashboard className="w-6 h-6" />
            </Link>
            <Link href="/message" className="hover:text-black">
              <MessageSquareText className="w-6 h-6" />
            </Link>

            {/* Bell Icon */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => setBellOpen((prev) => !prev)}
                className="hover:text-black relative"
              >
                <Bell className="w-6 h-6" />
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600"></span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md z-50">
                  <div className="p-2">
                    <h4 className="font-semibold mb-2">Recent Requests</h4>
                    {requests.length === 0 ? (
                      <p className="text-gray-500 text-sm">No new requests</p>
                    ) : (
                      <ul className="space-y-2 max-h-60 overflow-y-auto border border-indigo-600 p-1">
                        {requests.map((r) => (
                          <li key={r._id} className="border-b pb-1">
                            <p className="text-sm font-medium">{r.requester.name}</p>
                            <p className="text-xs text-gray-500">
                              Wants: {r.skillWanted} | Offered: {r.skillOffered}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/inbox"
                      className="block mt-2 text-center text-blue-600 hover:text-black"
                      onClick={() => setBellOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Avatar for Desktop */}
          <div ref={avatarRef} className="hidden md:block relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold"
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/session"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Session
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-black text-left px-4 py-2 hover:bg-indigo-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div ref={mobileRef} className="md:hidden relative">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-md z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/message"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/inbox"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Requests
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/session"
                  className="block px-4 py-2 hover:bg-indigo-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Session
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
