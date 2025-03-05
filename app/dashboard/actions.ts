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
