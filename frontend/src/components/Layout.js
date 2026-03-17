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
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
          const parts = res.data.name.split(" ");
          setInitials(parts.map((p) => p[0]?.toUpperCase()).slice(0, 2).join("") || "?");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileMenuOpen(false);
    };
   document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  };

  return (
    <div className={`${dmSans.className} min-h-screen`} style={{ background: "#F8FAFC" }}>
      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
                style={{ background: "#2563EB" }}
              >
                SE
              </div>
              <span className="font-bold text-lg hidden sm:block" style={{ color: "#0F172A" }}>
                Skill<span style={{ color: "#2563EB" }}>Exchange</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: active ? "#EFF6FF" : "transparent",
                      color: active ? "#2563EB" : "#64748B",
                      border: `1px solid ${active ? "#BFDBFE" : "transparent"}`,
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#0F172A"; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; } }}
                  >
                    <Icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

              {/* Bell */}
              <div ref={bellRef} className="relative hidden md:block">
                <button
                  onClick={(e) => { e.stopPropagation(); setBellOpen((p) => !p); }}
                  className="relative p-2 rounded-xl transition-all"
                  style={{ color: "#94A3B8", background: bellOpen ? "#F1F5F9" : "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                  onMouseLeave={(e) => { if (!bellOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
                >
                  <Bell size={18} />
                  {requests.length > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: "#EF4444", outline: "2px solid #fff" }}
                    />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden" style={dropdownStyle}>
                    <div className="p-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm" style={{ color: "#0F172A" }}>Notifications</h4>
                        {requests.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}>
                            {requests.length} new
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {requests.length === 0 ? (
                        <div className="p-6 text-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <Bell size={16} style={{ color: "#CBD5E1" }} />
                          </div>
                          <p className="text-sm" style={{ color: "#94A3B8" }}>No new requests</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {requests.map((r) => (
                            <div
                              key={r._id}
                              className="p-3 rounded-xl cursor-pointer transition-colors"
                              onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                                  <span className="text-xs font-bold" style={{ color: "#2563EB" }}>{r.requester.name?.[0]?.toUpperCase() || "?"}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold truncate" style={{ color: "#0F172A" }}>{r.requester.name}</p>
                                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                                    Wants <span style={{ color: "#2563EB" }}>{r.skillWanted}</span> · Offers <span style={{ color: "#059669" }}>{r.skillOffered}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                      <Link
                        href="/inbox"
                        onClick={() => setBellOpen(false)}
                        className="block w-full text-center py-2 px-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "#F8FAFC", color: "#475569", border: "1px solid #E2E8F0" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#475569"; }}
                      >
                        View all requests
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar Dropdown */}
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
                  style={{ background: menuOpen ? "#F1F5F9" : "transparent", border: `1px solid ${menuOpen ? "#E2E8F0" : "transparent"}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  onMouseLeave={(e) => { if (!menuOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
                    {initials}
                  </div>
                  <span className="text-sm font-semibold hidden lg:block" style={{ color: "#0F172A" }}>
                    {userName?.split(" ")[0] || "Account"}
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#94A3B8" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden" style={dropdownStyle}>
                    <div className="p-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: "#0F172A" }}>{userName || "User"}</p>
                          <p className="text-xs" style={{ color: "#94A3B8" }}>View profile</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {[{ href: "/profile", icon: User, label: "Profile" }, { href: "/session", icon: Calendar, label: "Sessions" }].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                          style={{ color: "#475569" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#0F172A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                        >
                          <item.icon size={15} />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="p-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        style={{ color: "#EF4444" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <div ref={mobileRef} className="md:hidden relative">
                <button
                  onClick={() => setMobileMenuOpen((p) => !p)}
                  className="p-2 rounded-xl transition-all"
                  style={{ color: "#64748B", background: mobileMenuOpen ? "#F1F5F9" : "transparent" }}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden" style={dropdownStyle}>
                    <div className="p-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#0F172A" }}>{userName || "User"}</p>
                          <p className="text-xs" style={{ color: "#94A3B8" }}>
                            {requests.length > 0 ? `${requests.length} pending requests` : "No new notifications"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: active ? "#EFF6FF" : "transparent", color: active ? "#2563EB" : "#64748B" }}
                          >
                            <Icon size={15} />
                            {link.label}
                            {link.href === "/inbox" && requests.length > 0 && (
                              <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FEF2F2", color: "#EF4444" }}>
                                {requests.length}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="p-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                        style={{ color: "#475569" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#0F172A"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                      >
                        <User size={15} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium"
                        style={{ color: "#EF4444" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <LogOut size={15} />
                        Logout
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