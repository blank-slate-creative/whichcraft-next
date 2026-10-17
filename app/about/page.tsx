import Link from 'next/link';
import { APP_STORE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-4">
      <div className="flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About WhichCraft</h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
            A private beer journal for iPhone. Keep track of the beers you try, and remember which
            ones are worth ordering again.
          </p>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  WhichCraft was born from a simple problem: remembering which craft beers we've
                  tried and whether we liked them.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  In a world with thousands of breweries producing countless varieties, it's easy to
                  forget what you've tried and what you thought of it.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our mission is to help beer lovers keep a simple record of what they've tried, and
                  never forget a great (or not-so-great) beer again.
                </p>
              </div>
              <div className="bg-muted/50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Why Use WhichCraft?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-primary mr-2 mt-1" />
                    <span>Never forget a beer you've tried</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mr-2 mt-1" />
                    <span>Add notes on what you thought of each one</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mr-2 mt-1" />
                    <span>Find any beer in a catalog of hundreds of thousands</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary mr-2 mt-1" />
                    <span>Filter your list by liked or disliked</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-16 bg-muted/50 rounded-lg">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How WhichCraft Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Download</h3>
                <p className="text-muted-foreground">
                  Get WhichCraft from the App Store. It is free.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Beers</h3>
                <p className="text-muted-foreground">
                  Find a beer in the catalog and add it to your brewlist.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Thumbs Up or Down</h3>
                <p className="text-muted-foreground">Thumbs up or down, plus notes.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Look Back</h3>
                <p className="text-muted-foreground">
                  Filter your brewlist by liked or disliked and remember what is worth ordering
                  again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 flex flex-col items-center text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to start your tasting journey?</h2>
          <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
            Download WhichCraft and start your brewlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                Download on the App Store
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
