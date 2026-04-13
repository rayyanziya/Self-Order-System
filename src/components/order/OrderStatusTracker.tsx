import type { OrderStatus } from "@/lib/types";

const steps: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: "WAITING_PAYMENT",
    label: "Waiting Payment",
    description: "Go to the payment desk and tap your order number",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    description: "Our kitchen is preparing your order",
  },
  {
    status: "READY",
    label: "Ready!",
    description: "Come collect your order from the desk",
  },
];

const ORDER: OrderStatus[] = ["WAITING_PAYMENT", "IN_PROGRESS", "READY"];

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.status} className="flex items-start gap-4">
            {/* Circle indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-orange-500 text-white ring-4 ring-orange-100"
                    : "bg-stone-200 text-stone-400"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    isDone ? "bg-green-400" : "bg-stone-200"
                  }`}
                />
              )}
            </div>

            {/* Text */}
            <div className="pt-1 pb-4">
              <p
                className={`font-semibold ${
                  isActive
                    ? "text-orange-600"
                    : isDone
                    ? "text-green-700"
                    : "text-stone-400"
                }`}
              >
                {step.label}
              </p>
              {isActive && (
                <p className="text-sm text-stone-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
