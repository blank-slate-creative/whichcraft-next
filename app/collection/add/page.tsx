import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AddBeverageForm from './add-form'; // We'll create this client component

export default async function AddBeveragePage() {
  const supabase = await createClient();

  // Replace getSession with getUser for secure authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check for authentication errors or missing user
  if (error || !user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-3 py-4">
      <div className="items-center mb-4 hidden md:flex">
        <Button variant="ghost" size="icon" className="mr-2 inline-flex" asChild>
          <Link
            href="/collection"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to collection</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight block">Add New Beverage</h1>
      </div>

      <AddBeverageForm />
    </div>
  );
}
