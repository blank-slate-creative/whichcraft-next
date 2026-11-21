import Image from 'next/image';
import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * The WhichCraft wordmark: one word in the display face, with "Craft" in Gold on dark or Amber Ink
 * on light (brand guide, The wordmark). `onDark` is for a surface that is Stout in both schemes.
 */
export function Wordmark({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn('display tracking-[-0.02em]', onDark && 'text-foam', className)}>
      Which
      <span className={onDark ? 'text-gold' : 'text-amber-ink dark:text-gold'}>Craft</span>
    </span>
  );
}

/** The icon on its Stout tile. Decorative: the wordmark beside it carries the name. */
export function AppIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/whichcraft-icon.svg"
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn('rounded-[22%] ring-1 ring-foreground/10', className)}
    />
  );
}

/** Icon and wordmark together, as in the header and footer. */
export function Logo({
  size = 32,
  className,
  wordmarkClassName,
  onDark = false,
}: {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <AppIcon size={size} />
      <Wordmark className={cn('text-2xl', wordmarkClassName)} onDark={onDark} />
    </span>
  );
}

/**
 * The mark alone, transparent, for layouts (brand guide: never outlined, tilted or recoloured).
 * Inline SVG, the same geometry as public/brand/whichcraft-mark-layer.svg, so the browser never
 * counts a decorative backdrop as the page's largest image.
 */
export function MarkLayer({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const left = '112,270 566,270 440,780 250,780';
  const right = '458,270 912,270 774,780 584,780';
  return (
    <svg
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      focusable="false"
      className={className}
      width="1024"
      height="1024"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E67E22" />
          <stop offset="1" stopColor="#C05808" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8CC74" />
          <stop offset="1" stopColor="#EFA53A" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFAF0" />
          <stop offset="1" stopColor="#F4E3C8" />
        </linearGradient>
        <mask id={`${id}m`}>
          <polygon
            points={left}
            fill="#fff"
            stroke="#fff"
            strokeWidth="44"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <g transform="translate(512 512) scale(.9) translate(-512 -525)">
        <polygon
          points={left}
          fill={`url(#${id}a)`}
          stroke={`url(#${id}a)`}
          strokeWidth="44"
          strokeLinejoin="round"
        />
        <polygon
          points={right}
          fill={`url(#${id}g)`}
          stroke={`url(#${id}g)`}
          strokeWidth="44"
          strokeLinejoin="round"
        />
        <g mask={`url(#${id}m)`}>
          <polygon
            points={right}
            fill={`url(#${id}f)`}
            stroke={`url(#${id}f)`}
            strokeWidth="44"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

/** A filled glass, the rating shape from the app ("Heck yes"). Takes its colour from the text. */
export function GlassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-6 w-6', className)}>
      <path
        d="M5 4h14l-2.6 16H7.6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The wedge, the brand's divider: the cream triangle where the two glasses cross, between two
 * hairlines. Decorative.
 */
export function WedgeDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-5', className)} role="presentation">
      <span className="h-px flex-1 bg-border" />
      <svg viewBox="0 0 40 32" aria-hidden="true" className="h-5 w-7 shrink-0">
        <defs>
          <linearGradient id="wedge-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2B14A" />
            <stop offset="1" stopColor="#E67E22" />
          </linearGradient>
        </defs>
        <polygon
          points="4,4 36,4 20,28"
          fill="url(#wedge-fill)"
          stroke="url(#wedge-fill)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
