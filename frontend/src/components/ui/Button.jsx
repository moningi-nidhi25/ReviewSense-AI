/**
 * Button Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content displayed inside the button.
 * @param {"primary" | "secondary" | "outline"} [props.variant="primary"] - Button style variant.
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Button size.
 * @param {boolean} [props.disabled=false] - Disables the button.
 * @param {Function} [props.onClick] - Function called when the button is clicked.
 * @param {"button" | "submit" | "reset"} [props.type="button"] - HTML button type.
 * @param {string} [props.className] - Additional Tailwind CSS classes.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}