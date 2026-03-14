"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import UserCard from "@/components/UserCard";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import {
  Search,
  Sparkles,
  ArrowRight,
  Users,
  Zap,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

export default function DashboardPage() {
  const [skill, setSkill] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [type, setType] = useState("offering");
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState([]);
  const [disabledRequests, setDisabledRequests] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [fetchingMatches, setFetchingMatches] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  const router = useRouter();

 const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  setCurrentUser(user);
}, []);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("disabledRequests") || "[]");
    setDisabledRequests(new Set(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("disabledRequests", JSON.stringify([...disabledRequests]));
  }, [disabledRequests]);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn()) { router.push("/login"); return; }

    const fetchMatches = async () => {
      try {
        setFetchingMatches(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setFetchingMatches(false);
      }
    };

    fetchMatches();
  }, [hydrated, router]);

  const handleSearch = async () => {
    if (!skill.trim()) { setResults([]); setSearched(false); return; }
    try {
      setLoading(true);
      setSearched(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/search/${skill}?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSent = (userId) => {
    setDisabledRequests((prev) => new Set(prev).add(userId));
  };

  const stats = [
    { label: "Suggested matches", value: matches.length, icon: Sparkles, color: "text-[#4F8EF7]", bg: "bg-[#4F8EF7]/10", border: "border-[#4F8EF7]/20" },
    { label: "Skills you offer", value: currentUser?.skillsOffered?.length || 0, icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Skills you want", value: currentUser?.skillsWanted?.length || 0, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Requests sent", value: disabledRequests.size, icon: Users, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0A0F] px-4 sm:px-6 py-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-2">Dashboard</p>
          <h1
            className="text-4xl md:text-5xl font-black text-white leading-tight"
          
          >
            Welcome back
           {currentUser?.name && (
  <span className="text-white/30">, {currentUser.name.split(" ")[0]}</span>
)}
          </h1>
          <p className="text-white/30 text-sm mt-2">Here are your skill matches and search tools.</p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`p-4 rounded-2xl border ${s.border} bg-white/[0.02]`}>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                  <Icon size={15} className={s.color} />
                </div>
                <p className="text-white font-black text-2xl leading-none">{s.value}</p>
                <p className="text-white/30 text-xs mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Search bar ── */}
        <div className="mb-12 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4">
            Search by skill
          </p>
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Skill input */}
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all">
              <Search size={15} className="text-white/20 shrink-0" />
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. React, Python, Figma..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
              />
            </div>

            {/* Type dropdown */}
            <div className="relative">
              <button
                onClick={() => setTypeOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-all w-full sm:w-auto whitespace-nowrap"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${type === "offering" ? "bg-emerald-400" : "bg-[#4F8EF7]"}`} />
                {type === "offering" ? "Offering" : "Wanting"}
                <ChevronDown size={13} />
              </button>
              {typeOpen && (
                <div className="absolute top-12 right-0 bg-[#111118] border border-white/10 rounded-xl overflow-hidden z-20 min-w-[140px] shadow-xl">
                  {["offering", "wanting"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setType(opt); setTypeOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                        type === opt ? "text-white bg-white/5" : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${opt === "offering" ? "bg-emerald-400" : "bg-[#4F8EF7]"}`} />
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4F8EF7] hover:bg-[#3a7be8] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 whitespace-nowrap"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Search
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Suggested Matches ── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={15} className="text-[#4F8EF7]" />
            <h2 className="text-white/60 text-xs font-black uppercase tracking-widest">
              Suggested matches
            </h2>
            {!fetchingMatches && matches.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] text-[10px] font-bold">
                {matches.length}
              </span>
            )}
          </div>

          {fetchingMatches ? (
            <LoadingSkeleton />
          ) : matches.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={22} className="text-white/20" />}
              title="No matches yet"
              desc="Add more skills to your profile to unlock better matches."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((user) => (
                <UserCard
                  key={user._id || user.id}
                  user={user}
                  disabledRequests={disabledRequests}
                  onRequestSent={handleRequestSent}
                  isFromMatch={true}
                  isMutual={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Search Results ── */}
        {searched && (
          <section className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <Search size={15} className="text-white/30" />
              <h2 className="text-white/60 text-xs font-black uppercase tracking-widest">
                Search results
              </h2>
              {!loading && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold">
                  {results.length}
                </span>
              )}
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : results.length === 0 ? (
              <EmptyState
                icon={<Search size={22} className="text-white/20" />}
                title={`No results for "${skill}"`}
                desc="Try a different skill name or switch between offering and wanting."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((user) => (
                  <UserCard
                    key={user._id || user.id}
                    user={user}
                    disabledRequests={disabledRequests}
                    onRequestSent={handleRequestSent}
                    isFromMatch={false}
                    isMutual={false}
                  />
                ))}
              </div>
            )}
          </section>
        )}

      </div>

     
    </Layout>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array(3).fill(0).map((_, i) => (
        <div
          key={i}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5" />
              <div className="space-y-1.5">
                <div className="w-24 h-3 bg-white/5 rounded-full" />
                <div className="w-16 h-2.5 bg-white/5 rounded-full" />
              </div>
            </div>
            <div className="w-20 h-7 rounded-xl bg-white/5" />
          </div>
          <div className="space-y-3">
            <div className="w-14 h-2 bg-white/5 rounded-full" />
            <div className="flex gap-1.5">
              <div className="w-16 h-5 rounded-lg bg-white/5" />
              <div className="w-20 h-5 rounded-lg bg-white/5" />
            </div>
            <div className="w-14 h-2 bg-white/5 rounded-full mt-1" />
            <div className="flex gap-1.5">
              <div className="w-14 h-5 rounded-lg bg-white/5" />
              <div className="w-18 h-5 rounded-lg bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-white/5 rounded-2xl bg-white/[0.01]">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-white font-bold text-base mb-1">{title}</h3>
      <p className="text-white/30 text-sm max-w-xs">{desc}</p>
    </div>
  );
}