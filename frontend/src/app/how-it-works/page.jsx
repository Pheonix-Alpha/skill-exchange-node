"use client";

import { UserPlus, Search, ArrowLeftRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar"; 
const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your profile",
    desc: "List the skills you have and the ones you want to learn. Set your availability.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover & match",
    desc: "Browse people with skills you need. Our algorithm finds the best mutual fits.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: ArrowLeftRight,
    step: "03",
    title: "Send a request",
    desc: "Propose a skill exchange — offer what you know, ask for what you want.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "Learn & grow",
    desc: "Complete the exchange. Rate your partner. Build your reputation.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />
    <section className="bg-[#0D0D14] py-24 px-6 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Simple process
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white font-syne">
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border ${s.border} bg-white/[0.02] hover:bg-white/[0.04] transition-all group`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-5`}
                >
                  <Icon className={s.color} size={20} strokeWidth={1.5} />
                </div>

                <div className="absolute top-5 right-5 text-4xl font-black text-white/[0.04] group-hover:text-white/[0.07] transition-colors font-syne">
                  {s.step}
                </div>

                <h3 className="text-white font-bold text-base mb-2">
                  {s.title}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Newsletter */}
        <div className="mt-16 rounded-2xl border border-[#4F8EF7]/20 bg-[#4F8EF7]/5 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
          
          <div className="flex-1">
            <h3 className="text-white font-black text-xl mb-1 font-syne">
              Stay in the loop
            </h3>

            <p className="text-white/40 text-sm">
              Get notified of new skills, features and community highlights.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#4F8EF7]/50 transition-all"
            />

            <button className="px-5 py-2.5 bg-[#4F8EF7] hover:bg-[#3a7be8] text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}