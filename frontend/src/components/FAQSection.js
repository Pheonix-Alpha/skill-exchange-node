"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is SkillExchange completely free?",
    answer: "Yes — entirely free. No subscription, no credits, no hidden fees. You trade your skills directly with others in the community.",
  },
  {
    question: "What if my skill isn't listed?",
    answer: "You can add any custom skill to your profile. If you can teach it, someone here probably wants to learn it.",
  },
  {
    question: "Can I both teach and learn at the same time?",
    answer: "Absolutely. Most members do. List what you offer and what you want — our matching finds people who complement you.",
  },
  {
    question: "How does the exchange actually work?",
    answer: "You send a request specifying what you'll offer and what you'd like in return. The other person accepts, declines or counter-proposes. Once agreed, you coordinate sessions yourselves.",
  },
  {
    question: "What if someone doesn't follow through?",
    answer: "Ratings and reviews keep everyone accountable. Consistently poor follow-through leads to reduced visibility. We're building a trust-based community.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-[#0D0D14] py-24 px-6 border-t border-white/5">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-3">Got questions?</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" >
            FAQ
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all ${
                open === i
                  ? "border-[#4F8EF7]/30 bg-[#4F8EF7]/5"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className={`text-sm font-semibold transition-colors ${open === i ? "text-white" : "text-white/60"}`}>
                  {faq.question}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  open === i ? "bg-[#4F8EF7] text-white" : "bg-white/5 text-white/30"
                }`}>
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800;900&display=swap');
      `}</style>
    </section>
  );
}