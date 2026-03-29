// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import WhyChoose from "@/components/WhyChoose";
// import HowItWorks from "@/components/HowItWorks";
// import TopUsers from "@/components/TopUsers";
// import Footer from "@/components/Footer";

// export default function HomePage() {
//   return (
//     <main className="bg-[#F8F9F4] min-h-screen overflow-hidden">
      
//       <Navbar />

//       {/* 🔥 HERO */}
//       <Hero />

//       {/* 🌊 FLOW TRANSITION */}
//       <div className="relative">
//         <svg className="w-full h-24 text-[#F8F9F4]" viewBox="0 0 1440 320">
//           <path
//             fill="currentColor"
//             d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,160C1120,128,1280,128,1360,128L1440,128V320H0Z"
//           />
//         </svg>
//       </div>

//       {/* 🌿 WHY CHOOSE */}
//       <section className="relative py-20 bg-white">
//         {/* subtle glow */}
//         <div className="absolute w-[300px] h-[300px] bg-[#B8860B]/20 blur-[120px] top-0 left-0" />
//         <WhyChoose />
//       </section>

//       {/* 🌊 FLOW */}
//       <div className="relative rotate-180">
//         <svg className="w-full h-24 text-white" viewBox="0 0 1440 320">
//           <path
//             fill="currentColor"
//             d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,160C1120,128,1280,128,1360,128L1440,128V320H0Z"
//           />
//         </svg>
//       </div>

//       {/* 🚀 HOW IT WORKS */}
//       <HowItWorks />

//       {/* 🔥 CTA (UPGRADED) */}
//       <section className="relative text-center py-24 overflow-hidden">
        
//         {/* background glow */}
//         <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F]/10 via-transparent to-[#B8860B]/10" />

//         <h2 className="text-4xl font-bold mb-4 text-[#556B2F]">
//           Ready to Start Your Journey?
//         </h2>

//         <p className="text-gray-600 mb-8 max-w-xl mx-auto">
//           Join a living network of learners exchanging real skills — not just watching tutorials.
//         </p>

//         <div className="flex justify-center gap-4">
//           <button className="px-7 py-3 bg-[#B8860B] text-white rounded-xl shadow-lg hover:scale-110 transition duration-300">
//             Register Now
//           </button>

//           <button className="px-7 py-3 border border-[#556B2F] text-[#556B2F] rounded-xl hover:bg-[#556B2F] hover:text-white transition duration-300">
//             Login
//           </button>
//         </div>
//       </section>

//       {/* 🌊 FLOW */}
//       <div className="relative">
//         <svg className="w-full h-24 text-[#F8F9F4]" viewBox="0 0 1440 320">
//           <path
//             fill="currentColor"
//             d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,160C1120,128,1280,128,1360,128L1440,128V320H0Z"
//           />
//         </svg>
//       </div>

//       {/* 🏆 TOP USERS */}
//       <section className="py-20 bg-[#F8F9F4]">
//         <TopUsers />
//       </section>

//       <Footer />
//     </main>
//   );
// }

"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChoose";
import HowItWorks from "@/components/HowItWorks";
import TopUsers from "@/components/TopUsers";
import VideoCTA from "@/components/VideoCTA";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="bg-[#F8F9F4] min-h-screen overflow-hidden">

      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* 🔥 HERO (no motion needed, already animated) */}
      <Hero />

      {/* 🌊 WAVE */}
      <div className="relative">
        <svg className="w-full h-24 text-[#F8F9F4]" viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,160C1120,128,1280,128,1360,128L1440,128V320H0Z"
          />
        </svg>
      </div>

      {/* WHY CHOOSE */}
    <motion.section
  className="relative -mt-24 py-20 bg-white"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* glow */}
        <div className="absolute w-[300px] h-[300px] bg-[#B8860B]/20 blur-[120px] top-0 left-0" />
        <WhyChoose />
      </motion.section>

      {/* 🌊 WAVE */}
      <div className="relative rotate-180">
        <svg className="w-full h-24 text-white" viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,160C1120,128,1280,128,1360,128L1440,128V320H0Z"
          />
        </svg>
      </div>

      {/* 🚀 HOW IT WORKS */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <HowItWorks />
      </motion.div>

      {/* 🔥 CTA */}
  <motion.section
  className="relative text-center py-28 overflow-hidden bg-[#F8F9F4] text-[#556B2F]"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

  {/* ✨ SOFT GLOW (LIGHT VERSION) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.15),transparent_70%)]" />

 {/* 🧠 FLOATING SKILLS — NATURAL SPREAD */}
<div className="absolute inset-0 pointer-events-none">

  {[
    { text: "Coding", top: "10%", left: "15%" },
    { text: "Chemistry", top: "25%", left: "40%" },
    { text: "Design", top: "15%", left: "70%" },
    { text: "Cooking", top: "60%", left: "20%" },
    { text: "Yoga", top: "20%", left: "85%" },
    { text: "Fitness", top: "70%", left: "80%" },
    { text: "Music", top: "45%", left: "60%" },
    { text: "Art", top: "55%", left: "35%" },
    { text: "Editing", top: "75%", left: "50%" },
    { text: "Programming", top: "35%", left: "10%" },
    { text: "Photography", top: "50%", left: "85%" },
    { text: "Public Speaking", top: "30%", left: "55%" },
  ].map((skill, i) => (
    <span
      key={i}
      className="absolute text-[#556B2F]/80 text-sm md:text-base animate-float"
      style={{
        top: skill.top,
        left: skill.left,
        animationDelay: `${i * 0.2}s`,
      }}
    >
      {skill.text}
    </span>
  ))}

</div>

  {/* 🔥 MAIN CONTENT */}
  <div className="relative z-10">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Ready to Start Your Journey?
    </h2>

    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
      Learn, teach, and grow together — SkillSwap connects you with real people, real skills.
    </p>

    <div className="flex justify-center gap-4">
      <button className="px-7 py-3 bg-[#B8860B] text-white rounded-xl shadow-lg hover:scale-110 transition duration-300">
        Register Now
      </button>

      <button className="px-7 py-3 border border-[#556B2F] text-[#556B2F] rounded-xl hover:bg-[#556B2F] hover:text-white transition duration-300">
        Explore
      </button>
    </div>
  </div>

</motion.section>

      {/* 🏆 TOP USERS */}
      <motion.section
        className="py-20 bg-[#F8F9F4]"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <TopUsers />
      </motion.section>

      <VideoCTA /> 

      {/* 🔚 FOOTER */}
      <Footer />
    </main>
  );
}