"use server";

import { redirect } from "next/navigation";
import { serverBeverageApi } from "@/utils/server-api";

/**
 * Server action to delete a beverage
 */
export async function deleteBeverageAction(id: string) {
  try {
    await serverBeverageApi.delete(id);
    return { success: true, message: "Beverage deleted successfully" };
  } catch (error) {
    console.error("Error deleting beverage:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete beverage",
    };
  }
}

/**
 * Server action to fetch beverages with filters
 */
export async function fetchBeveragesAction(filters?: {
  type?: string;
  liked?: boolean;
  sort_by?: "name" | "type" | "producer" | "created_at";
  sort_order?: "asc" | "desc";
}) {
  try {
    console.log("Fetching beverages with filters:", filters);
    const beverages = await serverBeverageApi.getAll(filters);
    console.log(`Fetched ${beverages.length} beverages`);
    return { success: true, data: beverages };
  } catch (error) {
    console.error("Error fetching beverages:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch beverages",
      data: [],
    };
  }
}
