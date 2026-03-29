"use client";

import { motion } from "framer-motion";

export default function WhyChoose() {
  const features = [
    {
      title: "Premium Membership",
      desc: "Get unlimited access, priority matches, and exclusive tools.",
    },
    {
      title: "Peer-to-Peer Learning",
      desc: "Learn directly from students like you — interactive and fun!",
    },
    {
      title: "Easy Matching",
      desc: "Find your ideal learning partner quickly and effortlessly.",
    },
  ];

  return (
    <section className="relative bg-[#F8F9F4] py-24 px-6">

      {/* ✨ subtle background depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,134,11,0.08),transparent_70%)]" />

      {/* 🧠 CONTENT */}
      <div className="relative max-w-7xl mx-auto text-center">

        {/* TITLE */}
        <motion.h3
          className="text-4xl md:text-5xl font-bold text-[#556B2F] mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose SkillSwap?
        </motion.h3>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10">

          {features.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-10 text-left border border-[#556B2F]/10 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {/* NUMBER */}
              <div className="text-3xl font-bold text-[#B8860B] mb-4">
                0{i + 1}
              </div>

              {/* TITLE */}
              <h4 className="text-xl font-semibold text-[#556B2F] mb-3">
                {item.title}
              </h4>

              {/* DESC */}
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}