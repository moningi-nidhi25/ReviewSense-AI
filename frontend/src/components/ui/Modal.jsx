import { useEffect, useRef } from "react";

/**
 * Modal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onClose - Function called when the modal is closed.
 * @param {string} props.title - Modal title.
 * @param {React.ReactNode} props.children - Content displayed inside the modal.
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      // Focus modal when opened
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Basic focus trap
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement =
      focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-[2px] dark:bg-black/60"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-line bg-card p-6 shadow-xl outline-none dark:border-line-dark dark:bg-card-dark"
      >
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4 dark:border-line-dark">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
            {title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="font-label text-xl text-ink-soft transition hover:text-clay dark:text-ink-soft-dark dark:hover:text-clay-dark"
          >
            &times;
          </button>
        </div>

        <div className="text-ink-soft dark:text-ink-soft-dark">
          {children}
        </div>
      </div>
    </div>
  );
}