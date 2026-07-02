/**
 * Input Component
 *
 * @param {Object} props
 * @param {string} props.label - Input label.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string} [props.type="text"] - Input type.
 * @param {string} props.value - Input value.
 * @param {Function} props.onChange - Change event handler.
 * @param {string} [props.error] - Error message displayed below the input.
 * @param {boolean} [props.disabled=false] - Disables the input.
 * @param {string} [props.className] - Additional CSS classes.
 */

export default function Input({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  error = "",
  disabled = false,
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block font-label text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-md border bg-card
          px-4 py-2.5 text-ink placeholder-ink-soft/50
          transition
          border-line
          focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30
          disabled:cursor-not-allowed disabled:opacity-50
          dark:bg-card-dark dark:text-ink-dark dark:placeholder-ink-soft-dark/50 dark:border-line-dark
          dark:focus:border-forest-dark dark:focus:ring-forest-dark/30
          ${error ? "border-clay focus:ring-clay/30 dark:border-clay-dark" : ""}
          ${className}
        `}
      />

      {error && (
        <p className="mt-1.5 font-label text-xs text-clay dark:text-clay-dark">
          {error}
        </p>
      )}
    </div>
  );
}