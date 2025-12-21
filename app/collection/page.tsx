import { requireAuth } from '@/utils/auth';
import { serverBeverageApi } from '@/utils/server-api';
import { BeverageProvider } from './beverage-context';
import { CollectionContent } from './collection-content';
import { Beverage } from '@/lib/api-client';

export default async function Collection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Ensure user is authenticated
  const { user } = await requireAuth();

  // Extract filter parameters from URL
  const resolvedParams = await searchParams;
  const type = resolvedParams.type as string | undefined;
  const liked = resolvedParams.liked !== undefined ? resolvedParams.liked === 'true' : undefined;

  // Extract sorting parameters
  const sort_by = resolvedParams.sort_by as 'name' | 'type' | 'producer' | 'created_at' | undefined;
  const sort_order = resolvedParams.sort_order as 'asc' | 'desc' | undefined;

  // Fetch beverages from the API with filters and sorting
  let beverages: Beverage[] = [];
  let error = null;

  try {
    // Use the server-side API utility with filters and sorting
    beverages = await serverBeverageApi.getAll({
      type,
      liked,
      sort_by,
      sort_order,
    });
  } catch (err) {
    console.error('Failed to fetch beverages:', err);
    error = err instanceof Error ? err.message : 'Failed to load beverages';
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-3 md:px-4 py-4">
      <BeverageProvider initialBeverages={beverages}>
        <CollectionContent error={error} />
      </BeverageProvider>
    </div>
  );
}
