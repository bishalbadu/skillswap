// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { GoogleLogin } from "@react-oauth/google";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agree: false,
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [showConfirmPw, setShowConfirmPw] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // REGEX RULES
//     const nameRegex = /^[A-Za-z]+$/;
//     const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

//     if (!form.agree) {
//       return setError("You must agree to the terms and conditions.");
//     }

//     if (!nameRegex.test(form.firstName)) {
//       return setError("First name can contain only alphabets.");
//     }

//     if (!nameRegex.test(form.lastName)) {
//       return setError("Last name can contain only alphabets.");
//     }

//     if (!passwordRegex.test(form.password)) {
//       return setError(
//         "Password must be at least 8 characters and include at least one symbol."
//       );
//     }

//     if (form.password !== form.confirmPassword) {
//       return setError("Passwords do not match.");
//     }

//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error);
//     } else {
//       setSuccess("Registration successful! You can now log in.");
//       setForm({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         agree: false,
//       });
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="flex justify-center items-center h-screen bg-gradient-to-br from-[#4a5e27] via-[#cfc9a1] to-[#eadba5]"
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="flex w-[1050px] h-[650px] bg-white shadow-2xl rounded-3xl overflow-hidden"
//       >
//         {/* LEFT PANEL */}
//         <motion.div
//           initial={{ x: -80, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12"
//         >
//           <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
//           <p className="text-lg mb-6 opacity-90">Already have an account?</p>
//           <a
//             href="/login"
//             className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27] transition"
//           >
//             Login
//           </a>
//         </motion.div>

//         {/* RIGHT PANEL */}
//         <motion.div
//           initial={{ x: 80, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="w-1/2 p-16 flex flex-col justify-center"
//         >
//           <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
//             Register
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* NAME */}
//             <div className="flex gap-4">
//               <div className="relative w-1/2">
//                 <FaUser className="absolute top-4 left-3 text-gray-500" />
//                 <input
//                   type="text"
//                   placeholder="First Name"
//                   value={form.firstName}
//                   onChange={(e) =>
//                     setForm({ ...form, firstName: e.target.value })
//                   }
//                   className="w-full border rounded-md pl-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27]"
//                   required
//                 />
//               </div>

//               <div className="relative w-1/2">
//                 <FaUser className="absolute top-4 left-3 text-gray-500" />
//                 <input
//                   type="text"
//                   placeholder="Last Name"
//                   value={form.lastName}
//                   onChange={(e) =>
//                     setForm({ ...form, lastName: e.target.value })
//                   }
//                   className="w-full border rounded-md pl-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27]"
//                   required
//                 />
//               </div>
//             </div>

//             {/* EMAIL */}
//             <div className="relative">
//               <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//                 className="w-full border rounded-md pl-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27]"
//                 required
//               />
//             </div>

//             {/* PASSWORDS */}
//             <div className="flex gap-4">
//               <div className="relative w-1/2">
//                 <FaLock className="absolute top-4 left-3 text-gray-500" />
//                 <input
//                   type={showPw ? "text" : "password"}
//                   placeholder="Password"
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm({ ...form, password: e.target.value })
//                   }
//                   className="w-full border rounded-md pl-10 pr-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27]"
//                   required
//                 />
//                 <span
//                   onClick={() => setShowPw(!showPw)}
//                   className="absolute top-4 right-3 cursor-pointer"
//                 >
//                   {showPw ? <FaEye /> : <FaEyeSlash />}
//                 </span>
//               </div>

//               <div className="relative w-1/2">
//                 <FaLock className="absolute top-4 left-3 text-gray-500" />
//                 <input
//                   type={showConfirmPw ? "text" : "password"}
//                   placeholder="Confirm Password"
//                   value={form.confirmPassword}
//                   onChange={(e) =>
//                     setForm({ ...form, confirmPassword: e.target.value })
//                   }
//                   className="w-full border rounded-md pl-10 pr-10 p-4 text-lg focus:ring-2 focus:ring-[#4a5e27]"
//                   required
//                 />
//                 <span
//                   onClick={() => setShowConfirmPw(!showConfirmPw)}
//                   className="absolute top-4 right-3 cursor-pointer"
//                 >
//                   {showConfirmPw ? <FaEye /> : <FaEyeSlash />}
//                 </span>
//               </div>
//             </div>

