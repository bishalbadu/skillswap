"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
 
} from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.agree) return setError("You must agree to the terms.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) setSuccess(data.message);
    else setError(data.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gradient-to-br from-[#4a5e27] via-[#cfc9a1] to-[#eadba5]">
    
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-[1050px] h-[650px] bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Panel */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12"
        >
          <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-lg mb-6 opacity-90">Already have an account?</p>
          <a
            href="/login"
            className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27] transition duration-300"
          >
            Login
          </a>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-1/2 p-16 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="relative w-1/2">
                <FaUser className="absolute top-4 left-3 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-full border rounded-md pl-10 pr-4 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27] outline-none"
                  required
                />
              </div>
              <div className="relative w-1/2">
                <FaUser className="absolute top-4 left-3 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="w-full border rounded-md pl-10 pr-4 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27] outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-gray-500 text-lg" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-md pl-10 pr-4 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27] outline-none"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="relative w-1/2">
                <FaLock className="absolute top-4 left-3 text-gray-500 text-lg" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border rounded-md pl-10 pr-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27] outline-none"
                  required
                />
                <span
                  onClick={() => setShowPw(!showPw)}
                  className="absolute top-4 right-3 text-gray-600 text-lg cursor-pointer"
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative w-1/2">
                <FaLock className="absolute top-4 left-3 text-gray-500 text-lg" />
                <input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full border rounded-md pl-10 pr-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27] outline-none"
                  required
                />
                <span
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute top-4 right-3 text-gray-600 text-lg cursor-pointer"
                >
                  {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) =>
                  setForm({ ...form, agree: e.target.checked })
                }
              />
              <label>
                I agree to the{" "}
                <a href="#" className="text-[#B8860B] underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold hover:opacity-90 transition"
            >
              Register
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              or register with social platforms
            </p>
            <div className="flex justify-center gap-6 text-2xl text-[#4a5e27]">
              <FaGoogle className="hover:scale-110 transition" />
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
