import type { Metadata } from 'next';
import Link from 'next/link';

// The App Store listing's Support URL (blank-slate issue 1477). It returned 404 before this page.
export const metadata: Metadata = {
  title: 'Support | WhichCraft',
  description: 'Get help with WhichCraft, or report a problem with a shared Brewlist.',
};

const SUPPORT_EMAIL = 'support@whichcraft.beer';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Support</h1>

      <div className="space-y-8 text-foreground">
        <section className="space-y-3">
          <p className="text-lg">
            Questions, a problem with the app, or something wrong with a shared Brewlist? Email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">
              {SUPPORT_EMAIL}
            </a>
            . If it&apos;s about the app, tell us your iPhone or iPad model and the app version. In
            WhichCraft 1.5 and later, the version is under Brewlist, then the info button.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Report a shared Brewlist</h2>
          <p>
            Depending on your version of the app, people can share a Brewlist with you as a link, or
            invite you to a live list. If something in one is objectionable or abusive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>A live list:</strong> open it in WhichCraft, tap the menu, then Report a
              Problem. You can email us, remove the list from your app at once, or both.
            </li>
            <li>
              <strong>A link:</strong> if it opened in WhichCraft, tap the menu, then Report a
              Problem. If it opened in your web browser, email us. A link is only a copy someone
              sent you; close it and delete the message to stop seeing it.
            </li>
          </ul>
          <p>
            We will respond to your report and help you stop seeing the list. We cannot edit or
            delete someone else&apos;s list: WhichCraft does not store shared lists on its servers.
            See the{' '}
            <Link href="/terms-of-service" className="text-primary underline">
              Terms of Service
            </Link>{' '}
            for what can be shared.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Your data</h2>
          <p>
            WhichCraft has no accounts and no ads. Your tastings, notes, places, and photos stay on
            your devices and in your own iCloud unless you share a Brewlist, and a shared Brewlist
            never includes notes, places, or photos. The{' '}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>{' '}
            has the details.
          </p>
        </section>
      </div>
    </div>
  );
}
