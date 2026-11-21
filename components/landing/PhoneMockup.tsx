import { cn } from '@/lib/utils';

interface PhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * A dark device frame (the brand's "Stout" bezel) for an app screenshot. Width comes from the
 * caller; the screen keeps the screenshot's own proportions, and a parent with `overflow-hidden`
 * can crop the bottom as the style board does.
 */
export function PhoneMockup({ className, children }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-[260px] rounded-[2.75rem] bg-[#0B0705] p-[9px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10',
        className
      )}
    >
      <div className="overflow-hidden rounded-[2.15rem] bg-[#0B0705]">{children}</div>
    </div>
  );
}
