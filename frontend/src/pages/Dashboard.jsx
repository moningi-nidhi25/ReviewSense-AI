import Card from "../components/Card";

function Dashboard() {
  return (
    <div className="justify-center">
      <div className="flex flex-wrap gap-4 mb-8">
        <Card
          title="Sentiment Overview"
          description="Recent guest reviews show 78% positive sentiment, 15% neutral feedback, and 7% negative comments."
        />

        <Card
          title="Top Feedback Themes"
          description="Guests frequently mention cleanliness, friendly staff, scenic surroundings, and local food experiences."
        />

        <Card
          title="AI Recommendations"
          description="Address recurring concerns about Wi-Fi connectivity, improve room maintenance, and highlight highly-rated amenities in promotions."
        />
      </div>
    </div>
  );
}

export default Dashboard;