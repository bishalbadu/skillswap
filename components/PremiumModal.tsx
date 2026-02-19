"use client";

export default function PremiumModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

 async function upgrade(plan: "MONTH_1" | "MONTH_6") {
  try {
    const res = await fetch("/api/billing/esewa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    // 🛑 SAFETY CHECK
    if (!res.ok || !data?.esewaUrl || !data?.payload) {
      console.error("Invalid eSewa response:", data);
      alert("Payment initiation failed. Please try again.");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.esewaUrl;

    Object.entries(data.payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

  } catch (error) {
    console.error("Upgrade error:", error);
    alert("Something went wrong. Please try again.");
  }
}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[400px] text-center space-y-4">
        <h2 className="text-2xl font-bold">
          🔥 SkillSwap Champion!
        </h2>

        <p className="text-gray-600">
          You’ve completed 5 successful swaps — that’s impressive!
          <br />
          Ready to keep growing?
          Upgrade to Premium and enjoy unlimited skill exchanges.
        </p>

        <button
          onClick={() => upgrade("MONTH_1")}
          className="w-full bg-[#2c3a21] text-white py-2 rounded"
        >
          Unlock Unlimited Swaps (1 Month - Rs 2500)
        </button>

        <button
          onClick={() => upgrade("MONTH_6")}
          className="w-full bg-yellow-600 text-white py-2 rounded"
        >
          Unlock 6 Months (Rs 5500)
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 mt-3"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
