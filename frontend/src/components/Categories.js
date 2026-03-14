import { Code2, Palette, PenLine, TrendingUp, Film, Database, Music2, Camera } from "lucide-react";

const categories = [
  { name: "Web Development",  icon: Code2,      color: "from-blue-500/20 to-blue-600/5",    iconColor: "text-blue-400",    border: "border-blue-500/20",    count: "2.4k skills" },
  { name: "Graphic Design",   icon: Palette,    color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400",  border: "border-purple-500/20",  count: "1.8k skills" },
  { name: "Writing",          icon: PenLine,    color: "from-emerald-500/20 to-emerald-600/5",iconColor: "text-emerald-400", border: "border-emerald-500/20", count: "1.2k skills" },
  { name: "Marketing",        icon: TrendingUp, color: "from-orange-500/20 to-orange-600/5", iconColor: "text-orange-400",  border: "border-orange-500/20",  count: "980 skills"  },
  { name: "Video Editing",    icon: Film,       color: "from-pink-500/20 to-pink-600/5",     iconColor: "text-pink-400",    border: "border-pink-500/20",    count: "760 skills"  },
  { name: "Data & Analytics", icon: Database,   color: "from-cyan-500/20 to-cyan-600/5",     iconColor: "text-cyan-400",    border: "border-cyan-500/20",    count: "650 skills"  },
  { name: "Music & Audio",    icon: Music2,     color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-400",  border: "border-violet-500/20",  count: "540 skills"  },
  { name: "Photography",      icon: Camera,     color: "from-amber-500/20 to-amber-600/5",   iconColor: "text-amber-400",   border: "border-amber-500/20",   count: "480 skills"  },
];

export default function Categories() {
  return (
    <section className="bg-[#0A0A0F] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <p className="text-[#4F8EF7] text-xs font-bold uppercase tracking-[0.2em] mb-3">Browse by category</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Every skill you
              <br />
              <span className="text-white/30">could need.</span>
            </h2>
          </div>
          <a href="/find-skill" className="text-sm font-semibold text-[#4F8EF7] hover:text-white transition-colors flex items-center gap-1.5 group">
            View all categories
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <a
                key={i}
                href="/find-skill"
                className={`group relative p-5 rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color} hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                <Icon className={`${cat.iconColor} mb-4`} size={24} strokeWidth={1.5} />
                <h3 className="text-white font-semibold text-sm leading-snug mb-1">{cat.name}</h3>
                <p className="text-white/30 text-xs">{cat.count}</p>
              </a>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800;900&display=swap');
      `}</style>
    </section>
  );
}