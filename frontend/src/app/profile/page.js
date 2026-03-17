"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { User, Mail, Zap, TrendingUp, Save, Loader2, CheckCircle, X } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
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
          skillsOffered: skillsOffered.split(",").map((s) => s.trim()).filter(Boolean),
          skillsWanted: skillsWanted.split(",").map((s) => s.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Parse skill strings into tag arrays for preview
  const offeredTags = skillsOffered.split(",").map((s) => s.trim()).filter(Boolean);
  const wantedTags = skillsWanted.split(",").map((s) => s.trim()).filter(Boolean);

  const avatarColors = [
    { bg: "#EFF6FF", text: "#2563EB" },
    { bg: "#ECFDF5", text: "#059669" },
    { bg: "#F5F3FF", text: "#7C3AED" },
    { bg: "#FFFBEB", text: "#D97706" },
    { bg: "#FFF1F2", text: "#E11D48" },
  ];
  const av = avatarColors[name.charCodeAt(0) % avatarColors.length] || avatarColors[0];

  return (
    <Layout>
      <div
        className="min-h-screen px-4 sm:px-6 py-10 max-w-2xl mx-auto"
        style={{ background: "#F8FAFC" }}
      >
        {/* ── Header ── */}
        <div className="mb-8">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
            style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
          >
            Profile
          </span>
          <h1 className="text-4xl font-black" style={{ color: "#0F172A" }}>
            Edit Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Update your name and skill preferences.
          </p>
        </div>

        {/* ── Avatar preview ── */}
        <div
          className="flex items-center gap-4 p-5 rounded-2xl mb-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{ background: av.bg, color: av.text }}
          >
            {name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-black text-base" style={{ color: "#0F172A" }}>
              {name || "Your Name"}
            </p>
            <p className="text-sm" style={{ color: "#94A3B8" }}>{email}</p>
          </div>
        </div>

        {/* ── Form card ── */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          {/* Name */}
          <Field
            icon={<User size={14} style={{ color: "#2563EB" }} />}
            label="Full Name"
            accentBg="#EFF6FF"
            accentBorder="#BFDBFE"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0F172A" }}
              onFocus={(e) => (e.target.style.borderColor = "#93C5FD")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
          </Field>

          {/* Email (read-only) */}
          <Field
            icon={<Mail size={14} style={{ color: "#94A3B8" }} />}
            label="Email Address"
            sublabel="Read-only"
            accentBg="#F1F5F9"
            accentBorder="#E2E8F0"
          >
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl text-sm cursor-not-allowed"
              style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#94A3B8" }}
            />
          </Field>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F1F5F9" }} />

          {/* Skills Offered */}
          <Field
            icon={<Zap size={14} style={{ color: "#059669" }} />}
            label="Skills You Offer"
            sublabel="Comma separated"
            accentBg="#ECFDF5"
            accentBorder="#A7F3D0"
          >
            <input
              type="text"
              value={skillsOffered}
              onChange={(e) => setSkillsOffered(e.target.value)}
              placeholder="e.g. React, Python, Figma"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0F172A" }}
              onFocus={(e) => (e.target.style.borderColor = "#6EE7B7")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
            {offeredTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {offeredTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "#ECFDF5", color: "#047857", border: "1px solid #A7F3D0" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Skills Wanted */}
          <Field
            icon={<TrendingUp size={14} style={{ color: "#7C3AED" }} />}
            label="Skills You Want"
            sublabel="Comma separated"
            accentBg="#F5F3FF"
            accentBorder="#DDD6FE"
          >
            <input
              type="text"
              value={skillsWanted}
              onChange={(e) => setSkillsWanted(e.target.value)}
              placeholder="e.g. Node.js, UI Design, SQL"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0F172A" }}
              onFocus={(e) => (e.target.style.borderColor = "#C4B5FD")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
            {wantedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {wantedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "#F5F3FF", color: "#6D28D9", border: "1px solid #DDD6FE" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Field>
        </div>

        {/* ── Save button ── */}
        <button
          onClick={handleSave}
          disabled={loading || saved}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-70"
          style={{
            background: saved ? "#059669" : "#2563EB",
            boxShadow: saved
              ? "0 2px 12px rgba(5,150,105,0.3)"
              : "0 2px 12px rgba(37,99,235,0.3)",
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <CheckCircle size={16} />
          ) : (
            <Save size={16} />
          )}
          {loading ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </Layout>
  );
}

/* ── Field wrapper ── */
function Field({ icon, label, sublabel, accentBg, accentBorder, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        >
          {icon}
        </div>
        <span className="text-sm font-bold" style={{ color: "#0F172A" }}>
          {label}
        </span>
        {sublabel && (
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            · {sublabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}