"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/background.mp4" // Your video file in /public
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        {/* Floating + Fade-in Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-6 float-animation"
        >
          Learn and Teach Together –{" "}
          <span className="text-[#B8860B]">Skill Swap for Students</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-gray-200 mb-8"
        >
          Exchange your skills, share knowledge, and grow with a global student
          community through collaborative learning.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#B8860B] text-white rounded-lg font-semibold hover:bg-[#a0750b] transition duration-300"
          >
            Register Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#556B2F] transition duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
