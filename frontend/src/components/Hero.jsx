import { Link } from "react-router-dom";
import SentimentStamp from "./ui/SentimentStamp";

function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="grid gap-12 md:grid-cols-12 md:items-center">
        {/* Left Headline & CTA */}
        <div className="md:col-span-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-3 py-1 font-label text-[11px] font-semibold uppercase tracking-wider text-forest dark:border-forest-dark/30 dark:bg-forest-dark/10 dark:text-forest-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-forest dark:bg-forest-dark" />
            AI-Powered Guest Review Platform
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-ink dark:text-ink-dark md:text-5xl lg:text-6xl">
            Understand Guest Feedback with{" "}
            <span className="text-forest dark:text-forest-dark">AI Intelligence</span>
          </h1>

          <p className="mb-8 max-w-lg text-base leading-relaxed text-ink-soft dark:text-ink-soft-dark md:text-lg">
            Automatically classify guest sentiment, discover recurring feedback themes, and generate personalized management responses in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/pages/Reviews">
              <button className="rounded-lg bg-forest px-6 py-3 font-label text-xs font-semibold uppercase tracking-wider text-card shadow-sm transition hover:bg-forest-deep dark:bg-forest-dark dark:text-paper-dark dark:hover:brightness-110">
                Analyze Reviews Live →
              </button>
            </Link>

            <Link to="/pages/Dashboard">
              <button className="rounded-lg border border-line px-6 py-3 font-label text-xs font-semibold uppercase tracking-wider text-ink transition hover:bg-card dark:border-line-dark dark:text-ink-dark dark:hover:bg-card-dark">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Right Single Minimal Specimen Card */}
        <div className="md:col-span-5">
          <div className="rounded-xl border border-line bg-card p-6 shadow-md dark:border-line-dark dark:bg-card-dark">
            <div className="mb-3 flex items-center justify-between border-b border-dashed border-line pb-3 dark:border-line-dark">
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">
                  Guest Review #025
                </p>
                <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark">
                  Priya Nair
                </h2>
              </div>
              <SentimentStamp sentiment="Positive" size="sm" />
            </div>

            <p className="mb-4 text-sm italic leading-relaxed text-ink dark:text-ink-dark">
              "The host was incredibly warm and welcoming! Our room had breathtaking mountain views, and breakfast was perfection."
            </p>

            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-line px-3 py-0.5 font-label text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-ink-soft-dark">
                tag: Hospitality & Food
              </span>
            </div>

            {/* AI Management Response */}
            <div className="rounded-lg border border-forest/20 bg-forest/5 p-3.5 dark:border-forest-dark/20 dark:bg-forest-dark/10">
              <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-wider text-forest dark:text-forest-dark">
                ✨ AI Management Response
              </p>
              <p className="text-xs italic text-ink-soft dark:text-ink-soft-dark">
                "Dear Priya, thank you so much for your glowing review! We are delighted you enjoyed our hospitality and breakfast."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;