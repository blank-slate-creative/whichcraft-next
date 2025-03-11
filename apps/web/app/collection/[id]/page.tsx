import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { serverBeverageApi } from '@/utils/server-api';
import { Beverage } from '../beverage-context';
import { DeleteButton } from './delete-button';
import { BeverageDisplay } from '@/components/BeverageDisplay';

export default async function ViewBeveragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  // Get authenticated user
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
    const beverage: Beverage = await serverBeverageApi.getById(id);

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
          <h1 className="text-2xl font-bold tracking-tight block">Beverage Details</h1>
        </div>

        <div className="space-y-6">
          <BeverageDisplay
            beverage={beverage}
            variant="detail"
            imageSize="lg"
            showLiked={true}
            linkToDetail={false}
          />

          <div className="flex justify-end gap-2">
            <DeleteButton id={beverage.id} name={beverage.name} />
            <Button asChild>
              <Link href={`/collection/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Beverage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching beverage:', error);
    redirect('/collection');
  }
}
