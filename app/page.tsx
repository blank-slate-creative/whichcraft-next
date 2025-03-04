import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirectAuthenticatedToHome } from "@/utils/auth";

export default async function Home() {
  // Redirect authenticated users to dashboard
  await redirectAuthenticatedToHome();

  // Otherwise, show the homepage
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Welcome to <span className="text-primary">WhichCraft</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8">
          Never forget your favorite beers and wines again. Track, rate, and
          discover new beverages with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 rounded-lg">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M6 8h12M8 8v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8M7 8V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Track Your Tastings
              </h3>
              <p className="text-muted-foreground">
                Log every beer and wine you try in your personal collection.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2v2M12 14v8M2 12h2M14 12h8M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-muted-foreground">
                Give ratings and write notes about your experience with each
                beverage.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
              <p className="text-muted-foreground">
                Find your favorites and discover new beverages based on your
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to start tracking?</h2>
        <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
          Join WhichCraft today and never forget your favorite drinks again.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">Create Free Account</Link>
        </Button>
      </section>
    </div>
  );
}
