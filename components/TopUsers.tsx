"use client";
import Image from "next/image";

export default function TopUsers() {
  const users = [
    { img: "/user1.jpg", name: "Alex" },
    { img: "/user2.jpg", name: "Rina" },
    { img: "/user3.jpg", name: "John" },
  ];

  return (
    <section className="bg-white py-16 text-center">
      <h3 className="text-3xl font-semibold mb-8 text-[#556B2F]">
        Top Users of This Week
      </h3>
      <div className="flex flex-wrap justify-center gap-6 px-8">
        {users.map((user, i) => (
          <div
            key={i}
            className="bg-[#B8860B] rounded-lg overflow-hidden shadow-md w-48 h-56 hover:scale-105 transform transition"
          >
            <Image
              src={user.img}
              alt={user.name}
              width={192}
              height={224}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
