import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const statusColors: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border border-blue-300",
  READY: "bg-green-100 text-green-800 border border-green-300",
};

interface BadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function Badge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[status]} ${className}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
