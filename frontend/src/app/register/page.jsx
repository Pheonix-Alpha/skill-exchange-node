"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { User, Mail, Lock, Zap, Search, ArrowRight, Eye, EyeOff, X } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillsOffered: "",
    skillsWanted: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Tag state
  const [offeringInput, setOfferingInput] = useState("");
  const [wantingInput, setWantingInput] = useState("");
  const [offeringTags, setOfferingTags] = useState([]);
  const [wantingTags, setWantingTags] = useState([]);

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = (input, setInput, tags, setTags) => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setInput("");
  };

  const removeTag = (tag, tags, setTags) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e, input, setInput, tags, setTags) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input, setInput, tags, setTags);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        skillsOffered: offeringTags.length
          ? offeringTags
          : form.skillsOffered.split(",").map((s) => s.trim()).filter(Boolean),
        skillsWanted: wantingTags.length
          ? wantingTags
          : form.skillsWanted.split(",").map((s) => s.trim()).filter(Boolean),
      };

      await api.post("/auth/register", payload);
      setIsSuccess(true);
      setMessage("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">

      {/* Background glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4F8EF7 0%, transparent 70%)" }}
        />
      </div>

      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#1E5ECC] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6S3 12.314 3 9z" stroke="white" strokeWidth="1.5"/>
              <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Skill<span className="text-[#4F8EF7]">Exchange</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-3xl font-black text-white mb-1"
              
            >
              Create account
            </h1>
            <p className="text-white/40 text-sm">Join thousands of skill exchangers today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[11px] font-bold uppercase tracking-widest block">Full name</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all group">
                <User size={15} className="text-white/20 group-focus-within:text-[#4F8EF7] transition-colors shrink-0" />
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[11px] font-bold uppercase tracking-widest block">Email</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all group">
                <Mail size={15} className="text-white/20 group-focus-within:text-[#4F8EF7] transition-colors shrink-0" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[11px] font-bold uppercase tracking-widest block">Password</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all group">
                <Lock size={15} className="text-white/20 group-focus-within:text-[#4F8EF7] transition-colors shrink-0" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Skills Offered — tag input */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[11px] font-bold uppercase tracking-widest block">
                Skills you offer
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all">
                {offeringTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {offeringTags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag, offeringTags, setOfferingTags)}>
                          <X size={10} className="hover:text-white transition-colors" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-white/20 shrink-0" />
                  <input
                    type="text"
                    value={offeringInput}
                    onChange={(e) => setOfferingInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, offeringInput, setOfferingInput, offeringTags, setOfferingTags)}
                    onBlur={() => addTag(offeringInput, setOfferingInput, offeringTags, setOfferingTags)}
                    placeholder="e.g. React, Figma — press Enter to add"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Skills Wanted — tag input */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[11px] font-bold uppercase tracking-widest block">
                Skills you want
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all">
                {wantingTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {wantingTags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag, wantingTags, setWantingTags)}>
                          <X size={10} className="hover:text-white transition-colors" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Search size={15} className="text-white/20 shrink-0" />
                  <input
                    type="text"
                    value={wantingInput}
                    onChange={(e) => setWantingInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, wantingInput, setWantingInput, wantingTags, setWantingTags)}
                    onBlur={() => addTag(wantingInput, setWantingInput, wantingTags, setWantingTags)}
                    placeholder="e.g. Python, SEO — press Enter to add"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                isSuccess
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                <span>{isSuccess ? "✓" : "✕"}</span>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#4F8EF7] hover:bg-[#3a7be8] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-white/30">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4F8EF7] hover:text-white font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/15 text-xs mt-6">
          © 2025 SkillExchange. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800;900&display=swap');
      `}</style>
    </div>
  );
}