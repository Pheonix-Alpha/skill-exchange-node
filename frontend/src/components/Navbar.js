"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons for hamburger

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Find Skill", href: "/login" },
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/register" },
  ];

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-sm rounded-full mt-6 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-[1295px] mx-auto flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <span className="text-xl sm:text-2xl font-semibold text-gray-800">
            SkillExchange
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span
                className={`text-base font-medium cursor-pointer transition-colors ${
                  pathname === item.href ? "text-[#1E88E5]" : "text-gray-700"
                } hover:text-[#1E88E5]`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu List */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4 pb-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}>
              <span
                className={`text-base font-medium ${
                  pathname === item.href ? "text-[#1E88E5]" : "text-gray-700"
                } hover:text-[#1E88E5]`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
