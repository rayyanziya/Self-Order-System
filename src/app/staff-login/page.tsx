"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function StaffLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/kitchen";

  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...pin];
    next[index] = value;
    setPin(next);
    setError(null);
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
    // Auto-submit when last digit entered
    if (value && index === 3) {
      const fullPin = [...next].join("");
      if (fullPin.length === 4) submit(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const submit = async (fullPin?: string) => {
    const code = fullPin ?? pin.join("");
    if (code.length < 4) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });
      if (res.ok) {
        router.replace(next);
      } else {
        setError("Incorrect PIN");
        setPin(["", "", "", ""]);
        inputs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 w-full max-w-xs text-center space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Image src="/logos/logo.png" alt="GDI" width={52} height={52} className="rounded-xl" />
          <h1 className="text-xl font-bold text-stone-900">Staff Access</h1>
          <p className="text-sm text-stone-500">Enter your 4-digit PIN</p>
        </div>

        {/* PIN input boxes */}
        <div className="flex justify-center gap-3">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                error
                  ? "border-red-400 bg-red-50"
                  : digit
                  ? "border-orange-400 bg-orange-50"
                  : "border-stone-300 bg-white focus:border-orange-400"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        <button
          onClick={() => submit()}
          disabled={loading || pin.join("").length < 4}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </div>
    </div>
  );
}
