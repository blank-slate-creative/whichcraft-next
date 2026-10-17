import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { Footer } from '@/components/Footer';
import { Shield, Zap, Ban, Apple } from 'lucide-react';
import Image from 'next/image';
import { APP_STORE_URL } from '@/lib/constants';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  Remember what's worth ordering again
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px]">
                  The fastest way to track the beers you drink. No ads, no social features, no
                  noise—just you and your brewlist.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg gap-2">
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                      <Apple className="w-6 h-6" />
                      Download on the App Store
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10" />
                <PhoneMockup className="rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/screens/brewlist.png"
                    alt="Brewlist screen"
                    width={300}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Log Tastings */}
        <section className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="order-2 md:order-1">
                <PhoneMockup className="bg-orange-500/10 border-orange-900/20">
                  <Image
                    src="/screens/add-tasting.png"
                    alt="Log tasting screen"
                    width={300}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </PhoneMockup>
              </div>
              <div className="order-1 md:order-2 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Never waste a sip on something forgettable
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Log tastings in seconds. Thumbs up or down. Add notes. That's it. We don't make
                  you fill out a form or rate things on a 10-point scale. You tried a beer. You
                  liked it or you didn't. Move on.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Discover */}
        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Find any beer and remember if you liked it
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Find any beer from a comprehensive catalog of hundreds of thousands of brews
                  worldwide. Filter by liked, disliked, or browse everything you've tried. Sort by
                  date or name—whatever makes sense to you.
                </p>
              </div>
              <div>
                <PhoneMockup className="bg-blue-500/10 border-blue-900/20">
                  <Image
                    src="/screens/search.png"
                    alt="Search screen"
                    width={300}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props Grid */}
        <section className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Prop 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Private by Design</h3>
                <p className="text-muted-foreground">
                  Your tastings sync via iCloud. They're yours. We don't see them, we don't sell
                  them, and we can't lose them in a data breach.
                </p>
              </div>

              {/* Prop 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Ban className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Ads, Ever</h3>
                <p className="text-muted-foreground">
                  We're not selling your attention to advertisers. The app is free, and we will
                  never make money from your data. Clean and simple.
                </p>
              </div>

              {/* Prop 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Actually Fast</h3>
                <p className="text-muted-foreground">
                  Built with SwiftUI and SwiftData. Native iOS. No web wrappers, no lag, no waiting
                  for things to load.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="w-full py-20 md:py-32 flex flex-col items-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Your brewlist, your way.</h2>
          <p className="text-xl text-muted-foreground max-w-[600px] mb-10">
            Track beers without the social clutter. Private iCloud sync, no ads ever, native iOS
            speed.
          </p>
          <Button asChild size="lg" className="h-14 px-8 text-lg gap-2">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Apple className="w-6 h-6" />
              Download on the App Store
            </a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
