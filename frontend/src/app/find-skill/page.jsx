"use client";

import { Suspense } from "react"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Users,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Web Development",
  "Graphic Design",
  "Writing",
  "Marketing",
  "Video Editing",
  "Data & Analytics",
  "Music & Audio",
  "Photography",
];

const SORT_OPTIONS = [
  { label: "Best match", value: "match" },
  { label: "Newest", value: "newest" },
  { label: "Most skills", value: "skills" },
];
export default function FindSkillPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FindSkillPageContent />
    </Suspense>
  )
}

function FindSkillPageContent() {
   const searchParams = useSearchParams()

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabledRequests, setDisabledRequests] = useState(new Set());

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("match");
  const [showFilters, setShowFilters] = useState(false);
  const [showMutualOnly, setShowMutualOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/browse", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter + search + sort
  useEffect(() => {
    let result = [...users];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.offeringSkills?.some((s) => s.toLowerCase().includes(q)) ||
          u.wantingSkills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== "All") {
      result = result.filter(
        (u) =>
          u.offeringSkills?.some((s) =>
            s.toLowerCase().includes(activeCategory.toLowerCase())
          ) ||
          u.wantingSkills?.some((s) =>
            s.toLowerCase().includes(activeCategory.toLowerCase())
          )
      );
    }

    if (showMutualOnly && currentUser?.skillsOffered?.length) {
      result = result.filter((u) =>
        u.wantingSkills?.some((s) => currentUser.skillsOffered.includes(s))
      );
    }

    if (sortBy === "newest") {
      result = result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "skills") {
      result = result.sort(
        (a, b) => (b.offeringSkills?.length || 0) - (a.offeringSkills?.length || 0)
      );
    } else {
      result = result.sort((a, b) => {
        const aMatch = isMutualMatch(a) ? 1 : 0;
        const bMatch = isMutualMatch(b) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    setFiltered(result);
  }, [users, query, activeCategory, sortBy, showMutualOnly]);

  const isMutualMatch = (user) =>
    user.wantingSkills?.some((s) => currentUser?.skillsOffered?.includes(s)) &&
    user.offeringSkills?.some((s) => currentUser?.skillsWanted?.includes(s));

  const handleRequestSent = (id) => {
    setDisabledRequests((prev) => new Set([...prev, id]));
  };

  const mutualMatches = filtered.filter(isMutualMatch);
  const others = filtered.filter((u) => !isMutualMatch(u));

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="pt-28 pb-8 px-6 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                Discover
              </p>
              <h1
                className="text-4xl md:text-5xl font-black text-white leading-tight"
               
              >
                Find a skill
              </h1>
              {!loading && (
                <p className="text-white/30 text-sm mt-2">
                  {filtered.length} people found
                  {mutualMatches.length > 0 && (
                    <span className="ml-2 text-[#4F8EF7]">
                      · {mutualMatches.length} mutual match
                      {mutualMatches.length !== 1 ? "es" : ""}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Search + Filter toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-80 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all">
                <Search size={15} className="text-white/30 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills or people..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X size={14} className="text-white/30 hover:text-white transition-colors" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters((p) => !p)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all whitespace-nowrap ${
                  showFilters
                    ? "bg-[#4F8EF7] border-[#4F8EF7] text-white"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              {/* Mutual match toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setShowMutualOnly((p) => !p)}
                  className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${
                    showMutualOnly ? "bg-[#4F8EF7]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      showMutualOnly ? "left-5" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-white/50 text-sm group-hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#4F8EF7]" />
                  Mutual matches only
                </span>
              </label>

              <div className="w-px h-5 bg-white/5 hidden sm:block" />

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((p) => !p)}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
                >
                  Sort:{" "}
                  <span className="text-white font-medium">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown size={13} />
                </button>
                {sortOpen && (
                  <div className="absolute top-8 left-0 bg-[#111118] border border-white/10 rounded-xl overflow-hidden z-20 min-w-[160px] shadow-xl">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === opt.value
                            ? "text-[#4F8EF7] bg-[#4F8EF7]/10"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile category chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto mt-5 pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-[#4F8EF7] border-[#4F8EF7] text-white"
                    : "border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex gap-8">

        {/* Category sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0 self-start sticky top-24">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-3 px-3">
            Categories
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/20"
                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              query={query}
              onClear={() => {
                setQuery("");
                setActiveCategory("All");
                setShowMutualOnly(false);
              }}
            />
          ) : (
            <div className="space-y-10">

              {/* Mutual matches section */}
              {mutualMatches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-[#4F8EF7]" />
                    <h2 className="text-white/60 text-xs font-black uppercase tracking-widest">
                      Mutual matches
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] text-[10px] font-bold">
                      {mutualMatches.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {mutualMatches.map((user) => (
                      <UserCard
                        key={user.id || user._id}
                        user={user}
                        disabledRequests={disabledRequests}
                        onRequestSent={handleRequestSent}
                        isFromMatch={true}
                        isMutual={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Everyone else */}
              {others.length > 0 && (
                <div>
                  {mutualMatches.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={14} className="text-white/30" />
                      <h2 className="text-white/40 text-xs font-black uppercase tracking-widest">
                        All people
                      </h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {others.map((user) => (
                      <UserCard
                        key={user.id || user._id}
                        user={user}
                        disabledRequests={disabledRequests}
                        onRequestSent={handleRequestSent}
                        isFromMatch={false}
                        isMutual={false}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}

// ── Loading skeleton ──
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
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
            <div className="w-14 h-2 bg-white/5 rounded-full mt-2" />
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

// ── Empty state ──
function EmptyState({ query, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-5">
        <Search size={24} className="text-white/20" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">No results found</h3>
      <p className="text-white/30 text-sm mb-6 max-w-xs">
        {query
          ? `No one matched "${query}". Try a different skill or clear your filters.`
          : "No people match your current filters."}
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] text-sm font-semibold rounded-xl hover:bg-[#4F8EF7] hover:text-white transition-all"
      >
        Clear filters
      </button>
    </div>
  );
}