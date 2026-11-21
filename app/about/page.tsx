import Link from 'next/link';
import { APP_STORE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { GlassIcon, WedgeDivider } from '@/components/brand/Brand';

export default function AboutPage() {
  return (
    <div className="py-4">
      <div className="flex w-full flex-col items-center">
        {/* Hero Section */}
        <section className="flex w-full flex-col items-center px-4 pb-10 pt-14 text-center md:pb-14 md:pt-24">
          <h1 className="display mb-6 text-5xl md:text-7xl">About WhichCraft</h1>
          <p className="mb-8 max-w-[800px] text-xl text-muted-foreground">
            A private beer journal for iPhone. Keep track of the beers you try, and remember which
            ones are worth ordering again.
          </p>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="display mb-6 text-4xl">Our Mission</h2>
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
              <div className="rounded-[1.75rem] border border-border bg-card p-7 md:p-8">
                <h3 className="display mb-5 text-3xl">Why Use WhichCraft?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <GlassIcon className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-amber-ink dark:text-gold" />
                    <span>Never forget a beer you've tried</span>
                  </li>
                  <li className="flex items-start">
                    <GlassIcon className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-amber-ink dark:text-gold" />
                    <span>Add notes on what you thought of each one</span>
                  </li>
                  <li className="flex items-start">
                    <GlassIcon className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-amber-ink dark:text-gold" />
                    <span>Find any beer in a catalog of hundreds of thousands</span>
                  </li>
                  <li className="flex items-start">
                    <GlassIcon className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-amber-ink dark:text-gold" />
                    <span>Filter your list by liked or disliked</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mx-3 w-[calc(100%-1.5rem)] max-w-[1400px] rounded-[1.75rem] bg-muted py-14 md:mx-6 md:w-[calc(100%-3rem)] md:rounded-[2.5rem] md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="display mb-12 text-center text-4xl md:text-5xl">How WhichCraft Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="display mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-2xl text-ink">
                  1
                </div>
                <h3 className="display mb-2 text-2xl">Download</h3>
                <p className="text-muted-foreground">
                  Get WhichCraft from the App Store. It is free.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="display mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-2xl text-ink">
                  2
                </div>
                <h3 className="display mb-2 text-2xl">Add Beers</h3>
                <p className="text-muted-foreground">
                  Find a beer in the catalog and add it to your brewlist.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="display mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-2xl text-ink">
                  3
                </div>
                <h3 className="display mb-2 text-2xl">Absolutely or Nope</h3>
                <p className="text-muted-foreground">Absolutely or nope, plus notes.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="display mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-2xl text-ink">
                  4
                </div>
                <h3 className="display mb-2 text-2xl">Look Back</h3>
                <p className="text-muted-foreground">
                  Filter your brewlist by liked or disliked and remember what is worth ordering
                  again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex w-full flex-col items-center px-4 py-16 text-center md:py-28">
          <WedgeDivider className="mb-14 w-full max-w-[640px]" />
          <h2 className="display mb-6 text-4xl md:text-5xl">
            Ready to start your tasting journey?
          </h2>
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
