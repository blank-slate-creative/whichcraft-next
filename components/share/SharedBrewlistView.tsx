'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_STORE_URL } from '@/lib/constants';
import { decodeBrewlist, type DecodeFailure, type SharedBrewlist } from '@/lib/share/brewlist';

type State =
  | { status: 'loading' }
  | { status: 'ready'; list: SharedBrewlist }
  | { status: 'error'; reason: DecodeFailure };

const ERROR_COPY: Record<DecodeFailure, string> = {
  empty: 'This link has no brew list in it. Ask the sender to share it again.',
  'too-long': 'This link is bigger than a WhichCraft brew list can be, so it was not opened.',
  malformed: "We couldn't read this link. It may have been cut off when it was sent.",
  'unsupported-version':
    'This list was made with a newer version of WhichCraft than this page understands.',
};

/**
 * Reads the share link from the URL fragment and shows it as plain text. Only the title and each
 * beer's name and producer are shown. React escapes every string, nothing here sets HTML, and no
 * catalog images are loaded (BD-2026-130).
 */
export function SharedBrewlistView() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const read = async () => {
      const result = await decodeBrewlist(window.location.hash);
      if (cancelled) return;
      setState(
        result.ok
          ? { status: 'ready', list: result.list }
          : { status: 'error', reason: result.reason }
      );
    };
    void read();
    const onHashChange = () => {
      setState({ status: 'loading' });
      void read();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      cancelled = true;
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return (
    <article>
      <p
        role="note"
        className="mb-6 rounded-md border border-foreground/10 bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
      >
        Shared link, not verified by WhichCraft. Anyone can make a link like this, so only trust one
        from someone you know.
      </p>

      {state.status === 'loading' && (
        <p className="text-muted-foreground" aria-live="polite">
          Opening the shared list&hellip;
        </p>
      )}

      {state.status === 'error' && (
        <div role="alert" className="space-y-4">
          <h1 className="text-2xl font-bold">This list didn&apos;t open</h1>
          <p className="text-muted-foreground">{ERROR_COPY[state.reason]}</p>
          <Button asChild variant="outline">
            <Link href="/">Go to WhichCraft</Link>
          </Button>
        </div>
      )}

      {state.status === 'ready' && (
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold break-words">
              {state.list.title ?? 'A shared brew list'}
            </h1>
            <p className="text-muted-foreground">
              {state.list.beers.length} {state.list.beers.length === 1 ? 'beer' : 'beers'}
            </p>
          </header>

          <ol className="divide-y divide-foreground/10 rounded-lg border bg-card">
            {state.list.beers.map((beer, index) => (
              <li key={index} className="px-4 py-3">
                <p className="font-semibold break-words">{beer.name}</p>
                {beer.producer && (
                  <p className="text-sm text-muted-foreground break-words">{beer.producer}</p>
                )}
              </li>
            ))}
          </ol>

          <div className="space-y-3 pt-2">
            <p className="text-muted-foreground">
              WhichCraft keeps track of the beers you&apos;ve tried and whether you liked them.
            </p>
            <Button asChild size="lg" className="gap-2">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Apple className="w-5 h-5" />
                Get WhichCraft on the App Store
              </a>
            </Button>
          </div>
        </div>
      )}

      <noscript>
        <p className="text-muted-foreground">This page needs JavaScript to open a shared list.</p>
      </noscript>
    </article>
  );
}
