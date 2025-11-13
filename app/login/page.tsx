// "use client";
// import { useState } from "react";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     if (!res.ok) setError(data.error);
//     else alert("Login successful!");
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Welcome Section */}
//       <div className="hidden md:flex w-1/2 bg-[#556B2F] text-white flex-col justify-center items-center p-12 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}>
//         <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
//         <p className="text-sm max-w-md text-center">
//           Please log in using your personal information to stay connected with us.
//         </p>
//       </div>

//       {/* Right Login Form */}
//       <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20">
//         <h2 className="text-3xl font-bold text-[#556B2F] mb-6">LOGIN</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border p-3 rounded" />
//           <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border p-3 rounded" />
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//           <div className="flex justify-between items-center text-sm text-[#B8860B]">
//             <a href="#">Forgot password?</a>
//           </div>
//           <button type="submit" className="w-full bg-[#556B2F] text-white py-3 rounded font-semibold hover:bg-[#445724] transition">
//             Log In
//           </button>
//           <p className="text-center text-sm">
//             Don’t have an account? <a href="/register" className="text-[#B8860B] font-semibold">Signup</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) setError(data.error);
    else alert("Login successful!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gradient-to-br from-[#4a5e27] via-[#cfc9a1] to-[#eadba5]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-[1050px] h-[650px] bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Section with blend effect */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12"
        >
          <h2 className="text-4xl font-bold mb-3">Hello, Welcome</h2>
          <p className="text-lg mb-6 opacity-90">Don’t have an account?</p>
          <a
            href="/register"
            className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27] transition duration-300"
          >
            Register
          </a>
        </motion.div>

        {/* Right Section (White) */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-1/2 p-16 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="relative">
              <FaLock className="absolute top-4 left-3 text-gray-500 text-lg" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="flex justify-between text-sm text-[#B8860B]">
              <a href="#">Forgot Password?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              or login with social platforms
            </p>
            <div className="flex justify-center gap-6 text-2xl text-[#4a5e27]">
              <FaGoogle className="hover:scale-110 transition" />
              <FaFacebook className="hover:scale-110 transition" />
              <FaGithub className="hover:scale-110 transition" />
              <FaLinkedin className="hover:scale-110 transition" />
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
