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
  const [currentUser, setCurrentUser] = useState(null);

  const router = useRouter();

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
    {
      label: "Suggested matches",
      value: matches.length,
      icon: Sparkles,
      accent: "#3B6FE8",
      bg: "#EEF3FF",
      border: "#D6E2FF",
      textColor: "#3B6FE8",
    },
    {
      label: "Skills you offer",
      value: currentUser?.skillsOffered?.length || 0,
      icon: Zap,
      accent: "#0EA67A",
      bg: "#E8F8F3",
      border: "#C0ECD9",
      textColor: "#0EA67A",
    },
    {
      label: "Skills you want",
      value: currentUser?.skillsWanted?.length || 0,
      icon: TrendingUp,
      accent: "#7C4DDA",
      bg: "#F3EEFF",
      border: "#DDD0F8",
      textColor: "#7C4DDA",
    },
    {
      label: "Requests sent",
      value: disabledRequests.size,
      icon: Users,
      accent: "#D97706",
      bg: "#FEF9EC",
      border: "#FDE8A4",
      textColor: "#D97706",
    },
  ];

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #F7F6F3;
          font-family: 'DM Sans', sans-serif;
          color: #1A1A22;
        }

        .dash-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        /* ── Header ── */
        .dash-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3B6FE8;
          margin-bottom: 8px;
        }

        .dash-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          color: #1A1A22;
          margin: 0 0 6px;
        }

        .dash-title span {
          color: #BDBDBD;
          font-style: italic;
          font-weight: 400;
        }

        .dash-subtitle {
          font-size: 14px;
          color: #8B8B9A;
          margin: 0 0 40px;
        }

        /* ── Stats ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }

        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .stat-card {
          background: #fff;
          border: 1.5px solid #EBEBEB;
          border-radius: 16px;
          padding: 18px;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .stat-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.07);
          transform: translateY(-1px);
        }

        .stat-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .stat-value {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          color: #1A1A22;
        }

        .stat-label {
          font-size: 12px;
          color: #9B9BAD;
          margin-top: 4px;
        }

        /* ── Search ── */
        .search-box {
          background: #fff;
          border: 1.5px solid #EBEBEB;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 48px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .search-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #BDBDBD;
          margin-bottom: 14px;
        }

        .search-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (min-width: 640px) {
          .search-row { flex-direction: row; }
        }

        .search-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F7F6F3;
          border: 1.5px solid #E8E8E8;
          border-radius: 12px;
          padding: 11px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input-wrap:focus-within {
          border-color: #3B6FE8;
          box-shadow: 0 0 0 3px rgba(59,111,232,0.1);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1A1A22;
        }

        .search-input::placeholder { color: #C0C0CA; }

        /* Dropdown */
        .dropdown-wrapper { position: relative; }

        .dropdown-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          background: #F7F6F3;
          border: 1.5px solid #E8E8E8;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #444455;
          cursor: pointer;
          transition: border-color 0.2s;
          white-space: nowrap;
        }

        .dropdown-btn:hover { border-color: #C0C0CA; }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-green { background: #0EA67A; }
        .dot-blue  { background: #3B6FE8; }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: #fff;
          border: 1.5px solid #EBEBEB;
          border-radius: 14px;
          overflow: hidden;
          z-index: 20;
          min-width: 150px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 11px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: transparent;
          color: #444455;
        }

        .dropdown-item:hover { background: #F7F6F3; }
        .dropdown-item.active { background: #F0F4FF; color: #3B6FE8; font-weight: 500; }

        /* Search button */
        .search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 22px;
          background: #1A1A22;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .search-btn:hover { background: #2E2E3A; transform: translateY(-1px); }
        .search-btn:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }

        /* ── Section header ── */
        .section-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9B9BAD;
        }

        .section-badge {
          padding: 2px 8px;
          border-radius: 99px;
          background: #F0F0F5;
          border: 1px solid #E0E0EA;
          font-size: 10.5px;
          font-weight: 700;
          color: #7070859;
          color: #70708A;
        }

        .section-badge-blue {
          background: #EEF3FF;
          border-color: #D6E2FF;
          color: #3B6FE8;
        }

        /* ── Cards grid ── */
        .cards-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px)  { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .cards-grid { grid-template-columns: repeat(3, 1fr); } }

        /* ── Empty state ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          text-align: center;
          background: #fff;
          border: 1.5px dashed #E0E0EA;
          border-radius: 20px;
        }

        .empty-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: #F4F4F8;
          border: 1.5px solid #EAEAF0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .empty-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: #1A1A22;
          margin: 0 0 6px;
        }

        .empty-desc {
          font-size: 13.5px;
          color: #9B9BAD;
          max-width: 260px;
          line-height: 1.5;
          margin: 0;
        }

        /* ── Skeleton ── */
        .skeleton-card {
          background: #fff;
          border: 1.5px solid #EBEBEB;
          border-radius: 20px;
          padding: 20px;
        }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .shimmer {
          background: linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }

        section { margin-bottom: 48px; }
      `}</style>

      <div className="dash-root">
        <div className="dash-inner">

          {/* ── Header ── */}
          <div>
            <p className="dash-eyebrow">Dashboard</p>
            <h1 className="dash-title">
              Welcome back
              {currentUser?.name && (
                <span>, {currentUser.name.split(" ")[0]}</span>
              )}
            </h1>
            <p className="dash-subtitle">Here are your skill matches and search tools.</p>
          </div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="stat-card">
                  <div
                    className="stat-icon-wrap"
                    style={{ background: s.bg, border: `1.5px solid ${s.border}` }}
                  >
                    <Icon size={15} style={{ color: s.accent }} />
                  </div>
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-label">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Search ── */}
          <div className="search-box">
            <p className="search-label">Search by skill</p>
            <div className="search-row">

              <div className="search-input-wrap">
                <Search size={15} color="#C0C0CA" />
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. React, Python, Figma..."
                  className="search-input"
                />
              </div>

              <div className="dropdown-wrapper">
                <button className="dropdown-btn" onClick={() => setTypeOpen((p) => !p)}>
                  <span className={`dot ${type === "offering" ? "dot-green" : "dot-blue"}`} />
                  {type === "offering" ? "Offering" : "Wanting"}
                  <ChevronDown size={13} />
                </button>
                {typeOpen && (
                  <div className="dropdown-menu">
                    {["offering", "wanting"].map((opt) => (
                      <button
                        key={opt}
                        className={`dropdown-item ${type === opt ? "active" : ""}`}
                        onClick={() => { setType(opt); setTypeOpen(false); }}
                      >
                        <span className={`dot ${opt === "offering" ? "dot-green" : "dot-blue"}`} />
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="search-btn" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <span style={{
                    width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite", display: "inline-block"
                  }} />
                ) : (
                  <>Search <ArrowRight size={15} /></>
                )}
              </button>
            </div>
          </div>

          {/* ── Suggested Matches ── */}
          <section>
            <div className="section-head">
              <Sparkles size={14} color="#3B6FE8" />
              <span className="section-title">Suggested matches</span>
              {!fetchingMatches && matches.length > 0 && (
                <span className="section-badge section-badge-blue">{matches.length}</span>
              )}
            </div>

            {fetchingMatches ? (
              <LoadingSkeleton />
            ) : matches.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={20} color="#C0C0CA" />}
                title="No matches yet"
                desc="Add more skills to your profile to unlock better matches."
              />
            ) : (
              <div className="cards-grid">
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
            <section>
              <div className="section-head">
                <Search size={14} color="#9B9BAD" />
                <span className="section-title">Search results</span>
                {!loading && (
                  <span className="section-badge">{results.length}</span>
                )}
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : results.length === 0 ? (
                <EmptyState
                  icon={<Search size={20} color="#C0C0CA" />}
                  title={`No results for "${skill}"`}
                  desc="Try a different skill name or switch between offering and wanting."
                />
              ) : (
                <div className="cards-grid">
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
      </div>
    </Layout>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div className="shimmer" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <div className="shimmer" style={{ width: "60%", height: 12, marginBottom: 6 }} />
              <div className="shimmer" style={{ width: "40%", height: 10 }} />
            </div>
          </div>
          <div className="shimmer" style={{ width: "30%", height: 10, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <div className="shimmer" style={{ width: 60, height: 22, borderRadius: 8 }} />
            <div className="shimmer" style={{ width: 80, height: 22, borderRadius: 8 }} />
          </div>
          <div className="shimmer" style={{ width: "30%", height: 10, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <div className="shimmer" style={{ width: 55, height: 22, borderRadius: 8 }} />
            <div className="shimmer" style={{ width: 70, height: 22, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{desc}</p>
    </div>
  );
}