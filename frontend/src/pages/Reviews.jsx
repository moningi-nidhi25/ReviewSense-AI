import { useCallback, useEffect, useState } from "react";
import {
  getReviews,
  searchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/api";
import {
  Button,
  Input,
  Modal,
  Loader,
  SentimentStamp,
  showSuccessToast,
  showErrorToast,
} from "../components/ui";

const PAGE_SIZE = 6;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const res = await searchReviews(query.trim());
        setReviews(res.data);
        setTotal(res.data.length);
      } else {
        const res = await getReviews();
        setReviews(res.data);
        setTotal(res.data.length);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!guestName.trim() || !reviewText.trim()) {
      setFormError("Both guest name and review text are required.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      if (isEditing) {
        await updateReview(editingId, {
          guest_name: guestName.trim(),
          reviews: reviewText.trim(),
        });

        showSuccessToast("Review updated successfully!");
      } else {
        await createReview({
          guest_name: guestName.trim(),
          reviews: reviewText.trim(),
        });

        showSuccessToast(
          "Logged — sentiment & theme auto-detected."
        );
      }

      setGuestName("");
      setReviewText("");

      setEditingId(null);
      setIsEditing(false);

      setIsModalOpen(false);

      fetchReviews();
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this entry from the ledger?")) return;

    try {
      await deleteReview(id);
      showSuccessToast("Entry removed.");
      fetchReviews();
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to delete review.");
    }
  };

  const handleEdit = (review) => {
    setGuestName(review.guest_name);
    setReviewText(review.reviews);

    setEditingId(review.id);
    setIsEditing(true);

    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);

    setIsEditing(false);
    setEditingId(null);

    setGuestName("");
    setReviewText("");
    setFormError("");
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="py-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-label text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:text-forest-dark">
            The Ledger
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink dark:text-ink-dark">
            Guest Reviews
          </h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Log a Review</Button>
      </div>

      <div className="mb-8 max-w-md">
        <Input
          placeholder="Search by guest name or review text..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line py-16 text-center dark:border-line-dark">
          <p className="font-display text-xl text-ink dark:text-ink-dark">
            No entries found.
          </p>
          <p className="mt-1 text-sm text-ink-soft dark:text-ink-soft-dark">
            {query.trim() ? "Try a different search term." : "Log the first review to get started."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="rounded-lg border border-line bg-card p-6 shadow-sm transition hover:shadow-md dark:border-line-dark dark:bg-card-dark"
              >
                <div className="mb-4 flex items-start justify-between border-b border-dashed border-line pb-3 dark:border-line-dark">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">
                      Review #{String(review.id).padStart(3, "0")}
                    </p>
                    <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                      {review.guest_name}
                    </h2>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(review)}
                      className="font-label text-xs uppercase tracking-wide text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(review.id)}
                      className="font-label text-xs uppercase tracking-wide text-ink-soft transition hover:text-clay"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
                  {review.reviews}
                </p>

                <div className="flex items-center justify-between">
                  <SentimentStamp
                    sentiment={review.sentiments}
                    size="sm"
                    rotate={i % 2 === 0 ? -6 : 5}
                  />
                  <span className="rounded-full border border-line px-3 py-1 font-label text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-ink-soft-dark">
                    tag: {review.theme}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!query.trim() && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="font-label text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit Review" : "Log a Guest Review"}
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <Input
            label="Guest Name"
            placeholder="e.g. Priya Nair"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <div className="w-full">
            <label className="mb-1.5 block font-label text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              Review
            </label>
            <textarea
              rows={4}
              placeholder="Write the guest's feedback..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full rounded-md border border-line bg-card px-4 py-2.5 text-ink placeholder-ink-soft/50 transition focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30 dark:border-line-dark dark:bg-card-dark dark:text-ink-dark dark:placeholder-ink-soft-dark/50 dark:focus:border-forest-dark dark:focus:ring-forest-dark/30"
            />
          </div>

          {formError && (
            <p className="font-label text-xs text-clay dark:text-clay-dark">{formError}</p>
          )}

          <p className="font-label text-[11px] text-ink-soft/70 dark:text-ink-soft-dark/70">
            Sentiment and theme are stamped automatically — no need to enter them.
          </p>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? isEditing ? "Updating..." : "Logging..." : isEditing ? "Update Review" : "Log Review"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
