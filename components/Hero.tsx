
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const ref = useRef(null);

  /*  VIDEO LIST */
  const videos = [
    "/childlearn.mp4",
    "/chemlearn.mp4",
     "/gym.mp4",
    "/cooking.mp4",
   
  ];

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();


  /*  VIDEO SWITCH LOGIC */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videos[index];
    video.currentTime = 0;

    video.play().catch(() => {});

    const handleEnd = () => {
      setIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, [index]);

  /*  SCROLL PARALLAX */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      ref={ref}
      className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/*  VIDEO */}
      <motion.video
        ref={videoRef}
        style={{ y }}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-125"
      />

      {/*  OVERLAY (better readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#556B2F]/40" />

      {/*  GLOW EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-[#B8860B]/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-[#556B2F]/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/*  CONTENT */}
      <div className="relative z-10 max-w-4xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight"
        >
          <span className="bg-gradient-to-r from-[#B8860B] to-yellow-300 bg-clip-text text-transparent animate-pulse">
            Swap Skills.
          </span>
          <br />
          Grow Together.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg text-gray-200"
        >
          A living network of learners — not just a platform.
        </motion.p>

        <motion.div
          className="mt-10 flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
      onClick={() => router.push("/register")}
      className="px-7 py-3 bg-[#B8860B] text-white font-bold text-xl rounded-xl shadow-lg hover:scale-110 transition duration-300"
    >
      Get Started
    </button>
        </motion.div>
      </div>
    </section>
  );
}