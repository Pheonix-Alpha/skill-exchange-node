import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Full-Stack Developer",
    initials: "AS",
    color: "bg-blue-500",
    quote:
      "I taught React and learned UI design in return. Best trade I ever made — saved me thousands in courses.",
    rating: 5,
    tag: "React ↔ Figma",
  },
  {
    name: "Rohan Mehta",
    role: "Graphic Designer",
    initials: "RM",
    color: "bg-purple-500",
    quote:
      "Found a Python developer who needed logo work done. We both got exactly what we needed in a week.",
    rating: 5,
    tag: "Logo ↔ Python",
  },
  {
    name: "Sara Ali",
    role: "Content Strategist",
    initials: "SA",
    color: "bg-emerald-500",
    quote:
      "Exchanged copywriting for SEO training. The community here is genuinely skilled and trustworthy.",
    rating: 5,
    tag: "Copy ↔ SEO",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-[#0A0A0F] py-24 px-6 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Community love
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Real exchanges,
            <br />
            <span className="text-white/30">real results.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all flex flex-col gap-5"
            >
              <div className="flex gap-1">
                {Array(t.rating)
                  .fill(0)
                  .map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
              </div>

              {/* FIXED QUOTES */}
              <p className="text-white/60 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] text-xs font-semibold self-start">
                {t.tag}
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                <div
                  className={`w-9 h-9 rounded-xl ${t.color} flex items-center justify-center text-white text-xs font-black shrink-0`}
                >
                  {t.initials}
                </div>

                <div>
                  <p className="text-white text-sm font-semibold leading-none">
                    {t.name}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}