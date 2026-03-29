"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Profile",
      desc: "Add your skills to teach and the ones you want to learn.",
    },
    {
      number: "02",
      title: "Connect",
      desc: "Browse peers and send swap requests.",
    },
    {
      number: "03",
      title: "Learn & Teach",
      desc: "Collaborate through video or chat and exchange knowledge.",
    },
  ];

  return (
    <section className="relative py-24 bg-[#eef2e3] overflow-hidden">

      {/* 🌿 subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(85,107,47,0.12),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        {/* TITLE */}
        <motion.h3
          className="text-4xl md:text-5xl font-bold mb-16 text-[#556B2F]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How It Works?
        </motion.h3>

        {/* STEPS */}
        <div className="grid md:grid-cols-3 gap-12 items-start">

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative bg-white rounded-2xl shadow-lg p-10 border border-[#556B2F]/10 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {/* NUMBER */}
              <div className="text-4xl font-bold text-[#B8860B] mb-4">
                {step.number}
              </div>

              {/* TITLE */}
              <h4 className="text-xl font-semibold text-[#556B2F] mb-3">
                {step.title}
              </h4>

              {/* DESC */}
              <p className="text-gray-600 leading-relaxed">
                {step.desc}
              </p>

              {/* 👉 CONNECTOR LINE (desktop only) */}
              {i !== 2 && (
                <div className="hidden md:block absolute top-1/2 right-[-40px] w-16 h-[2px] bg-[#B8860B]/40" />
              )}
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}