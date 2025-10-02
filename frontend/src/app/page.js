"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    router.push("/login");
  }, [router]);

  return null; // nothing visible here
}
