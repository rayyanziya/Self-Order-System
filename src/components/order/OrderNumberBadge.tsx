function getBadgeColor(orderNumber: string): string {
  if (orderNumber.startsWith("AB")) return "bg-purple-600";
  if (orderNumber.startsWith("A")) return "bg-orange-500";
  return "bg-teal-600"; // B prefix
}

interface OrderNumberBadgeProps {
  number: string;
}

export default function OrderNumberBadge({ number }: OrderNumberBadgeProps) {
  return (
    <div
      className={`${getBadgeColor(number)} text-white rounded-2xl px-10 py-6 text-center shadow-lg`}
    >
      <span className="text-5xl font-black tracking-widest">{number}</span>
    </div>
  );
}
