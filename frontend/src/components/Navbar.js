"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Find Skill", href: "/find-skill" },
    { name: "How it works", href: "/how-it-works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#1E5ECC] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6S3 12.314 3 9z" stroke="white" strokeWidth="1.5"/>
              <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Skill<span className="text-[#4F8EF7]">Exchange</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === item.href
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <span className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sign in
            </span>
          </Link>
          <Link href="/register">
            <span className="px-5 py-2 bg-[#4F8EF7] hover:bg-[#3a7be8] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-px">
              Get Started
            </span>
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden text-white/70 hover:text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/5 px-6 py-5 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}>
              <span className="block py-2 text-base font-medium text-white/70 hover:text-white transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/10">
            <Link href="/login" className="flex-1">
              <span className="block text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70">Sign in</span>
            </Link>
            <Link href="/register" className="flex-1">
              <span className="block text-center py-2.5 rounded-xl bg-[#4F8EF7] text-sm font-semibold text-white">Get Started</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}