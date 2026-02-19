"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gradient-to-br from-[#4a5e27] via-[#cfc9a1] to-[#eadba5]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-[1050px] h-[650px] bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* LEFT */}
        <div className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12">
          <h2 className="text-4xl font-bold mb-3">Hello, Welcome</h2>
          <p className="text-lg mb-6 opacity-90">Don’t have an account?</p>
          <a
            href="/register"
            className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27]"
          >
            Register
          </a>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-md pl-10 p-4 text-lg"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-4 left-3 text-gray-500" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border rounded-md pl-10 pr-10 p-4 text-lg"
                required
              />
              <span
                onClick={() => setShowPw(!showPw)}
                className="absolute top-4 right-3 cursor-pointer"
              >
                {showPw ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold"
            >
              Login
            </motion.button>
          </form>

          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-4">
              or continue with
            </p>

            <GoogleLogin
              onSuccess={async (cred) => {
                const res = await fetch("/api/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ credential: cred.credential }),
                });

                if (!res.ok) {
                  setError("Google login failed");
                  return;
                }

                router.replace("/dashboard");
              }}
              onError={() => setError("Google login failed")}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
