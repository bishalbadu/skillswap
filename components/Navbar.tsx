// "use client";

// import Image from "next/image";
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-[#E9EDE1] shadow-sm py-4 px-8 flex justify-between items-center border-b border-[#D8DCC9] sticky top-0 z-50">

//       {/* LEFT LOGO */}
//       <div className="flex items-center space-x-2">
//         <Image src="/LOGO.png" alt="SkillSwap Logo" width={42} height={42} />
//         <span className="text-2xl font-bold text-[#556B2F]">
//           Skill<span className="text-[#4F6F52]">Swap</span>
//         </span>
//       </div>

//       {/* RIGHT BUTTONS */}
//       <div className="flex gap-4">
//         <Link
//           href="/login"
//           className="border border-[#556B2F] text-[#556B2F] px-4 py-2 rounded-md hover:bg-[#556B2F] hover:text-white transition"
//         >
//           Login
//         </Link>

//         <Link
//           href="/register"
//           className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#a0750b] transition"
//         >
//           Register
//         </Link>
//       </div>
//     </nav>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#E9EDE1] shadow-sm py-4 px-8 flex justify-between items-center border-b border-[#D8DCC9] sticky top-0 z-50">

      {/* LEFT — LOGO */}
      <div className="flex items-center space-x-2">
        <Image src="/LOGO.png" alt="SkillSwap Logo" width={42} height={42} />
        <Link href="/" className="text-2xl font-bold text-[#556B2F] cursor-pointer">
          Skill<span className="text-[#4F6F52]">Swap</span>
        </Link>
      </div>

      {/* CENTER — NAV LINKS */}
      <div className="hidden md:flex gap-8 text-[#5a6c42] text-[15px] font-medium">
        <Link href="/" className="hover:text-[#2f3b1c] transition">Home</Link>
        <Link href="/about" className="hover:text-[#2f3b1c] transition">About</Link>
        <Link href="/contact" className="hover:text-[#2f3b1c] transition">Contact</Link>
      </div>

      {/* RIGHT — AUTH BUTTONS */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="border border-[#556B2F] text-[#556B2F] px-4 py-2 rounded-md hover:bg-[#556B2F] hover:text-white transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#a0750b] transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
