"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="bg-[#E9EDE1] shadow-sm py-4 px-8 flex justify-between items-center border-b border-[#D8DCC9] sticky top-0 z-50">
      {/* Left Section: Logo + Brand */}
      <div className="flex items-center space-x-2">
        <Image
          src="/LOGO.png"
          alt="SkillSwap Logo"
          width={42}
          height={42}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-[#556B2F]">
          Skill<span className="text-[#4F6F52]">Swap</span>
        </span>
      </div>

      {/* Middle Section: Nav Links */}
      <div className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`font-medium text-[#4F6F52] hover:text-[#B8860B] transition duration-300 ${
              pathname === link.path ? "text-[#B8860B] underline" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Section: Buttons */}
      <div className="flex space-x-4">
        <Link
          href="/login"
          className="border border-[#556B2F] text-[#556B2F] px-4 py-2 rounded-md hover:bg-[#556B2F] hover:text-white transition duration-300"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#a0750b] transition duration-300"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
