"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight, Zap, Users, Star } from "lucide-react";

const floatingSkills = [
  { label: "React", x: "8%", y: "18%", delay: "0s" },
  { label: "Figma", x: "82%", y: "12%", delay: "0.4s" },
  { label: "Python", x: "88%", y: "55%", delay: "0.8s" },
  { label: "Copywriting", x: "5%", y: "72%", delay: "1.2s" },
  { label: "Motion Design", x: "75%", y: "80%", delay: "0.6s" },
  { label: "SEO", x: "15%", y: "45%", delay: "1s" },
];

export default function HeroText() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4F8EF7 0%, transparent 70%)" }}
        />
      </div>

      {/* Floating skill chips */}
      {floatingSkills.map((skill, i) => (
        <div
          key={i}
          className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium backdrop-blur-sm"
          style={{ left: skill.x, top: skill.y, animation: `float 4s ease-in-out ${skill.delay} infinite` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
          {skill.label}
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-[860px] mx-auto pt-28 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4F8EF7]/30 bg-[#4F8EF7]/10 text-[#4F8EF7] text-xs font-semibold mb-8">
          <Zap size={12} />
          Peer-to-peer skill exchange platform
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-[80px] font-black text-white leading-[0.95] tracking-tight mb-6"
          
        >
          Trade Skills.
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #4F8EF7 0%, #7CB3FF 50%, #4F8EF7 100%)" }}
          >
            Grow Together.
          </span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-[560px] mx-auto mb-10">
          Connect with people who have the skills you need. Offer yours in return.
          No money, just knowledge.
        </p>

        {/* Search + CTA */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-[560px] mx-auto mb-12">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#4F8EF7]/50 transition-all">
            <Search size={16} className="text-white/30 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What skill are you looking for?"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              onKeyDown={(e) => e.key === "Enter" && router.push(`/find-skill?q=${query}`)}
            />
          </div>
          <button
            onClick={() => router.push(`/find-skill${query ? `?q=${query}` : ""}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4F8EF7] hover:bg-[#3a7be8] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-px whitespace-nowrap"
          >
            Find a Skill
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Users size={14} />
            <span><strong className="text-white/70">12,000+</strong> members</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/40 text-sm">
            <div className="flex -space-x-1.5">
              {["bg-blue-400", "bg-purple-400", "bg-emerald-400", "bg-amber-400"].map((c, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-[#0A0A0F]`} />
              ))}
            </div>
            <span><strong className="text-white/70">4.9</strong> rating</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span><strong className="text-white/70">50k+</strong> exchanges</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800;900&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}