import { CURRENCY } from "@/lib/constants";

interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
  loading: boolean;
}

export default function CartSummary({ total, onCheckout, loading }: CartSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
      <div className="flex justify-between text-stone-600 text-sm">
        <span>Subtotal</span>
        <span>
          {total} {CURRENCY}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t border-stone-100 pt-3">
        <span>Total</span>
        <span className="text-orange-600">
          {total} {CURRENCY}
        </span>
      </div>
      <button
        onClick={onCheckout}
        disabled={loading || total === 0}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}
