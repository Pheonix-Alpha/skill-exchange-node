export default function Newsletter() {
  return (
    <div className="w-full bg-[#F2FAFA] py-16 px-4 flex flex-col items-center justify-center">
      {/* Top Text */}
      <div className="w-full max-w-[800px] text-center mb-10 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#252525]">
          Newsletter Subscription
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#9D9D9D] mt-2">
          Subscribe to our newsletter to get new skill work
        </p>
      </div>

      {/* Input + Button */}
      <div className="w-full max-w-[660px] flex flex-col items-center justify-center space-y-5">
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full h-[50px] sm:h-[60px] px-4 sm:px-6 border bg-white border-gray-300 rounded-md text-base sm:text-lg focus:outline-none"
        />
        <button className="w-full sm:w-[300px] h-[60px] sm:h-[76px] bg-[#1E88E5] text-white text-lg sm:text-xl font-semibold rounded-[10px] hover:bg-blue-600 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}
