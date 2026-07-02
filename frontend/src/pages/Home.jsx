import Card from "../components/Card";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-8">
        <h2 className="mb-10 text-center font-display text-3xl font-semibold text-ink dark:text-ink-dark">
          Key Features
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          <Card
            title="Sentiment Analysis"
            description="Automatically classify guest reviews as positive, negative, or neutral."
          />

          <Card
            title="Theme Categorization"
            description="Identify recurring themes such as cleanliness, hospitality, food, and amenities."
          />

          <Card
            title="AI-Powered Responses"
            description="Generate professional management responses to guest reviews instantly."
          />
        </div>
      </section>
    </>
  );
}