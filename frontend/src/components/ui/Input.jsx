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
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          w-full rounded-lg border
          border-gray-300
          bg-white
          px-4 py-2.5
          text-gray-900
          placeholder-gray-400
          transition
          focus:border-green-500
          focus:outline-none
          focus:ring-2
          focus:ring-green-400
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          dark:border-gray-600
          dark:bg-gray-800
          dark:text-white
          dark:placeholder-gray-500
          ${error ? "border-red-500 focus:ring-red-400" : ""}
          ${className}
        `}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}