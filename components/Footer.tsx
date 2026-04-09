"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#556B2F] text-white pt-16 pb-8 px-8">
      <div className="max-w-6xl mx-auto">

        {/*  TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-10">

          {/*  BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">

              {/* LOGO FIX */}
              <div className="bg-white p-2 rounded-md">
                <Image
                  src="/LOGO.png"
                  alt="SkillSwap Logo"
                  width={32}
                  height={32}
                />
              </div>

              <span className="text-xl font-semibold">
                SkillSwap
              </span>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed max-w-xs">
              Connecting students worldwide through peer-to-peer skill exchange
              and collaborative learning.
            </p>
          </div>

          {/*  QUICK LINKS */}
          <div>
            <h4 className="font-semibold mb-4 text-[#B8860B]">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:text-[#B8860B] transition">
                Home
              </Link>
              <Link href="/about" className="hover:text-[#B8860B] transition">
                About
              </Link>
              <Link href="/contact" className="hover:text-[#B8860B] transition">
                Contact
              </Link>
              <Link href="/login" className="hover:text-[#B8860B] transition">
                Login
              </Link>
            </div>
          </div>

          {/*  CONTACT / EXTRA */}
          <div>
            <h4 className="font-semibold mb-4 text-[#B8860B]">
              Stay Connected
            </h4>

            <p className="text-sm text-gray-200 mb-4">
              Join our community and start learning new skills today.
            </p>

            <button className="px-5 py-2 bg-[#B8860B] rounded-md text-sm hover:scale-105 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} SkillSwap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}