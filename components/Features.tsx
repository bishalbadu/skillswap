const features: string[] = [
  "Premium Membership",
  "Peer-to-Peer Learning",
  "Easy Matching Making",
];

export default function Features() {
  return (
    <section className="text-center py-10">
      <h2 className="text-2xl font-bold mb-6 text-[#556B2F]">
        Why Choose Skill Swap?
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((t: string, i: number) => (
          <div key={i} className="bg-[#eadba5] p-6 rounded-lg shadow">
            <h3 className="font-bold mb-2 text-[#556B2F]">{t}</h3>
            <p className="text-sm opacity-70">
              Most features are free — premium unlocks extra benefits
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
