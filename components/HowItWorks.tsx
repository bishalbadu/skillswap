"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Profile",
      desc: "Add your skills to teach and the ones you want to learn.",
    },
    {
      number: "2",
      title: "Connect",
      desc: "Browse peers and send swap requests.",
    },
    {
      number: "3",
      title: "Learn & Teach",
      desc: "Collaborate through video or chat and exchange knowledge.",
    },
  ];

  return (
    <section className="bg-[#556B2F]/80 py-16 text-center text-white">
      <h3 className="text-3xl font-semibold mb-8">How It Works ?</h3>
      <div className="flex flex-wrap justify-center gap-8 px-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-[#B8860B]/80 text-white rounded-xl shadow-md p-6 w-[260px] md:w-[280px] hover:scale-105 transform transition"
          >
            <h4 className="text-2xl font-bold mb-2">{step.number}</h4>
            <h5 className="text-lg font-semibold mb-1">{step.title}</h5>
            <p className="text-sm opacity-90">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
