// components/FAQSection.js
"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How do I find a skill?",
    answer: "You can use the search bar or browse categories to find the skill you’re looking for.",
  },
  {
    question: "Is it free to use SkillExchange?",
    answer: "Yes, SkillExchange is completely free for both learners and teachers.",
  },
  {
    question: "Can I teach and learn at the same time?",
    answer: "Absolutely! You can post skills you offer and also search for ones you want to learn.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white py-20 px-4">
      <div className="max-w-[1295px] mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#252525] text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h4 className="text-lg sm:text-xl font-semibold text-[#1E88E5]">
                  {item.question}
                </h4>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-3 text-gray-700 transition-all duration-300">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
