import { requireAuth } from '@/utils/auth';
import { serverBeverageApi } from '@/utils/server-api';
import { StatsContent } from './stats-content';
import { Beverage } from '@/lib/api-client';

export default async function StatsPage() {
  // Ensure user is authenticated
  const { user } = await requireAuth();

  // Fetch all beverages for stats
  let beverages: Beverage[] = [];
  let error = null;

  try {
    // Use the server-side API utility to get all beverages
    beverages = await serverBeverageApi.getAll({});
  } catch (err) {
    console.error('Failed to fetch beverages:', err);
    error = err instanceof Error ? err.message : 'Failed to load beverages';
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-3 md:px-4 py-4">
      <StatsContent beverages={beverages} error={error} />
    </div>
  );
}
