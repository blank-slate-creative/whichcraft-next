import { requireAuth } from "@/utils/auth";
import { serverBeverageApi } from "@/utils/server-api";
import { BeverageProvider } from "./beverage-context";
import { DashboardContent } from "./dashboard-content";

// Define the Beverage interface
interface Beverage {
  id: number | string;
  name: string;
  type: string;
  style: string;
  producer: string;
  liked: boolean;
  notes: string;
  created_at: string;
}

export default async function Dashboard() {
  // Ensure user is authenticated
  const { user } = await requireAuth();

  // Fetch beverages from the API
  let beverages: Beverage[] = [];
  let error = null;

  try {
    // Use the server-side API utility
    beverages = await serverBeverageApi.getAll();
  } catch (err) {
    console.error("Failed to fetch beverages:", err);
    error = err instanceof Error ? err.message : "Failed to load beverages";
  }

  return (
    <BeverageProvider initialBeverages={beverages}>
      <DashboardContent error={error} />
    </BeverageProvider>
  );
}
