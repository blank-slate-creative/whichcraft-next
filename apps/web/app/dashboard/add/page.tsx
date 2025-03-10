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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0 py-4 sm:py-8">
      <div className="items-center mb-4 sm:mb-8 hidden md:flex">
        <Button variant="ghost" size="icon" className="mr-2 sm:mr-4" asChild>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Add New Beverage</h1>
      </div>

      <AddBeverageForm />
    </div>
  );
}
