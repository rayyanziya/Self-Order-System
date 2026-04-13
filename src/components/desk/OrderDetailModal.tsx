"use client";

import { useState } from "react";
import type { OrderDTO } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import PaymentSimulator from "./PaymentSimulator";
import { CURRENCY } from "@/lib/constants";

interface OrderDetailModalProps {
  order: OrderDTO | null;
  onClose: () => void;
  onPaid: () => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onPaid,
}: OrderDetailModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handlePaid = () => {
    onPaid();
    handleClose();
  };

  return (
    <Modal
      open={!!order}
      onClose={handleClose}
      title={order ? order.orderNumber : ""}
    >
      {order && (
        <div className="space-y-4">
          {/* Order items */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-stone-700">
                  {item.menuItem.name} × {item.quantity}
                </span>
                <span className="font-medium text-stone-900">
                  {item.unitPrice * item.quantity} {CURRENCY}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-base border-t border-stone-200 pt-3">
            <span>Total</span>
            <span className="text-orange-600">
              {order.totalAmount} {CURRENCY}
            </span>
          </div>

          {!confirmed ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setConfirmed(true)}
            >
              Confirm Order
            </Button>
          ) : (
            <PaymentSimulator
              orderId={order.id}
              totalAmount={order.totalAmount}
              onSuccess={handlePaid}
            />
          )}
        </div>
      )}
    </Modal>
  );
}
