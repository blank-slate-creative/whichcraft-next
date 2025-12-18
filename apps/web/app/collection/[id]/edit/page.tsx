import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { serverBeverageApi } from '@/utils/server-api';
import EditBeverageForm from './edit-form';

export default async function EditBeveragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  if (!id) {
    redirect('/collection');
  }

  // Fetch the beverage data
  try {
    const beverage = await serverBeverageApi.getById(id);

    return (
      <div className="container mx-auto px-3 py-4">
        <div className="items-center mb-4 hidden md:flex">
          <Button variant="ghost" size="icon" className="mr-2 inline-flex" asChild>
            <Link
              href={`/collection/${id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to beverage details</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight block">Edit Beverage</h1>
        </div>

        <EditBeverageForm beverage={beverage} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching beverage:', error);
    redirect('/collection');
  }
}
