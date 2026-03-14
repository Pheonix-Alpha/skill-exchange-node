"use client";

import { useEffect } from "react";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import HeroText from "@/components/HeroText";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  useEffect(() => {
    fetch("https://skill-exchange-node.onrender.com/api", {
      method: "GET",
      cache: "no-store",
    })
      .then(() => console.log("Backend wake-up ping sent"))
      .catch((err) => console.log("Backend wake-up ping failed:", err));
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <HeroText />
      <Categories />
      <HowItWorks />
      <TestimonialSection />
      <FAQSection />
      <Footer />
    </main>
  );
}