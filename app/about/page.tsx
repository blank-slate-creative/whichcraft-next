import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About WhichCraft
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
          Your personal beverage journal for tracking and discovering craft
          beers and fine wines.
        </p>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                WhichCraft was born from a simple problem: remembering which
                craft beers and wines we've tried and enjoyed.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                In a world with thousands of breweries and wineries producing
                countless varieties, it's easy to forget what you've tried and
                what you thought of it.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is to help enthusiasts keep track of their tasting
                journey, discover new favorites, and never forget a great (or
                not-so-great) beverage again.
              </p>
            </div>
            <div className="bg-muted/50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">
                Why Use WhichCraft?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-primary mr-2 mt-1" />
                  <span>Never forget a beer or wine you've tried</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary mr-2 mt-1" />
                  <span>
                    Keep detailed notes on flavor profiles and experiences
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary mr-2 mt-1" />
                  <span>Discover new beverages based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary mr-2 mt-1" />
                  <span>Build your personal taste profile over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-16 bg-muted/50 rounded-lg">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How WhichCraft Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your free account to get started with WhichCraft.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Beverages</h3>
              <p className="text-muted-foreground">
                Log the beers and wines you try with details like brewery,
                vintage, and style.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-muted-foreground">
                Give ratings and add notes about your tasting experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-muted-foreground">
                Find new beverages based on your preferences and ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to start your tasting journey?
        </h2>
        <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
          Join WhichCraft today and build your personal beverage collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Create Free Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
