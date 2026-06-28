import { useEffect, useState } from "react";
import { getReviews } from "../services/api";
import {
  Loader,
  Toast,
  showErrorToast,
} from "../components/ui";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getReviews();
      setReviews(response.data);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <Toast />

      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        Guest Reviews
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6"
          >
            <h2 className="text-xl font-semibold dark:text-white">
              {review.guest_name}
            </h2>

            <p className="mt-3 text-gray-700 dark:text-gray-300">
              {review.review}
            </p>

            <div className="mt-5 flex justify-between">
              <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                {review.sentiment}
              </span>

              <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {review.theme}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}