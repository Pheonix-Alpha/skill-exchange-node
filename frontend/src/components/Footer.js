import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-white/5 px-6 py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#4F8EF7] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6S3 12.314 3 9z" stroke="white" strokeWidth="1.5"/>
                  <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-white font-bold">Skill<span className="text-[#4F8EF7]">Exchange</span></span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-5">
              A community where skills are the currency. Learn, teach, grow.
            </p>
            <div className="flex gap-3">
              {["T", "I", "L"].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all text-xs font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5">Platform</h4>
            <ul className="space-y-3">
              {["Find a Skill", "Post Your Skill", "How it Works", "Pricing"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5">Community</h4>
            <ul className="space-y-3">
              {["Blog", "Success Stories", "Skill Directory", "Forum"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {["About", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/5">
          <p className="text-white/20 text-xs">© 2025 SkillExchange. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built for the community, by the community.</p>
        </div>
      </div>
    </footer>
  );
}