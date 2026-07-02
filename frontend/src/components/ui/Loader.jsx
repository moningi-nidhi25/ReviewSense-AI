
/**
 * Loader Component
 *
 * @param {Object} props
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Loader size.
 * @param {string} [props.className] - Additional Tailwind CSS classes.
 */

export default function Loader({
  size = "md",
  className = ""
}) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div
        className={`
          animate-spin
          rounded-full
          border-t-transparent
          border-solid
           border-forest dark:border-forest-dark
          ${sizes[size]}
          ${className}
        `}
      />
    </div>
  );
}