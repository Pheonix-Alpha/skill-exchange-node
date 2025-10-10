"use client";
import { useRouter } from "next/navigation";

export default function HeroText() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 mt-8 w-full px-4 md:px-0">
      {/* Left Text Section */}
      <div className="w-full md:max-w-[634px]">
        <h1 className="text-3xl sm:text-4xl md:text-[65px] font-bold text-[#1E88E5] leading-tight md:leading-[1.1]">
          Are you looking for skill?
        </h1>
       <p className="mt-4 text-lg sm:text-xl md:text-[24px] text-gray-700 leading-relaxed">
  Discover and Trade Skills Effortlessly.{" "}
 Skill Exchange helps  <span className="text-[#1E88E5] font-medium"> you
  connect, share, and learn new skills </span>with ease.
</p>


        {/* Button + Search */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <button
            className="w-full sm:w-[200px] h-[50px] bg-[#1E88E5] text-white rounded-[10px] text-base font-semibold hover:bg-blue-600 transition"
            onClick={() => router.push("/find-skill")}
          >
            Find a Skill
          </button>

          <input
            type="text"
            placeholder="Enter skill name..."
            className="w-full sm:flex-1 h-[50px] px-4 rounded-[10px] border border-gray-300 shadow-sm text-base focus:outline-none"
          />
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-auto mt-6 md:mt-0">
        <img
          src="/images/Hero-image.png"
          alt="Skill Illustration"
          className="w-full max-w-[400px] h-auto object-contain mx-auto"
        />
      </div>
    </div>
  );
}
