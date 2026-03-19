// "use client";
// import Image from "next/image";

// export default function TopUsers() {
//   const users = [
//     { img: "/user1.jpg", name: "Alex" },
//     { img: "/user2.jpg", name: "Rina" },
//     { img: "/user3.jpg", name: "John" },
//   ];

//   return (
//     <section className="bg-white py-16 text-center">
//       <h3 className="text-3xl font-semibold mb-8 text-[#556B2F]">
//         Top Users of This Week
//       </h3>
//       <div className="flex flex-wrap justify-center gap-6 px-8">
//         {users.map((user, i) => (
//           <div
//             key={i}
//             className="bg-[#B8860B] rounded-lg overflow-hidden shadow-md w-48 h-56 hover:scale-105 transform transition"
//           >
//             <Image
//               src={user.img}
//               alt={user.name}
//               width={192}
//               height={224}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  totalRequests: number;
};

export default function TopUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const res = await fetch("/api/top-users");
      const data = await res.json();
      setUsers(data);
    };

    fetchTopUsers();
  }, []);

  return (
    <section className="bg-white py-16 text-center overflow-hidden">
      <h3 className="text-3xl font-semibold mb-12 text-[#556B2F]">
        Top Users of This Week
      </h3>

      <div className="flex justify-center gap-16 px-8">
        {users.slice(0, 3).map((user, i) => (
          <div
            key={i}
            className="relative bg-[#B8860B] rounded-xl shadow-lg w-64 p-4 h-[360px]
                       text-center hover:scale-105 transition card-animate"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {/* 🥇 Highlight top user */}
            {i === 0 && (
              <div className="absolute inset-0 rounded-xl ring-2 ring-yellow-300/50 animate-pulse pointer-events-none" />
            )}

            <Image
              src={user.avatar?.trim() ? user.avatar : "/default-avatar.png"}
              alt={user.firstName}
              width={250}
              height={250}
              className="w-full h-72 object-cover rounded-lg"
            />

            <h4 className="mt-3 font-semibold text-white text-base leading-tight">
              {i === 0 && "🥇 "}
              {i === 1 && "🥈 "}
              {i === 2 && "🥉 "}
              {user.firstName} {user.lastName}
            </h4>

            <p className="text-sm text-white/80">
              {user.totalRequests} swaps
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}