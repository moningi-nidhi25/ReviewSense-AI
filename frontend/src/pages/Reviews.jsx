import { useCallback, useEffect, useState } from "react";
import {
  getReviews,
  searchReviews,
  createReview,
  updateReview,
  deleteReview,
  regenerateResponse,
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
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 6;

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedTone, setSelectedTone] = useState("Warm");
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

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
          tone: selectedTone,
        });

        showSuccessToast("Review updated successfully!");
      } else {
        await createReview({
          guest_name: guestName.trim(),
          reviews: reviewText.trim(),
          tone: selectedTone,
        });

        showSuccessToast("Logged — sentiment, multi-themes & AI response generated!");
      }

      setGuestName("");
      setReviewText("");
      setSelectedTone("Warm");
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
    setSelectedTone("Warm");
    setEditingId(review.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleRegenerateTone = async (reviewId, tone) => {
    setRegeneratingId(reviewId);
    try {
      const res = await regenerateResponse(reviewId, tone);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, ai_response: res.data.ai_response } : r))
      );
      showSuccessToast(`Regenerated AI response in ${tone} tone!`);
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to regenerate response.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setGuestName("");
    setReviewText("");
    setSelectedTone("Warm");
    setFormError("");
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const displayedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportCSV = () => {
    if (!reviews || reviews.length === 0) {
      showErrorToast("No reviews available to export.");
      return;
    }

    const headers = ["ID", "Guest Name", "Review Text", "Sentiment", "Themes", "AI Response"];
    const rows = reviews.map((r) => [
      r.id,
      `"${(r.guest_name || "").replace(/"/g, '""')}"`,
      `"${(r.reviews || "").replace(/"/g, '""')}"`,
      `"${(r.sentiments || "").replace(/"/g, '""')}"`,
      `"${(r.theme || "").replace(/"/g, '""')}"`,
      `"${(r.ai_response || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    const cleanName = (user?.homestay_name || "ReviewSense").replace(/[^a-zA-Z0-9]/g, "_");
    link.setAttribute("download", `${cleanName}_All_Guest_Reviews.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessToast("CSV Report downloaded successfully!");
  };

  const handleExportPDF = () => {
    showSuccessToast("Preparing Executive PDF Report...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-card px-3 py-2 font-label text-xs font-semibold uppercase tracking-wide text-ink transition hover:border-forest hover:text-forest dark:border-line-dark dark:bg-card-dark dark:text-ink-dark dark:hover:border-forest-dark dark:hover:text-forest-dark"
          >
            <span>📥 Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-card px-3 py-2 font-label text-xs font-semibold uppercase tracking-wide text-ink transition hover:border-forest hover:text-forest dark:border-line-dark dark:bg-card-dark dark:text-ink-dark dark:hover:border-forest-dark dark:hover:text-forest-dark"
          >
            <span>🖨️ Export PDF</span>
          </button>

          <Button onClick={() => setIsModalOpen(true)}>+ Log a Review</Button>
        </div>
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
            {displayedReviews.map((review, i) => {
              // Multi-theme parsing: split comma-separated themes
              const themesList = review.theme
                ? review.theme.split(",").map((t) => t.trim()).filter(Boolean)
                : ["General"];

              return (
                <div
                  key={review.id}
                  className="flex flex-col justify-between rounded-lg border border-line bg-card p-6 shadow-sm transition hover:shadow-md dark:border-line-dark dark:bg-card-dark"
                >
                  <div>
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
                      "{review.reviews}"
                    </p>
                  </div>

                  <div>
                    {/* Sentiment & Multi-Theme Tags Badges */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <SentimentStamp
                        sentiment={review.sentiments}
                        size="sm"
                        rotate={i % 2 === 0 ? -6 : 5}
                      />
                      <div className="flex flex-wrap gap-1">
                        {themesList.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line bg-paper/50 px-2.5 py-0.5 font-label text-[9px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-paper-dark/50 dark:text-ink-soft-dark"
                          >
                            tag: {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Management Response Block with Tone Customizer */}
                    {review.ai_response && (
                      <div className="rounded-md border border-forest/20 bg-forest/5 p-3.5 dark:border-forest-dark/30 dark:bg-forest-dark/10">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-1 border-b border-forest/10 pb-1.5 dark:border-forest-dark/20">
                          <div className="flex items-center gap-1 font-label text-[10px] font-bold uppercase tracking-wider text-forest dark:text-forest-dark">
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <span>AI Response</span>
                          </div>

                          {/* Tone Switcher Quick Actions */}
                          <div className="flex items-center gap-1">
                            <span className="font-label text-[9px] text-ink-soft dark:text-ink-soft-dark">Tone:</span>
                            {["Warm", "Formal", "Promotional"].map((t) => (
                              <button
                                key={t}
                                disabled={regeneratingId === review.id}
                                onClick={() => handleRegenerateTone(review.id, t)}
                                className="rounded px-1.5 py-0.5 font-label text-[9px] font-semibold uppercase transition hover:bg-forest/20 dark:hover:bg-forest-dark/30 text-forest dark:text-forest-dark"
                                title={`Regenerate response in ${t} tone`}
                              >
                                {t === "Promotional" ? "Promo" : t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs italic leading-relaxed text-ink-soft dark:text-ink-soft-dark">
                          {regeneratingId === review.id ? (
                            <span className="animate-pulse">Regenerating response...</span>
                          ) : (
                            `"${review.ai_response}"`
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
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

          {/* Preferred Response Tone Customizer */}
          <div className="w-full">
            <label className="mb-1.5 block font-label text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              AI Response Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full rounded-md border border-line bg-card px-4 py-2 text-xs font-label uppercase tracking-wide text-ink transition focus:border-forest focus:outline-none dark:border-line-dark dark:bg-card-dark dark:text-ink-dark"
            >
              <option value="Warm">🌿 Warm & Hospitable (Default)</option>
              <option value="Formal">💼 Formal & Executive</option>
              <option value="Promotional">🎁 Promotional (10% Off Invitation)</option>
            </select>
          </div>

          {formError && (
            <p className="font-label text-xs text-clay dark:text-clay-dark">{formError}</p>
          )}

          <p className="font-label text-[11px] text-ink-soft/70 dark:text-ink-soft-dark/70">
            Sentiment and multi-themes are auto-extracted by Gemini AI.
          </p>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? isEditing ? "Updating..." : "Logging..." : isEditing ? "Update Review" : "Log Review"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
