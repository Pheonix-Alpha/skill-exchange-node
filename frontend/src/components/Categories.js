const categories = [
  { name: "Web Development", img: "/images/web-dev.jpg" },
  { name: "Graphic Design", img: "/images/design.jpg" },
  { name: "Writing", img: "/images/writting.jpg" },
  { name: "Marketing", img: "/images/marketing.jpg" },
  { name: "Video Editing", img: "/images/video-editing.jpg" },
  { name: "Data Entry", img: "/images/data-entry.jpg" },
  { name: "Music & Audio", img: "/images/music.jpg" },
  { name: "Photography", img: "/images/photo.jpg" },
];

export default function CategoryGrid() {
  return (
    <div className="w-full max-w-[1200px] mx-auto text-center my-16 px-4">
      {/* Section Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#252525] mb-12">
        Choose Different Category
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="relative w-full max-w-[180px] h-[140px] sm:h-[160px] rounded-[16px] overflow-hidden shadow-md group"
          >
            {/* Image */}
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-base sm:text-lg font-semibold">
                {cat.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
