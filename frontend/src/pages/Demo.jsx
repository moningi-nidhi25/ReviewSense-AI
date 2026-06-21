import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  Loader,
  Toast,
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "../components/ui";

export default function Demo() {
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadingToast = () => {
    const toastId = showLoadingToast("Analyzing reviews...");

    setTimeout(() => {
      dismissToast(toastId);
      showSuccessToast("Analysis completed!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* Toast Container */}
      <Toast />

      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-white">
        UI Components Demo
      </h1>
      
      {/* Buttons */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold dark:text-white">
          Buttons
        </h2>

        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button size="sm">
            Small
          </Button>

          <Button size="lg">
            Large
          </Button>

          <Button disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Input */}
      <section className="mb-10 max-w-md">
        <h2 className="mb-4 text-2xl font-semibold dark:text-white">
          Input
        </h2>

        <Input
          label="Guest Name"
          placeholder="Enter guest name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            error="Invalid email address"
          />
        </div>
      </section>

      {/* Loader */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold dark:text-white">
          Loader
        </h2>

        <div className="flex gap-8 items-center">
          <Loader size="sm" />
          <Loader />
          <Loader size="lg" />
        </div>
      </section>

      {/* Modal */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold dark:text-white">
          Modal
        </h2>

        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="ReviewSense AI"
        >
          <p className="mb-4">
            This is a reusable modal component.
          </p>

          <Button onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal>
      </section>

      {/* Toast */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold dark:text-white">
          Toast Notifications
        </h2>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              showSuccessToast("Review uploaded successfully!")
            }
          >
            Success Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              showErrorToast("Failed to analyze review.")
            }
          >
            Error Toast
          </Button>

          <Button
            variant="outline"
            onClick={handleLoadingToast}
          >
            Loading Toast
          </Button>
        </div>
      </section>
    </div>
  );
}