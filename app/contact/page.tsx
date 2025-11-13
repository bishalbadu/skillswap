"use client";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-[#F8F9F4] py-20 px-8 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-[#556B2F] mb-6">Contact Us</h1>
      <p className="max-w-2xl text-gray-700 text-lg mb-8">
        We’d love to hear from you! Whether you have questions, feedback, or 
        collaboration ideas — reach out anytime.
      </p>

      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
          />
        </div>
        <div className="mb-6">
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#B8860B] text-white py-2 rounded-md font-semibold hover:bg-[#a0750b] transition duration-300"
        >
          Send Message
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6">
        Or email us directly at{" "}
        <span className="text-[#B8860B] font-semibold">support@skillswap.com</span>
      </p>
    </section>
  );
}
