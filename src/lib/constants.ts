import type { OrderStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "Waiting Payment",
  IN_PROGRESS: "In Progress",
  READY: "Your order is ready!",
};

export const POLL_INTERVAL_MS = 5000;

export const CURRENCY = "TL";