//             {/* TERMS */}
//             <div className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={form.agree}
//                 onChange={(e) =>
//                   setForm({ ...form, agree: e.target.checked })
//                 }
//               />
//               <label>
//                 I agree to the{" "}
//                 <span className="text-[#B8860B] underline">
//                   Terms & Conditions
//                 </span>
//               </label>
//             </div>

//             {/* ERRORS */}
//             {error && <p className="text-red-600 text-center">{error}</p>}
//             {success && <p className="text-green-600 text-center">{success}</p>}

//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               type="submit"
//               className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold"
//             >
//               Register
//             </motion.button>

//             <p className="text-center text-sm text-gray-600">
//               or register with Google
//             </p>

//             {/* 🔹 GOOGLE REGISTER BUTTON (NEW) */}
//             <div className="flex justify-center">
//               <GoogleLogin
//                 onSuccess={async (cred) => {
//                   const res = await fetch("/api/auth/google", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ credential: cred.credential }),
//                   });

//                   if (!res.ok) {
//                     setError("Google registration failed");
//                     return;
//                   }

//                   router.push("/dashboard");
//                 }}
//                 onError={() => setError("Google registration failed")}
//               />
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }


"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ✅ NEW: popup state
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const nameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!form.agree) {
      return setError("You must agree to the terms and conditions.");
    }

    if (!nameRegex.test(form.firstName)) {
      return setError("First name can contain only alphabets.");
    }

    if (!nameRegex.test(form.lastName)) {
      return setError("Last name can contain only alphabets.");
    }

    if (!passwordRegex.test(form.password)) {
      return setError(
        "Password must be at least 8 characters and include at least one symbol."
      );
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // ✅ SUCCESS → show popup
    setShowPopup(true);

    // reset form
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
  };

  return (
    <>
      {/* ✅ VERIFICATION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-2xl"
          >
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Verification Email Sent
            </h2>
            <p className="text-gray-600 mb-6">
              A verification link has been sent to your email.  
              Please check your inbox to activate your account.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                router.push("/login");
              }}
              className="bg-[#4a5e27] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      {/* 🔽 MAIN REGISTER UI */}
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
          {/* LEFT PANEL */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12"
          >
            <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-lg mb-6 opacity-90">Already have an account?</p>
            <a
              href="/login"
              className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27] transition"
            >
              Login
            </a>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 p-16 flex flex-col justify-center"
          >
            <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
              Register
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <FaUser className="absolute top-4 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full border rounded-md pl-10 p-4 text-lg"
                    required
                  />
                </div>

                <div className="relative w-1/2">
                  <FaUser className="absolute top-4 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full border rounded-md pl-10 p-4 text-lg"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
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

              {/* PASSWORDS */}
              <div className="flex gap-4">
                <div className="relative w-1/2">
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

                <div className="relative w-1/2">
                  <FaLock className="absolute top-4 left-3 text-gray-500" />
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="w-full border rounded-md pl-10 pr-10 p-4 text-lg"
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute top-4 right-3 cursor-pointer"
                  >
                    {showConfirmPw ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>

              {/* TERMS */}
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
                  <span className="text-[#B8860B] underline">
                    Terms & Conditions
                  </span>
                </label>
              </div>

              {/* ERROR */}
              {error && <p className="text-red-600 text-center">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold"
              >
                Register
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                or register with Google
              </p>

              {/* GOOGLE REGISTER */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (cred) => {
                    const res = await fetch("/api/auth/google", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: cred.credential }),
                    });

                    if (!res.ok) {
                      setError("Google registration failed");
                      return;
                    }

                    router.push("/dashboard");
                  }}
                  onError={() => setError("Google registration failed")}
                />
              </div>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
