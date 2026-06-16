import Card from "../components/Card";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      
      <section className="py-8">
        <Hero />
        <h2 className="text-3xl font-bold text-center mb-6">
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