import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChoose";
import HowItWorks from "@/components/HowItWorks";
import TopUsers from "@/components/TopUsers";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#F8F9F4] min-h-screen">
      <Navbar />
      <Hero />
      <WhyChoose />
      <HowItWorks />
      <section className="text-center py-16">
        <h2 className="text-3xl font-semibold mb-4 text-[#556B2F]">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-700 mb-6">
          Join thousands of students already exchanging skills and building their expertise together.
        </p>
        <div className="space-x-4">
          <button className="px-6 py-3 bg-[#B8860B] text-white rounded hover:bg-[#a0750b] transition">
            Register Now
          </button>
          <button className="px-6 py-3 border border-[#556B2F] text-[#556B2F] rounded hover:bg-[#556B2F] hover:text-white transition">
            Login
          </button>
        </div>
      </section>
      <TopUsers />
      <Footer />
    </main>
  );
}
