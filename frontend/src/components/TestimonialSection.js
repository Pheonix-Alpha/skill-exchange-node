// components/TestimonialSection.js
export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Ananya Sharma",
      role: "Web Developer",
      quote: "SkillExchange helped me find great mentors and improve my learning journey!",
      image: "/images/user1.png",
    },
    {
      name: "Rohan Mehta",
      role: "Graphic Designer",
      quote: "The platform is simple, powerful, and got me develop new skill quickly.",
      image: "/images/user2.png",
    },
    {
      name: "Sara Ali",
      role: "Content Writer",
      quote: "It’s the best site for anyone looking to grow or learn skills!",
      image: "/images/user3.png",
    },
  ];

  return (
    <div className="w-full bg-[#F2FAFA] py-20 px-4">
      <div className="max-w-[1295px] mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#252525] mb-12">What Our Users Say</h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((user, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{user.role}</p>
              <p className="text-gray-700 text-sm">“{user.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
