type BannerType = "success" | "info" | "warning" | "error";

const styles: Record<BannerType, string> = {
  success: "bg-green-50 border-green-300 text-green-800",
  info: "bg-blue-50 border-blue-300 text-blue-800",
  warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
  error: "bg-red-50 border-red-300 text-red-800",
};

interface StatusBannerProps {
  type?: BannerType;
  message: string;
  className?: string;
}

export default function StatusBanner({
  type = "info",
  message,
  className = "",
}: StatusBannerProps) {
  return (
    <div
      className={`w-full border rounded-lg px-4 py-3 text-sm font-medium ${styles[type]} ${className}`}
    >
      {message}
    </div>
  );
}
