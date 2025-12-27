"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch(`/api/profile/public/${id}`);
    const data = await res.json();
    setProfile(data);
    setLoading(false);
  }

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (!profile?.user) return <div className="p-10">User not found.</div>;

  const { user, skillsOffered } = profile;

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">

      {/* PROFILE HEADER */}
      <div className="bg-white border rounded-2xl p-6 flex gap-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#4a5e27] text-white flex items-center justify-center text-3xl font-bold">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={user.rating} />
            <span className="text-sm text-gray-600">
              {user.rating} ({user.reviewsCount} reviews)
            </span>
          </div>

          <p className="text-gray-700 mt-3 max-w-xl">
            {user.bio || "No bio provided."}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SKILLS OFFERED */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Skills Offered</h2>

        {skillsOffered.length === 0 && (
          <p className="text-gray-600">No public skills available.</p>
        )}

        <div className="grid grid-cols-2 gap-5">
          {skillsOffered.map((skill: any) => (
            <div key={skill.id} className="bg-white border rounded-xl p-5">
              <div className="text-lg font-bold">{skill.name}</div>
              <p className="text-sm text-gray-600 mt-1">{skill.description}</p>

              <div className="text-sm mt-3 space-y-1 text-gray-700">
                <div>Level: {skill.level}</div>
                <div>Platform: {skill.platform}</div>
                <div>
                  Availability: {skill.days} ({skill.timeFrom} – {skill.timeTo})
                </div>
                <div>Session: {skill.sessionLength} mins</div>
              </div>

              <button className="mt-4 w-full bg-[#4a5e27] text-white rounded py-2">
                Request Swap
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS PLACEHOLDER */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        <p className="text-gray-600 text-sm">
          Review system will be introduced in a future update.
        </p>
      </div>
    </div>
  );
}

/* ⭐ STAR RATING COMPONENT */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="text-yellow-500">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </div>
  );
}
