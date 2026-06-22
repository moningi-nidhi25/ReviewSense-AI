import { Toaster, toast } from "react-hot-toast";
/**
 * Toast Component
 *
 * Renders the global toast notification container.
 * Use helper functions (showSuccessToast, showErrorToast, showLoadingToast, dismissToast)
 * to trigger notifications.
 */

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#1f2937",
          color: "#fff",
        },
      }}
    />
  );
}

// Helper functions
export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showLoadingToast = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};