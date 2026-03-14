"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  MessageSquareText,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  Inbox,
} from "lucide-react";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
});
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [initials, setInitials] = useState("?");
  const [userName, setUserName] = useState("");
  const [requests, setRequests] = useState([]);

  const bellRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/message", label: "Messages", icon: MessageSquareText },
    { href: "/inbox", label: "Requests", icon: Inbox },
    { href: "/session", label: "Sessions", icon: Calendar },
  ];

  const isActive = (href) => pathname === href;

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
          setUserName(res.data.name);
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
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
   <div className={`${syne.className} min-h-screen bg-[#0A0A0F]`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
                <span className="text-white font-black text-sm">SE</span>
              </div>
              <span
                className="text-white font-bold text-lg hidden sm:block group-hover:text-[#4F8EF7] transition-colors"
               
              >
                Skill Exchange
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Bell Icon - Desktop */}
              <div ref={bellRef} className="relative hidden md:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBellOpen((prev) => !prev);
                  }}
                  className={`relative p-2 rounded-xl transition-all ${
                    bellOpen
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Bell size={18} />
                  {requests.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0A0A0F]" />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-bold text-sm">Notifications</h4>
                        {requests.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold">
                            {requests.length} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {requests.length === 0 ? (
                        <div className="p-6 text-center">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <Bell size={16} className="text-white/20" />
                          </div>
                          <p className="text-white/30 text-sm">No new requests</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {requests.map((r) => (
                            <div
                              key={r._id}
                              className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 flex items-center justify-center shrink-0">
                                  <span className="text-[#4F8EF7] text-xs font-bold">
                                    {r.requester.name?.[0]?.toUpperCase() || "?"}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {r.requester.name}
                                  </p>
                                  <p className="text-white/30 text-xs mt-0.5">
                                    Wants <span className="text-[#4F8EF7]">{r.skillWanted}</span> · Offers{" "}
                                    <span className="text-emerald-400">{r.skillOffered}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <Link
                        href="/inbox"
                        onClick={() => setBellOpen(false)}
                        className="block w-full text-center py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
                      >
                        View all requests
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar Dropdown - Desktop */}
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                  }}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all ${
                    menuOpen
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{initials}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-white/40 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{initials}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm truncate">{userName || "User"}</p>
                          <p className="text-white/30 text-xs">View profile</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User size={16} />
                        <span className="text-sm">Profile</span>
                      </Link>
                      <Link
                        href="/session"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Calendar size={16} />
                        <span className="text-sm">Sessions</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-white/5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div ref={mobileRef} className="md:hidden relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen((prev) => !prev);
                  }}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{initials}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm truncate">{userName || "User"}</p>
                          <p className="text-white/30 text-xs">
                            {requests.length > 0 ? `${requests.length} pending requests` : "No new notifications"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              active
                                ? "bg-[#4F8EF7]/10 text-[#4F8EF7]"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <Icon size={16} />
                            <span className="text-sm">{link.label}</span>
                            {link.href === "/inbox" && requests.length > 0 && (
                              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold">
                                {requests.length}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Profile & Logout */}
                    <div className="p-2 border-t border-white/5">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User size={16} />
                        <span className="text-sm">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>{children}</main>

     
    </div>
  );
}
