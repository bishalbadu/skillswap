// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaCheckCircle,
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
//   const [showPw, setShowPw] = useState(false);
//   const [showConfirmPw, setShowConfirmPw] = useState(false);

//   // ✅ NEW: popup state
//   const [showPopup, setShowPopup] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setError("");

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
//       return;
//     }

//     // ✅ SUCCESS → show popup
//     setShowPopup(true);

//     // reset form
//     setForm({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       agree: false,
//     });
//   };

//   return (
//     <>
//       {/* ✅ VERIFICATION POPUP */}
//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <motion.div
//             initial={{ scale: 0.85, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-2xl"
//           >
//             <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
//             <h2 className="text-2xl font-bold mb-2">
//               Verification Email Sent
//             </h2>
//             <p className="text-gray-600 mb-6">
//               A verification link has been sent to your email.  
//               Please check your inbox to activate your account.
//             </p>
//             <button
//               onClick={() => {
//                 setShowPopup(false);
//                 router.push("/login");
//               }}
//               className="bg-[#4a5e27] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
//             >
//               OK
//             </button>
//           </motion.div>
//         </div>
//       )}

//       {/* 🔽 MAIN REGISTER UI */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex justify-center items-center h-screen bg-gradient-to-br from-[#4a5e27] via-[#cfc9a1] to-[#eadba5]"
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="flex w-[1050px] h-[650px] bg-white shadow-2xl rounded-3xl overflow-hidden"
//         >
//           {/* LEFT PANEL */}
//           <motion.div
//             initial={{ x: -80, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="w-1/2 bg-gradient-to-br from-[#4a5e27] to-[#eadba5] text-white flex flex-col justify-center items-center p-12"
//           >
//             <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
//             <p className="text-lg mb-6 opacity-90">Already have an account?</p>
//             <a
//               href="/login"
//               className="border-2 border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[#4a5e27] transition"
//             >
//               Login
//             </a>
//           </motion.div>

//           {/* RIGHT PANEL */}
//           <motion.div
//             initial={{ x: 80, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="w-1/2 p-16 flex flex-col justify-center"
//           >
//             <h2 className="text-4xl font-bold text-[#4a5e27] text-center mb-10">
//               Register
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* NAME */}
//               <div className="flex gap-4">
//                 <div className="relative w-1/2">
//                   <FaUser className="absolute top-4 left-3 text-gray-500" />
//                   <input
//                     type="text"
//                     placeholder="First Name"
//                     value={form.firstName}
//                     onChange={(e) =>
//                       setForm({ ...form, firstName: e.target.value })
//                     }
//                     className="w-full border rounded-md pl-10 p-4 text-lg"
//                     required
//                   />
//                 </div>

//                 <div className="relative w-1/2">
//                   <FaUser className="absolute top-4 left-3 text-gray-500" />
//                   <input
//                     type="text"
//                     placeholder="Last Name"
//                     value={form.lastName}
//                     onChange={(e) =>
//                       setForm({ ...form, lastName: e.target.value })
//                     }
//                     className="w-full border rounded-md pl-10 p-4 text-lg"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* EMAIL */}
//               <div className="relative">
//                 <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={form.email}
//                   onChange={(e) =>
//                     setForm({ ...form, email: e.target.value })
//                   }
//                   className="w-full border rounded-md pl-10 p-4 text-lg"
//                   required
//                 />
//               </div>

//               {/* PASSWORDS */}
//               <div className="flex gap-4">
//                 <div className="relative w-1/2">
//                   <FaLock className="absolute top-4 left-3 text-gray-500" />
//                   <input
//                     type={showPw ? "text" : "password"}
//                     placeholder="Password"
//                     value={form.password}
//                     onChange={(e) =>
//                       setForm({ ...form, password: e.target.value })
//                     }
//                     className="w-full border rounded-md pl-10 pr-10 p-4 text-lg"
//                     required
//                   />
//                   <span
//                     onClick={() => setShowPw(!showPw)}
//                     className="absolute top-4 right-3 cursor-pointer"
//                   >
//                     {showPw ? <FaEye /> : <FaEyeSlash />}
//                   </span>
//                 </div>

