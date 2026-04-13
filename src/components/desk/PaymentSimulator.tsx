"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface PaymentSimulatorProps {
  orderId: number;
  totalAmount: number;
  onSuccess: () => void;
}

type State = "idle" | "processing" | "success";

export default function PaymentSimulator({
  orderId,
  totalAmount,
  onSuccess,
}: PaymentSimulatorProps) {
  const [state, setState] = useState<State>("idle");

  const handlePay = async () => {
    setState("processing");
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Payment failed");

      // Simulate EDC processing delay
      await new Promise((r) => setTimeout(r, 2000));
      setState("success");
      setTimeout(onSuccess, 3000);
    } catch {
      setState("idle");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-4xl">
          ✓
        </div>
        <p className="text-xl font-bold text-green-700">Payment Successful!</p>
        <p className="text-stone-400 text-xs">Window closes automatically...</p>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-stone-800">Processing Payment...</p>
          <p className="text-sm text-stone-500 mt-1">
            Please tap your card or device on the terminal.
          </p>
        </div>
        <div className="w-32 h-20 bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center text-stone-400 text-sm">
          Card Reader
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-stone-600 text-sm text-center">
        Tap your debit or credit card to pay
      </p>
      <div className="text-2xl font-bold text-stone-900">
        {totalAmount} TL
      </div>
      <Button
        variant="primary"
        size="lg"
        onClick={handlePay}
        className="w-full"
      >
        Pay Now
      </Button>
    </div>
  );
}
