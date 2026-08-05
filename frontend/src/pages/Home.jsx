import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const FEATURES = [
  {
    icon: "📊",
    title: "Real-Time Sentiment Analysis",
    description:
      "Gemini AI analyzes review text to instantly classify sentiment as Positive, Neutral, or Negative with color-coded badges.",
  },
  {
    icon: "🏷️",
    title: "Automated Theme Categorization",
    description:
      "Automatically extracts recurring topics such as Cleanliness, Hospitality, Food, Location, Service, and Amenities.",
  },
  {
    icon: "✨",
    title: "AI Response Generation",
    description:
      "Generates warm, professional 2-sentence management replies tailored to each guest's specific feedback in one click.",
  },
  {
    icon: "📈",
    title: "Interactive Analytics Dashboard",
    description:
      "Visualize sentiment distribution, theme frequency progress bars, and filter your feedback feed dynamically.",
  },
  {
    icon: "🔒",
    title: "Secure & Account Scoped",
    description:
      "JWT-authenticated endpoints ensure your homestay reviews and analytics are strictly private to your account.",
  },
  {
    icon: "🌙",
    title: "Dark & Light Notebook Theme",
    description:
      "Switch seamlessly between Light Field Notes and Night Notebook dark mode for comfortable reviewing at any hour.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Log Guest Feedback",
    description: "Enter or paste guest comments from Booking.com, Airbnb, Google, or your physical logbook.",
  },
  {
    step: "02",
    title: "Gemini AI Analysis",
    description: "Our AI engine analyzes the review text in real-time, stamping sentiment and theme tags.",
  },
  {
    step: "03",
    title: "Copy AI Response & Track Insights",
    description: "Copy the personalized management response to reply to guests and monitor trends on your dashboard.",
  },
];

export default function Home() {
  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <Hero />

      {/* 3-Step How It Works Section */}
      <section className="rounded-2xl border border-line bg-card/60 p-8 shadow-sm dark:border-line-dark dark:bg-card-dark/60 md:p-12">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:text-forest-dark">
            Simple & Powerful Workflow
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-ink-dark md:text-4xl">
            How ReviewSense AI Works
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-xl border border-line/70 bg-card p-6 shadow-sm transition hover:border-forest/40 dark:border-line-dark/70 dark:bg-card-dark"
            >
              <span className="mb-4 inline-block font-label text-3xl font-bold text-forest dark:text-forest-dark">
                {s.step}
              </span>
              <h3 className="mb-2 font-display text-xl font-semibold text-ink dark:text-ink-dark">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:text-forest-dark">
            Comprehensive Platform Features
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-ink-dark md:text-4xl">
            Built for Modern Homestay Management
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-line bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-forest/40 hover:shadow-md dark:border-line-dark dark:bg-card-dark dark:hover:border-forest-dark/40"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-display text-lg font-bold text-ink dark:text-ink-dark">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-forest px-8 py-14 text-center text-card shadow-lg dark:bg-forest-deep md:px-16">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Ready to Turn Guest Reviews into Insight?
          </h2>
          <p className="mb-8 font-body text-base text-card/90 md:text-lg">
            Start analyzing guest feedback, auto-generating management responses, and boosting homestay ratings today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pages/Reviews">
              <button className="rounded-lg bg-card px-8 py-4 font-label text-xs font-bold uppercase tracking-wider text-ink shadow-md transition hover:-translate-y-0.5 hover:bg-card/90">
                Log Your First Review
              </button>
            </Link>
            <Link to="/pages/Dashboard">
              <button className="rounded-lg border border-card/40 bg-transparent px-8 py-4 font-label text-xs font-bold uppercase tracking-wider text-card transition hover:bg-card/10">
                Explore Analytics Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}