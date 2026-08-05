import { useEffect, useState } from "react";
import { Loader, showErrorToast, showSuccessToast } from "../components/ui";
import { getDashboardSummary } from "../services/api";
import { useAuth } from "../context/AuthContext";

function StatCard({ label, value, subtext, colorClass, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl border p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isActive
          ? "border-forest bg-forest/5 ring-2 ring-forest/30 dark:border-forest-dark dark:bg-forest-dark/10 dark:ring-forest-dark/30"
          : "border-line bg-card hover:border-forest/40 dark:border-line-dark dark:bg-card-dark dark:hover:border-forest-dark/40"
      }`}
    >
      <p className={`font-display text-3xl font-bold ${colorClass || "text-ink dark:text-ink-dark"}`}>
        {value}
      </p>
      <p className="mt-1 font-label text-xs font-semibold uppercase tracking-wider text-ink dark:text-ink-dark">
        {label}
      </p>
      {subtext && (
        <p className="mt-1 font-label text-[10px] text-ink-soft dark:text-ink-soft-dark">
          {subtext}
        </p>
      )}
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive filters
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");

  useEffect(() => {
    let cancelled = false;

    getDashboardSummary()
      .then((res) => {
        if (!cancelled) setSummary(res.data);
      })
      .catch((err) => {
        console.error(err);
        showErrorToast("Failed to load dashboard analytics.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
    showSuccessToast("AI Response copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  const total = summary?.total_reviews ?? 0;
  const sentiments = summary?.sentiment_breakdown ?? [];
  const themes = summary?.top_themes ?? [];
  const recent = summary?.recent_reviews ?? [];
  const quickStats = summary?.quick_stats ?? {};

  const positivePct = quickStats.positive_pct ?? 0;
  const neutralPct = quickStats.neutral_pct ?? 0;
  const negativePct = quickStats.negative_pct ?? 0;

  const positiveCount = quickStats.positive ?? 0;
  const neutralCount = quickStats.neutral ?? 0;
  const negativeCount = quickStats.negative ?? 0;

  // Filter reviews based on user clicks
  const filteredReviews = recent.filter((r) => {
    const matchesSentiment =
      selectedSentiment === "all" ||
      (r.sentiments && r.sentiments.toLowerCase() === selectedSentiment.toLowerCase());
    const matchesTheme =
      selectedTheme === "all" ||
      (r.theme && r.theme.toLowerCase() === selectedTheme.toLowerCase());
    return matchesSentiment && matchesTheme;
  });

  const isFiltered = selectedSentiment !== "all" || selectedTheme !== "all";

  const clearFilters = () => {
    setSelectedSentiment("all");
    setSelectedTheme("all");
  };

  return (
    <div className="mx-auto max-w-6xl py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:text-forest-dark">
            {user?.homestay_name ? `🏡 ${user.homestay_name}` : "Executive Analytics"}
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink dark:text-ink-dark">
            Analytics & Insights
          </h1>
        </div>

        {isFiltered && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-label text-xs font-semibold uppercase tracking-wide text-ink-soft transition hover:bg-forest/10 hover:text-forest dark:border-line-dark dark:text-ink-soft-dark dark:hover:bg-forest-dark/10 dark:hover:text-forest-dark"
          >
            <span>✕ Clear Active Filters</span>
          </button>
        )}
      </div>

      {/* Interactive Stat Cards Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Reviews"
          value={total}
          subtext="Logged entries"
          isActive={selectedSentiment === "all" && selectedTheme === "all"}
          onClick={clearFilters}
        />
        <StatCard
          label="Positive"
          value={`${positivePct}%`}
          subtext={`${positiveCount} reviews`}
          colorClass="text-emerald-600 dark:text-emerald-400"
          isActive={selectedSentiment === "positive"}
          onClick={() => setSelectedSentiment(selectedSentiment === "positive" ? "all" : "positive")}
        />
        <StatCard
          label="Neutral"
          value={`${neutralPct}%`}
          subtext={`${neutralCount} reviews`}
          colorClass="text-amber-600 dark:text-amber-400"
          isActive={selectedSentiment === "neutral"}
          onClick={() => setSelectedSentiment(selectedSentiment === "neutral" ? "all" : "neutral")}
        />
        <StatCard
          label="Negative"
          value={`${negativePct}%`}
          subtext={`${negativeCount} reviews`}
          colorClass="text-rose-600 dark:text-rose-400"
          isActive={selectedSentiment === "negative"}
          onClick={() => setSelectedSentiment(selectedSentiment === "negative" ? "all" : "negative")}
        />
      </div>

      {/* Visual Charts Section */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Sentiment Distribution Card */}
        <div className="rounded-xl border border-line bg-card p-6 shadow-sm dark:border-line-dark dark:bg-card-dark">
          <div className="mb-4 flex items-center justify-between border-b border-dashed border-line pb-3 dark:border-line-dark">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
              Sentiment Breakdown
            </h2>
            <span className="font-label text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              Click bar to filter
            </span>
          </div>

          {/* Stacked Distribution Bar */}
          <div className="mb-6 overflow-hidden rounded-full bg-line/50 dark:bg-line-dark/50 flex h-4 w-full">
            <div
              style={{ width: `${positivePct}%` }}
              className="bg-emerald-500 transition-all duration-500 hover:brightness-110 cursor-pointer"
              title={`Positive: ${positivePct}%`}
              onClick={() => setSelectedSentiment(selectedSentiment === "positive" ? "all" : "positive")}
            />
            <div
              style={{ width: `${neutralPct}%` }}
              className="bg-amber-400 transition-all duration-500 hover:brightness-110 cursor-pointer"
              title={`Neutral: ${neutralPct}%`}
              onClick={() => setSelectedSentiment(selectedSentiment === "neutral" ? "all" : "neutral")}
            />
            <div
              style={{ width: `${negativePct}%` }}
              className="bg-rose-500 transition-all duration-500 hover:brightness-110 cursor-pointer"
              title={`Negative: ${negativePct}%`}
              onClick={() => setSelectedSentiment(selectedSentiment === "negative" ? "all" : "negative")}
            />
          </div>

          {/* Detailed Progress Bars */}
          <div className="space-y-4">
            <div
              onClick={() => setSelectedSentiment(selectedSentiment === "positive" ? "all" : "positive")}
              className={`cursor-pointer rounded-lg p-2.5 transition ${
                selectedSentiment === "positive" ? "bg-emerald-500/10 dark:bg-emerald-500/20" : "hover:bg-line/20 dark:hover:bg-line-dark/20"
              }`}
            >
              <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Positive
                </span>
                <span className="text-ink dark:text-ink-dark">{positivePct}% ({positiveCount})</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line/40 dark:bg-line-dark/40">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${positivePct}%` }}
                />
              </div>
            </div>

            <div
              onClick={() => setSelectedSentiment(selectedSentiment === "neutral" ? "all" : "neutral")}
              className={`cursor-pointer rounded-lg p-2.5 transition ${
                selectedSentiment === "neutral" ? "bg-amber-400/10 dark:bg-amber-400/20" : "hover:bg-line/20 dark:hover:bg-line-dark/20"
              }`}
            >
              <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  Neutral
                </span>
                <span className="text-ink dark:text-ink-dark">{neutralPct}% ({neutralCount})</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line/40 dark:bg-line-dark/40">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${neutralPct}%` }}
                />
              </div>
            </div>

            <div
              onClick={() => setSelectedSentiment(selectedSentiment === "negative" ? "all" : "negative")}
              className={`cursor-pointer rounded-lg p-2.5 transition ${
                selectedSentiment === "negative" ? "bg-rose-500/10 dark:bg-rose-500/20" : "hover:bg-line/20 dark:hover:bg-line-dark/20"
              }`}
            >
              <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  Negative
                </span>
                <span className="text-ink dark:text-ink-dark">{negativePct}% ({negativeCount})</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line/40 dark:bg-line-dark/40">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${negativePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Themes Chart Card */}
        <div className="rounded-xl border border-line bg-card p-6 shadow-sm dark:border-line-dark dark:bg-card-dark">
          <div className="mb-4 flex items-center justify-between border-b border-dashed border-line pb-3 dark:border-line-dark">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
              Top Feedback Themes
            </h2>
            <span className="font-label text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              Click tag to filter
            </span>
          </div>

          {themes.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-soft dark:text-ink-soft-dark">
              No recurring themes detected yet. Log a review to see themes!
            </p>
          ) : (
            <div className="space-y-4">
              {themes.map((t) => {
                const themeName = t.theme || "General";
                const isSelected = selectedTheme.toLowerCase() === themeName.toLowerCase();
                const pct = total ? Math.round((t.count / total) * 100) : 0;

                return (
                  <div
                    key={themeName}
                    onClick={() => setSelectedTheme(isSelected ? "all" : themeName)}
                    className={`cursor-pointer rounded-lg p-2.5 transition ${
                      isSelected
                        ? "bg-forest/10 dark:bg-forest-dark/20 ring-1 ring-forest/30 dark:ring-forest-dark/30"
                        : "hover:bg-line/20 dark:hover:bg-line-dark/20"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                      <span className="font-label uppercase tracking-wide text-ink dark:text-ink-dark">
                        🏷️ {themeName}
                      </span>
                      <span className="text-ink-soft dark:text-ink-soft-dark">
                        {t.count} mentions ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-line/40 dark:bg-line-dark/40">
                      <div
                        className="h-full bg-forest transition-all duration-500 dark:bg-forest-dark"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Feed Section */}
      <div className="rounded-xl border border-line bg-card p-6 shadow-sm dark:border-line-dark dark:bg-card-dark">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-dashed border-line pb-4 dark:border-line-dark">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
              Recent Feedback Feed
            </h2>
            <p className="text-xs text-ink-soft dark:text-ink-soft-dark">
              Showing {filteredReviews.length} of {recent.length} recent entries
            </p>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-[10px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              Filters:
            </span>
            <button
              onClick={() => setSelectedSentiment("all")}
              className={`rounded-full px-3 py-1 font-label text-[10px] uppercase tracking-wide transition ${
                selectedSentiment === "all"
                  ? "bg-forest text-white dark:bg-forest-dark dark:text-paper-dark"
                  : "border border-line text-ink-soft hover:bg-line/20 dark:border-line-dark dark:text-ink-soft-dark"
              }`}
            >
              All Sentiments
            </button>
            <button
              onClick={() => setSelectedSentiment("positive")}
              className={`rounded-full px-3 py-1 font-label text-[10px] uppercase tracking-wide transition ${
                selectedSentiment === "positive"
                  ? "bg-emerald-600 text-white"
                  : "border border-line text-emerald-600 hover:bg-emerald-50 dark:border-line-dark dark:text-emerald-400"
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setSelectedSentiment("neutral")}
              className={`rounded-full px-3 py-1 font-label text-[10px] uppercase tracking-wide transition ${
                selectedSentiment === "neutral"
                  ? "bg-amber-500 text-white"
                  : "border border-line text-amber-600 hover:bg-amber-50 dark:border-line-dark dark:text-amber-400"
              }`}
            >
              Neutral
            </button>
            <button
              onClick={() => setSelectedSentiment("negative")}
              className={`rounded-full px-3 py-1 font-label text-[10px] uppercase tracking-wide transition ${
                selectedSentiment === "negative"
                  ? "bg-rose-600 text-white"
                  : "border border-line text-rose-600 hover:bg-rose-50 dark:border-line-dark dark:text-rose-400"
              }`}
            >
              Negative
            </button>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-lg text-ink dark:text-ink-dark">
              No matching reviews found for active filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 text-xs font-semibold text-forest underline dark:text-forest-dark"
            >
              Reset active filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((r) => {
              const sentiment = (r.sentiments || "Neutral").toLowerCase();
              const badgeStyle =
                sentiment === "positive"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : sentiment === "negative"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";

              return (
                <div
                  key={r.id}
                  className="rounded-lg border border-line bg-card p-5 shadow-sm transition hover:shadow-md dark:border-line-dark dark:bg-card-dark"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-ink dark:text-ink-dark">
                      {r.guest_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {r.sentiments || "Neutral"}
                      </span>
                      <span className="rounded-md border border-line px-2.5 py-0.5 font-label text-[10px] uppercase tracking-wider text-ink-soft dark:border-line-dark dark:text-ink-soft-dark">
                        {r.theme || "General"}
                      </span>
                    </div>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
                    "{r.reviews}"
                  </p>

                  {r.ai_response && (
                    <div className="rounded-md border border-forest/20 bg-forest/5 p-3 dark:border-forest-dark/30 dark:bg-forest-dark/10">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-label text-[10px] font-bold uppercase tracking-wider text-forest dark:text-forest-dark">
                          ✨ AI Management Response
                        </span>
                        <button
                          onClick={() => handleCopyResponse(r.ai_response)}
                          className="font-label text-[10px] font-semibold uppercase tracking-wide text-forest hover:underline dark:text-forest-dark"
                        >
                          📋 Copy Response
                        </button>
                      </div>
                      <p className="text-xs italic text-ink-soft dark:text-ink-soft-dark">
                        "{r.ai_response}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
