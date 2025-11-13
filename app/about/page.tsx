export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#F8F9F4] py-20 px-8 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-[#556B2F] mb-6">About SkillSwap</h1>
      <p className="max-w-3xl text-lg text-gray-700 leading-relaxed">
        SkillSwap is a peer-to-peer learning platform designed to empower students to 
        teach and learn from each other. Our mission is to make knowledge exchange 
        accessible, engaging, and community-driven — without financial barriers.
      </p>
      <div className="mt-10 bg-[#B8860B]/90 text-white px-8 py-5 rounded-xl shadow-md max-w-2xl">
        <p className="text-md leading-relaxed">
          Join thousands of students collaborating to grow together — whether you want 
          to learn coding, photography, design, or public speaking, SkillSwap is your space 
          to connect, share, and build.
        </p>
      </div>
    </section>
  );
}
