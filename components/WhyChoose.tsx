"use client";

export default function WhyChoose() {
  const features = [
    {
      title: "Premium Membership",
      desc: "Get unlimited access, priority matches, and exclusive tools.",
    },
    {
      title: "Peer-to-Peer Learning",
      desc: "Learn directly from students like you — interactive and fun!",
    },
    {
      title: "Easy Matching",
      desc: "Find your ideal learning partner quickly and effortlessly.",
    },
  ];

  return (
    <section className="bg-white py-16 text-center">
      <h3 className="text-3xl font-semibold mb-8 text-[#556B2F]">
        Why Choose Skill Swap?
      </h3>
      <div className="flex flex-wrap justify-center gap-6 px-8">
        {features.map((item, i) => (
          <div
            key={i}
            className="bg-[#B8860B] text-white rounded-lg shadow-md p-6 w-[280px] md:w-[300px] hover:scale-105 transform transition"
          >
            <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
