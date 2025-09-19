"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [initials, setInitials] = useState("?");
  const [requests, setRequests] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Fetch user profile on mount
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

  // Fetch recent requests for Bell
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) return;

        const currentUserId = JSON.parse(storedUser).id || JSON.parse(storedUser)._id;

        const res = await axios.get("/exchange/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pending = res.data
          .filter(
            r => r.recipient?._id?.toString() === currentUserId.toString() &&
                 r.status === "pending"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5); // show latest 5
        setRequests(pending);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Skill Exchange
        </Link>

        <div className="flex items-center gap-6 relative">
          {/* Dashboard Icon */}
          <Link href="/dashboard" className="hover:text-blue-600">
            <LayoutDashboard className="w-6 h-6" />
          </Link>

          {/* Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setBellOpen(prev => !prev)}
              className="hover:text-blue-600 relative"
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
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {requests.map(r => (
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
                    className="block mt-2 text-center text-blue-600 hover:underline"
                    onClick={() => setBellOpen(false)}
                  >
                    View All
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/session"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Session
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
