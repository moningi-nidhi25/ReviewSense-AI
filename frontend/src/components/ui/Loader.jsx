export default function Loader({
  size = "md",
  color = "border-green-600",
  className = "",
}) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          animate-spin
          rounded-full
          border-t-transparent
          border-solid
          ${sizes[size]}
          ${color}
          ${className}
        `}
      />
    </div>
  );
}