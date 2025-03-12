import { requireAuth } from '@/utils/auth';
import { serverBeverageApi } from '@/utils/server-api';
import { StatsContent } from './stats-content';
import { Beverage } from '@whichcraft/api-client';

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

  return <StatsContent beverages={beverages} error={error} />;
}