//                 <div className="relative w-1/2">
//                   <FaLock className="absolute top-4 left-3 text-gray-500" />
//                   <input
//                     type={showConfirmPw ? "text" : "password"}
//                     placeholder="Confirm Password"
//                     value={form.confirmPassword}
//                     onChange={(e) =>
//                       setForm({ ...form, confirmPassword: e.target.value })
//                     }
//                     className="w-full border rounded-md pl-10 pr-10 p-4 text-lg"
//                     required
//                   />
//                   <span
//                     onClick={() => setShowConfirmPw(!showConfirmPw)}
//                     className="absolute top-4 right-3 cursor-pointer"
//                   >
//                     {showConfirmPw ? <FaEye /> : <FaEyeSlash />}
//                   </span>
//                 </div>
//               </div>

//               {/* TERMS */}
//               <div className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={form.agree}
//                   onChange={(e) =>
//                     setForm({ ...form, agree: e.target.checked })
//                   }
//                 />
//                 <label>
//                   I agree to the{" "}
//                   <span className="text-[#B8860B] underline">
//                     Terms & Conditions
//                   </span>
//                 </label>
//               </div>

//               {/* ERROR */}
//               {error && <p className="text-red-600 text-center">{error}</p>}

//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-[#4a5e27] to-[#eadba5] text-white py-4 rounded-md text-lg font-semibold"
//               >
//                 Register
//               </motion.button>

//               <p className="text-center text-sm text-gray-600">
//                 or register with Google
//               </p>

//               {/* GOOGLE REGISTER */}
//               <div className="flex justify-center">
//                 <GoogleLogin
//                   onSuccess={async (cred) => {
//                     const res = await fetch("/api/auth/google", {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ credential: cred.credential }),
//                     });

//                     if (!res.ok) {
//                       setError("Google registration failed");
//                       return;
//                     }

//                     router.push("/dashboard");
//                   }}
//                   onError={() => setError("Google registration failed")}
//                 />
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </>
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

  const [showPopup, setShowPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);
const [cooldown, setCooldown] = useState(0);
const handleClosePopup = () => {
  setShowPopup(false);
  setOtp("");
  setOtpError("");
  setPendingEmail("");
};

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

    // ✅ SUCCESS → show OTP popup
    setPendingEmail(data.email);
    setShowPopup(true);
    setOtp("");
    setOtpError("");

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
const handleResendOtp = async () => {
  try {
    setResending(true);

    await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: pendingEmail }),
    });

    setCooldown(30); // 30 sec cooldown

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } finally {
    setResending(false);
  }
};

  const handleVerifyOtp = async () => {
    try {
      setVerifyingOtp(true);
      setOtpError("");

   

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "OTP verification failed");
        return;
      }

      setShowPopup(false);
      router.push("/login");
    } catch (error) {
      setOtpError("Something went wrong while verifying OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <>
      {/* ✅ VERIFICATION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-2xl p-8 w-[420px] text-center shadow-2xl"
          >
            <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>

            <p className="text-gray-600 mb-4">
              We sent a 6-digit OTP code to <br />
              <span className="font-semibold">{pendingEmail}</span>
            </p>

            <input
  type="text"
  maxLength={6}
  value={otp}
  autoFocus
  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
  placeholder="Enter 6-digit OTP"
  className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-[0.4em] mb-4"
/>
<button
  onClick={handleClosePopup}
  className="absolute top-3 right-4 text-lg font-bold text-gray-500 hover:text-black"
>
  ×
</button>

            {otpError && <p className="text-red-600 text-sm mb-3">{otpError}</p>}

            

            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.length !== 6}
              className="bg-[#4a5e27] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 w-full"
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            <button

  onClick={handleResendOtp}
  disabled={resending || cooldown > 0}
  className="mt-3 text-sm text-[#4a5e27] underline disabled:opacity-50"
>
  {cooldown > 0
    ? `Resend in ${cooldown}s`
    : resending
    ? "Sending..."
    : "Resend OTP"}
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