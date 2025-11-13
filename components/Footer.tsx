"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#556B2F] text-white py-20 px-12">
      <div className="max-w-6xl mx-auto flex flex-col justify-between min-h-[220px]">
        {/* Left Section */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/file.svg"
              alt="SkillSwap Logo"
              width={32}
              height={32}
              className="invert"
            />
            <span className="bg-[#B8860B]/90 text-white px-3 py-1 rounded-md font-semibold text-lg">
              SkillSwap
            </span>
          </div>
          <p className="max-w-sm mt-2 text-sm text-gray-100 leading-relaxed">
            Connecting students worldwide through peer-to-peer skill exchange
            and collaborative learning.
          </p>
        </div>

        {/* Center Copyright */}
        <div className="mt-10 text-center w-full text-sm text-gray-200">
          © SkillSwap 2025. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

