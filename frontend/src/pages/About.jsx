import { Link } from "react-router-dom";

const MISSION_PILLARS = [
  {
    icon: "🏡",
    title: "Eco-Hospitality Focus",
    description:
      "Designed specifically for eco-homestay networks like Trishul Eco-Homestays to help operators maintain authentic warmth while streamlining feedback management.",
  },
  {
    icon: "🧠",
    title: "Intelligent Sentiment AI",
    description:
      "Leveraging Google Gemini 2.0 Flash to automatically analyze tone, detect underlying guest emotions, and categorize recurring feedback themes.",
  },
  {
    icon: "✍️",
    title: "Personalized AI Responses",
    description:
      "Drafting courteous, context-aware management replies tailored to your property name, allowing staff to respond to reviews in seconds.",
  },
];

const TECH_STACK = [
  { name: "React (Vite)", role: "Modern Frontend UI" },
  { name: "Tailwind CSS", role: "Field Notes Design System" },
  { name: "FastAPI & Python", role: "High-Performance REST API" },
  { name: "PostgreSQL & Supabase", role: "Relational Storage" },
  { name: "Google Gemini AI", role: "NLP & Sentiment Classification" },
  { name: "JWT & Bcrypt", role: "Account Security" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 py-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forest/30 bg-forest/10 px-3 py-1 font-label text-xs font-semibold uppercase tracking-wider text-forest dark:border-forest-dark/30 dark:bg-forest-dark/10 dark:text-forest-dark">
          <span className="h-2 w-2 rounded-full bg-forest dark:bg-forest-dark" />
          Our Mission & Purpose
        </div>

        <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-ink dark:text-ink-dark md:text-5xl">
          Empowering Homestays with <br className="hidden md:inline" />
          <span className="text-forest dark:text-forest-dark">AI-Driven Guest Intelligence</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-soft dark:text-ink-soft-dark md:text-lg">
          ReviewSense AI bridges the gap between guest feedback and homestay operations. By transforming unstructured reviews from Booking.com, Airbnb, and guestbooks into clear insights, homestay hosts can continuously elevate the guest experience.
        </p>
      </div>

      {/* Mission Pillars Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {MISSION_PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-line bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-forest/40 hover:shadow-md dark:border-line-dark dark:bg-card-dark dark:hover:border-forest-dark/40"
          >
            <div className="mb-4 text-3xl">{p.icon}</div>
            <h3 className="mb-2 font-display text-xl font-bold text-ink dark:text-ink-dark">
              {p.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
              {p.description}
            </p>
          </div>
        ))}
      </div>

      {/* Homestay Impact Stats Banner */}
      <div className="rounded-2xl border border-line bg-card/60 p-8 shadow-sm dark:border-line-dark dark:bg-card-dark/60 md:p-12">
        <div className="grid gap-8 text-center md:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-bold text-forest dark:text-forest-dark">
              100%
            </p>
            <p className="mt-1 font-label text-xs font-semibold uppercase tracking-wider text-ink dark:text-ink-dark">
              Automated Analysis
            </p>
            <p className="mt-1 font-label text-[11px] text-ink-soft dark:text-ink-soft-dark">
              Zero manual tagging required
            </p>
          </div>

          <div>
            <p className="font-display text-4xl font-bold text-ink dark:text-ink-dark">
              &lt; 2s
            </p>
            <p className="mt-1 font-label text-xs font-semibold uppercase tracking-wider text-ink dark:text-ink-dark">
              AI Response Time
            </p>
            <p className="mt-1 font-label text-[11px] text-ink-soft dark:text-ink-soft-dark">
              Instant management replies
            </p>
          </div>

          <div>
            <p className="font-display text-4xl font-bold text-forest dark:text-forest-dark">
              Secure
            </p>
            <p className="mt-1 font-label text-xs font-semibold uppercase tracking-wider text-ink dark:text-ink-dark">
              Account Isolation
            </p>
            <p className="mt-1 font-label text-[11px] text-ink-soft dark:text-ink-soft-dark">
              Private data per homestay
            </p>
          </div>
        </div>
      </div>

      {/* Technology Specimen Section */}
      <div>
        <div className="mb-8 text-center">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-forest dark:text-forest-dark">
            Behind the Scenes
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold text-ink dark:text-ink-dark">
            Technology Stack
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center justify-between rounded-xl border border-line bg-card p-4 shadow-sm dark:border-line-dark dark:bg-card-dark"
            >
              <div>
                <p className="font-display font-semibold text-ink dark:text-ink-dark">
                  {tech.name}
                </p>
                <p className="font-label text-[11px] text-ink-soft dark:text-ink-soft-dark">
                  {tech.role}
                </p>
              </div>
              <span className="rounded-full bg-forest/10 px-2.5 py-1 font-label text-[10px] font-bold text-forest dark:bg-forest-dark/20 dark:text-forest-dark">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action Banner */}
      <div className="rounded-2xl border border-forest/20 bg-forest/5 p-8 text-center dark:border-forest-dark/30 dark:bg-forest-dark/10 md:p-12">
        <h2 className="mb-3 font-display text-2xl font-bold text-ink dark:text-ink-dark md:text-3xl">
          Ready to See ReviewSense AI in Action?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
          Explore your guest review ledger or check your executive dashboard to view real-time analytics.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/pages/Reviews">
            <button className="rounded-lg bg-forest px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-card shadow-sm transition hover:bg-forest-deep dark:bg-forest-dark dark:text-paper-dark dark:hover:brightness-110">
              Manage Guest Reviews
            </button>
          </Link>
          <Link to="/pages/Dashboard">
            <button className="rounded-lg border border-line bg-card px-6 py-3 font-label text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-line/20 dark:border-line-dark dark:bg-card-dark dark:text-ink-dark dark:hover:bg-line-dark/20">
              View Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}