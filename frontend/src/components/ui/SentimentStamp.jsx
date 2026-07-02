const STAMP_CLASSES = {
  Positive: "border-forest/60 text-forest dark:border-forest-dark/60 dark:text-forest-dark",
  Neutral: "border-ochre/60 text-ochre dark:border-ochre-dark/60 dark:text-ochre-dark",
  Negative: "border-clay/60 text-clay dark:border-clay-dark/60 dark:text-clay-dark",
};

const RING_CLASSES = {
  Positive: "border-forest/35 dark:border-forest-dark/35",
  Neutral: "border-ochre/35 dark:border-ochre-dark/35",
  Negative: "border-clay/35 dark:border-clay-dark/35",
};

/**
 * SentimentStamp — the app's signature visual device.
 * A rotated, double-ring "ink stamp" badge, like a naturalist marking a
 * specimen card. Reused in review cards, the dashboard legend, and the
 * hero sample card so it reads as one consistent motif throughout.
 *
 * @param {"Positive"|"Neutral"|"Negative"} sentiment
 * @param {"sm"|"md"} size
 * @param {number} rotate - degrees, defaults to a slight hand-stamped tilt
 */
export default function SentimentStamp({ sentiment, size = "md", rotate = -6 }) {
  const tone = STAMP_CLASSES[sentiment] || STAMP_CLASSES.Neutral;
  const ring = RING_CLASSES[sentiment] || RING_CLASSES.Neutral;
  const dims = size === "sm" ? "h-14 w-14 text-[9px]" : "h-20 w-20 text-[10px]";

  return (
    <div
      className={`relative flex ${dims} shrink-0 items-center justify-center rounded-full border-2 border-dashed font-label font-semibold uppercase tracking-wider ${tone}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className={`absolute inset-1 rounded-full border ${ring}`} />
      <span className="text-center leading-tight">{sentiment}</span>
    </div>
  );
}
