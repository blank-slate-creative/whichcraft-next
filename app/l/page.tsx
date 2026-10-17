import type { Metadata } from 'next';
import { SharedBrewlistView } from '@/components/share/SharedBrewlistView';

// A shared brew list lives in the link's fragment (the part after "#"), which the server never
// sees. So this page is a thin shell and the client component does the reading. See
// lib/share/brewlist.ts for the format and the caps.
export const metadata: Metadata = {
  title: 'Shared brew list | WhichCraft',
  description: 'A brew list shared from WhichCraft.',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
};

export default function SharedListPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-2xl">
      <SharedBrewlistView />
    </div>
  );
}
