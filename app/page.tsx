import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { MarkLayer, WedgeDivider } from '@/components/brand/Brand';
import { Shield, Zap, Ban, Apple } from 'lucide-react';
import Image from 'next/image';
import { APP_STORE_URL } from '@/lib/constants';

function DownloadButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      size="lg"
      className={`h-14 gap-2 whitespace-normal px-6 text-base sm:px-8 sm:text-lg ${className ?? ''}`}
    >
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        <Apple className="h-6 w-6 shrink-0" aria-hidden="true" />
        Download on the App Store
      </a>
    </Button>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-3 pb-16 pt-3 sm:px-4 md:gap-6 md:px-6 md:pt-4">
      {/* Hero: a Stout panel in both schemes, the mark large and behind the phone */}
      <section className="panel-stout relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
        <MarkLayer className="pointer-events-none absolute -right-10 top-1/2 hidden w-[820px] max-w-none -translate-y-1/2 opacity-[0.13] lg:block" />
        <div className="relative grid grid-cols-1 items-center gap-10 px-6 pt-12 md:px-12 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-16 lg:pt-0">
          <div className="flex flex-col items-start space-y-7 lg:py-28">
            <h1 className="display text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Remember what&apos;s worth ordering again
            </h1>
            <p className="max-w-[34rem] text-lg text-stout-mute md:text-xl">
              The fastest way to track the beers you drink. No ads, no feeds, no noise—just you and
              your brewlist.
            </p>
            <DownloadButton />
          </div>
          <div className="relative flex h-[430px] justify-center overflow-hidden sm:h-[520px] lg:h-[640px] lg:justify-end">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/20 blur-3xl"
            />
            <PhoneMockup
              island
              className="relative mt-2 w-[270px] sm:w-[300px] lg:mt-16 lg:w-[330px]"
            >
              <Image
                src="/screens/brewlist.jpg"
                alt="The Brewlist screen: beers with their brewery, style, date and an Absolutely! rating"
                width={1206}
                height={2620}
                sizes="(min-width: 1024px) 330px, 300px"
                className="h-auto w-full"
                priority
              />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* Feature 1: Log Tastings. An Amber panel; Ink is the text colour on Amber. */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-amber text-ink md:rounded-[2.5rem]">
        <div className="grid grid-cols-1 items-center gap-10 px-6 pt-12 md:grid-cols-2 md:gap-16 md:px-12 md:pt-0 lg:px-16">
          <div className="order-1 md:order-2 md:py-24">
            <h2 className="display mb-6 text-4xl md:text-5xl lg:text-6xl">
              Never waste a sip on something forgettable
            </h2>
            <p className="text-lg leading-relaxed md:text-xl">
              Log tastings in seconds. Would you drink it again? Absolutely or nope. Add notes.
              That&apos;s it. We don&apos;t make you fill out a form or rate things on a 10-point
              scale. You tried a beer. You liked it or you didn&apos;t. Move on.
            </p>
          </div>
          <div className="order-2 flex h-[380px] justify-center overflow-hidden md:order-1 md:h-[560px] md:items-start">
            <PhoneMockup island className="mt-0 w-[270px] md:mt-14 md:w-[300px]">
              <Image
                src="/screens/add-tasting.jpg"
                alt="The Add brew screen for Zombie Dust, asking Would drink again? with Absolutely! and Nope buttons, then date, location and notes"
                width={1206}
                height={2620}
                sizes="300px"
                className="h-auto w-full"
              />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* Feature 2: Discover */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-muted md:rounded-[2.5rem]">
        <div className="grid grid-cols-1 items-center gap-10 px-6 pt-12 md:grid-cols-2 md:gap-16 md:px-12 md:pt-0 lg:px-16">
          <div className="md:py-24">
            <h2 className="display mb-6 text-4xl md:text-5xl lg:text-6xl">
              Find any beer and remember if you liked it
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Find any beer from a comprehensive catalog of hundreds of thousands of brews
              worldwide. Filter by liked, disliked, or browse everything you&apos;ve tried. Sort by
              date or name—whatever makes sense to you.
            </p>
          </div>
          <div className="flex h-[380px] justify-center overflow-hidden md:h-[560px] md:items-start">
            <PhoneMockup island className="mt-0 w-[270px] md:mt-14 md:w-[300px]">
              <Image
                src="/screens/search.jpg"
                alt="The search screen: a Search for beers field above Recently Saved beers with their brewery, style and an Absolutely! or Nope rating"
                width={1206}
                height={2622}
                sizes="300px"
                className="h-auto w-full"
              />
            </PhoneMockup>
          </div>
        </div>
      </section>

      <WedgeDivider className="my-6 px-2 md:my-10" />

      {/* Value Props Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {[
          {
            Icon: Shield,
            title: 'Private by Design',
            body: "Your tastings sync via iCloud. They're yours. We don't see them, we don't sell them, and we can't lose them in a data breach.",
          },
          {
            Icon: Ban,
            title: 'No Ads, Ever',
            body: "We're not selling your attention to advertisers. The app is free, and we will never make money from your data. Clean and simple.",
          },
          {
            Icon: Zap,
            title: 'Actually Fast',
            body: 'Built with SwiftUI and SwiftData. Native iOS. No web wrappers, no lag, no waiting for things to load.',
          },
        ].map(({ Icon, title, body }) => (
          <div key={title} className="rounded-[1.75rem] border border-border bg-card p-7 md:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber text-ink">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="display mb-3 text-3xl">{title}</h3>
            <p className="text-lg text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="panel-stout relative mt-2 overflow-hidden rounded-[1.75rem] px-6 py-16 text-center md:mt-4 md:rounded-[2.5rem] md:py-24">
        <MarkLayer className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[760px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.09] lg:block" />
        <div className="relative flex flex-col items-center">
          <h2 className="display mb-6 text-4xl md:text-6xl">Your brewlist, your way.</h2>
          <p className="mb-10 max-w-[600px] text-lg text-stout-mute md:text-xl">
            Track beers without feeds or followers. Private iCloud sync, no ads ever, native iOS
            speed.
          </p>
          <DownloadButton />
        </div>
      </section>
    </div>
  );
}
