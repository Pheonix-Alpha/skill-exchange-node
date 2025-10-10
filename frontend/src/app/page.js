"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import HeroText from "@/components/HeroText";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Wake up backend in the background
    fetch("https://skill-exchange-node.onrender.com/api", {
      method: "GET",
      cache: "no-store", // ensure it really hits server
    })
      .then(() => console.log("Backend wake-up ping sent"))
      .catch((err) => console.log("Backend wake-up ping failed:", err));

    // Redirect to login
 
  });

  return(
    <main className="min-h-screen bg-[#F2FAFA] flex flex-col items-center">
      {/* Container for navbar and hero section */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 max-w-[1295px]">
        {/* Navbar */}
        <Navbar />
     {/* Hero Section */}
        <div className="flex justify-start mt-8 sm:mt-12">
          <HeroText />
        </div>
      </div>

      {/* Middle Sections */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        <Categories />
        <Newsletter />
        <TestimonialSection />
        <FAQSection />
      </div>

      {/* Footer */}
      <Footer />


    </main>
  );
  
}
