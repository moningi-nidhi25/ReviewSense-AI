import { Link } from "react-router-dom";
function Hero() {
  return (
    <section className="grid gap-12 px-6 pb-16 pt-10 md:grid-cols-2 md:items-center md:gap-8 md:px-4">
      <div>
        <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink dark:text-ink-dark md:text-6xl">
          Understand Guest Feedback with AI
        </h1>

        <p className="mb-8 max-w-md text-lg text-ink-soft dark:text-ink-soft-dark">
          Analyze reviews, identify sentiment, discover recurring themes,
          and generate management responses using AI.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link to="/pages/Reviews">
            <button className="rounded-md bg-forest px-6 py-3 font-label text-sm font-semibold uppercase tracking-wide text-card transition hover:bg-forest-deep dark:bg-forest-dark dark:text-ink-dark dark:hover:brightness-110">
              Analyse Reviews
            </button>
          </Link>
        </div>
      </div>
      {/* Signature specimen card, hand-tilted like a pinned index card */}
      <div className="flex justify-center md:justify-end">
        <div className="w-full max-w-xs -rotate-2 rounded-lg border border-line bg-card p-6 shadow-lg transition hover:rotate-0 dark:border-line-dark dark:bg-card-dark">
          <div className="mb-4 flex items-center justify-between border-b border-dashed border-line pb-3 dark:border-line-dark">
            <span className="font-label text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">
              Review #025
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">
              Trishul Homestay
            </span>
          </div>

          <p className="mb-5 font-display text-base italic leading-snug text-ink dark:text-ink-dark">
            "Loved the peaceful surroundings and the staff went out of their
            way to help us."
          </p>

          <div className="flex items-center justify-between">
            
            <span className="rounded-full border border-line px-3 py-1 font-label text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-ink-soft-dark">
              tag: staff service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;