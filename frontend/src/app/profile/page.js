"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/hooks/usetoaster";
import { User, Mail, Zap, TrendingUp, Save, Loader2, CheckCircle, X } from "lucide-react";

/* ── Validation ── */
function validateName(v) {
  if (!v.trim()) return "Name is required";
  if (v.trim().length < 2) return "Must be at least 2 characters";
  return null;
}
function validateSkills(v, label) {
  if (!v.trim()) return `${label} cannot be empty`;
  const tags = v.split(",").map((s) => s.trim()).filter(Boolean);
  if (tags.length === 0) return "Add at least one skill";
  if (tags.some((t) => t.length > 40)) return "Each skill must be under 40 characters";
  return null;
}

function FieldSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-1.5">
      <div className="w-28 h-3 rounded-full" style={{ background: "#E2E8F0" }} />
      <div className="w-full h-11 rounded-xl" style={{ background: "#F1F5F9" }} />
    </div>
  );
}

function Field({ label, icon, hint, error, accentColor, children }) {
  const hasError = Boolean(error);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>
          <span style={{ color: accentColor || "#94A3B8" }}>{icon}</span>
          {label}
        </label>
        {hint && !hasError && (
          <span className="text-[10px]" style={{ color: "#CBD5E1" }}>{hint}</span>
        )}
        {hasError && (
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#E11D48" }}>
            <X size={10} />{error}
          </span>
        )}
      </div>
      <div
        className="flex items-center px-4 py-3 rounded-xl"
        style={{
          background: "#F8FAFC",
          border: `1.5px solid ${hasError ? "#FECDD3" : "#E2E8F0"}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/profile", { headers: { Authorization: `Bearer ${token}` } });
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setSkillsOffered((res.data.skillsOffered || []).join(", "));
        setSkillsWanted((res.data.skillsWanted || []).join(", "));
      } catch {
        toast({ message: "Failed to load profile", type: "error" });
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [router]);

  const validate = (overrides = {}) => {
    const n = overrides.name ?? name;
    const so = overrides.skillsOffered ?? skillsOffered;
    const sw = overrides.skillsWanted ?? skillsWanted;
    const errs = {};
    const ne = validateName(n); if (ne) errs.name = ne;
    const oe = validateSkills(so, "Skills offered"); if (oe) errs.skillsOffered = oe;
    const we = validateSkills(sw, "Skills wanted"); if (we) errs.skillsWanted = we;
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validate());
  };

  const handleSave = async () => {
    setTouched({ name: true, skillsOffered: true, skillsWanted: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({ message: "Please fix the errors before saving", type: "warning" });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/profile-edit",
        {
          name: name.trim(),
          skillsOffered: skillsOffered.split(",").map((s) => s.trim()).filter(Boolean),
          skillsWanted: skillsWanted.split(",").map((s) => s.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      toast({ message: "Profile updated successfully!", type: "success" });
      setTimeout(() => { setSaved(false); router.push("/dashboard"); }, 1500);
    } catch {
      toast({ message: "Failed to update profile. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const offeredTags = skillsOffered.split(",").map((s) => s.trim()).filter(Boolean);
  const wantedTags = skillsWanted.split(",").map((s) => s.trim()).filter(Boolean);

  const avatarColors = [
    { bg: "#EFF6FF", text: "#2563EB" },
    { bg: "#ECFDF5", text: "#059669" },
    { bg: "#F5F3FF", text: "#7C3AED" },
    { bg: "#FFFBEB", text: "#D97706" },
    { bg: "#FFF1F2", text: "#E11D48" },
  ];
  const av = avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <Layout>
      <div className="min-h-screen px-4 sm:px-6 py-10" style={{ background: "#F8FAFC" }}>
        <div className="max-w-xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full"
              style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
            >
              Account
            </span>
            <h1 className="text-4xl font-black" style={{ color: "#0F172A" }}>Edit Profile</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>Update your name and skill preferences.</p>
          </div>

          {/* Avatar card */}
          <div
            className="flex items-center gap-4 p-5 rounded-2xl mb-6"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            {fetching ? (
              <>
                <div className="w-14 h-14 rounded-2xl animate-pulse flex-shrink-0" style={{ background: "#F1F5F9" }} />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-32 h-3.5 rounded-full animate-pulse" style={{ background: "#F1F5F9" }} />
                  <div className="w-44 h-3 rounded-full animate-pulse" style={{ background: "#F1F5F9" }} />
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
                  style={{ background: av.bg, color: av.text }}
                >
                  {name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-black text-base" style={{ color: "#0F172A" }}>{name || "Your Name"}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{email}</p>
                </div>
              </>
            )}
          </div>

          {/* Personal info card */}
          <div
            className="rounded-2xl p-6 mb-5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: "#94A3B8" }}>
              Personal Info
            </p>
            <div className="flex flex-col gap-5">
              {fetching ? <FieldSkeleton /> : (
                <Field label="Full Name" icon={<User size={14} />} error={touched.name && errors.name}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (touched.name) setErrors(validate({ name: e.target.value })); }}
                    onBlur={() => handleBlur("name")}
                    placeholder="Your full name"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: "#0F172A" }}
                  />
                </Field>
              )}
              {fetching ? <FieldSkeleton /> : (
                <Field label="Email" icon={<Mail size={14} />} hint="Read-only">
                  <input type="email" value={email} disabled className="w-full bg-transparent text-sm outline-none cursor-not-allowed" style={{ color: "#94A3B8" }} />
                </Field>
              )}
            </div>
          </div>

          {/* Skills card */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: "#94A3B8" }}>Skills</p>
            <div className="flex flex-col gap-6">

              {/* Offered */}
              {fetching ? <FieldSkeleton /> : (
                <div>
                  <Field
                    label="Skills You Offer"
                    icon={<Zap size={14} />}
                    hint="Comma separated"
                    error={touched.skillsOffered && errors.skillsOffered}
                    accentColor="#059669"
                  >
                    <input
                      type="text"
                      value={skillsOffered}
                      onChange={(e) => { setSkillsOffered(e.target.value); if (touched.skillsOffered) setErrors(validate({ skillsOffered: e.target.value })); }}
                      onBlur={() => handleBlur("skillsOffered")}
                      placeholder="e.g. React, Python, Figma"
                      className="w-full bg-transparent text-sm outline-none"
                      style={{ color: "#0F172A" }}
                    />
                  </Field>
                  {offeredTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {offeredTags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
                          <Zap size={10} />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wanted */}
              {fetching ? <FieldSkeleton /> : (
                <div>
                  <Field
                    label="Skills You Want"
                    icon={<TrendingUp size={14} />}
                    hint="Comma separated"
                    error={touched.skillsWanted && errors.skillsWanted}
                    accentColor="#7C3AED"
                  >
                    <input
                      type="text"
                      value={skillsWanted}
                      onChange={(e) => { setSkillsWanted(e.target.value); if (touched.skillsWanted) setErrors(validate({ skillsWanted: e.target.value })); }}
                      onBlur={() => handleBlur("skillsWanted")}
                      placeholder="e.g. UI Design, Node.js, SQL"
                      className="w-full bg-transparent text-sm outline-none"
                      style={{ color: "#0F172A" }}
                    />
                  </Field>
                  {wantedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {wantedTags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>
                          <TrendingUp size={10} />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading || saved || fetching}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
            style={{
              background: saved ? "#059669" : "#2563EB",
              boxShadow: saved ? "0 2px 12px rgba(5,150,105,0.3)" : "0 2px 12px rgba(37,99,235,0.25)",
            }}
          >
            {loading ? <><Loader2 size={16} className="animate-spin" />Saving…</>
              : saved ? <><CheckCircle size={16} />Saved!</>
              : <><Save size={16} />Save Changes</>}
          </button>

        </div>
      </div>
    </Layout>
  );
}
