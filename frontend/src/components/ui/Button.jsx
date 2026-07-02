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
      "bg-forest text-card hover:bg-forest-deep focus-visible:outline-forest dark:bg-forest-dark dark:text-ink-dark dark:hover:brightness-110",
    secondary:
      "bg-ink text-card hover:bg-ink-soft focus-visible:outline-ink dark:bg-card-dark dark:text-ink-dark dark:hover:bg-line-dark",
    outline:
      "border border-forest text-forest hover:bg-forest/10 focus-visible:outline-forest dark:border-forest-dark dark:text-forest-dark dark:hover:bg-forest-dark/10",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-label font-semibold uppercase tracking-wide
        transition-all duration-150
        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        active:translate-y-px
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}