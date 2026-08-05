import { useEffect, useState } from "react";
import Card from "../components/Card";
import { Loader, showErrorToast } from "../components/ui";
import { getDashboardSummary } from "../services/api";

function StatBlock({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-card px-5 py-4 text-center shadow-sm dark:border-line-dark dark:bg-card-dark">
      <p className="font-display text-3xl font-semibold text-ink dark:text-ink-dark">{value}</p>
      <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">
        {label}
      </p>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-paper dark:bg-paper-dark min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const total = summary?.total_reviews ?? 0;
  const sentiments = summary?.sentiment_breakdown ?? [];
  const themes = summary?.top_themes ?? [];
  const recent = summary?.recent_reviews ?? [];

  const sentimentSummary =
    sentiments.length > 0
      ? sentiments
          .map((s) => `${s.percentage}% ${s.sentiment.toLowerCase()}`)
          .join(", ")
      : "No reviews logged yet — analytics will appear once feedback comes in.";

  const themeSummary =
    themes.length > 0
      ? `Guests most frequently mention: ${themes.map((t) => t.theme).join(", ")}.`
      : "No recurring themes detected yet.";

  const topSentiment = sentiments[0];
  const recommendation = topSentiment
    ? topSentiment.sentiment.toLowerCase() === "negative"
      ? "Negative feedback is trending — review recent comments and address recurring pain points first."
      : "Sentiment looks healthy overall. Keep an eye on the top themes below and lean into what's working."
    : "Log a few reviews to unlock AI-driven recommendations.";

  return (
    <div className="justify-center py-10 bg-paper dark:bg-paper-dark min-h-screen">
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatBlock label="Total Reviews" value={total} />
        <StatBlock label="Positive" value={`${summary?.quick_stats?.positive_pct ?? 0}%`} />
        <StatBlock label="Neutral" value={`${summary?.quick_stats?.neutral_pct ?? 0}%`} />
        <StatBlock label="Negative" value={`${summary?.quick_stats?.negative_pct ?? 0}%`} />
      </div>

      <div className="flex flex-wrap gap-4 mb-8 bg-paper dark:bg-paper-dark">
        <Card title="Sentiment Overview" description={sentimentSummary} />
        <Card title="Top Feedback Themes" description={themeSummary} />
        <Card title="AI Recommendations" description={recommendation} />
      </div>

      {recent.length > 0 && (
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink dark:text-ink-dark">
            Recent Reviews
          </h2>
          <div className="space-y-3">
            {recent.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-line bg-card p-4 text-sm shadow-sm dark:border-line-dark dark:bg-card-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-ink dark:text-ink-dark">{r.guest_name}</span>
                  <span className="font-label text-[10px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                    {r.sentiments} · {r.theme}
                  </span>
                </div>
                <p className="text-ink-soft dark:text-ink-soft-dark">{r.reviews}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
