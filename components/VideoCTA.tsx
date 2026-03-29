"use client";

import { motion } from "framer-motion";

export default function VideoCTA() {
  return (
    <section className="relative h-[55vh] flex items-center justify-center text-center text-white overflow-hidden">

      {/* 🎬 VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-110"
        src="/yoga.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* 🌿 SOFT OVERLAY (LESS DARK THAN HERO) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#556B2F]/30" />

      {/* ✨ CONTENT */}
      <motion.div
        className="relative z-10 max-w-2xl px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Skills Are Everywhere
        </h2>

        <p className="text-gray-200 mb-6">
          From fitness to creativity — learn from others and share what you know.
        </p>

        <button className="px-6 py-3 bg-[#B8860B] rounded-lg hover:scale-105 transition">
          Start Learning
        </button>
      </motion.div>

      {/* 🌊 FADE INTO FOOTER */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#556B2F] to-transparent" />
    </section>
  );
}