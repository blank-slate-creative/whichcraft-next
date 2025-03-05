"use server";

import { redirect } from "next/navigation";
import { serverBeverageApi } from "@/utils/server-api";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export async function updateBeverageAction(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const liked = formData.get("liked") as string;

  if (!name || !type || liked === undefined) {
    return {
      status: "error",
      message: "Please fill in all required fields and rate the beverage",
    };
  }

  try {
    // Update beverage using the server API utility
    await serverBeverageApi.update(id, {
      name,
      producer: formData.get("producer"),
      type,
      style: formData.get("style"),
      notes: formData.get("notes"),
      liked: liked === "true",
      abv: formData.get("abv"),
    });

    // Return success state before redirecting
    return {
      status: "success",
      message: "Beverage updated successfully!",
    };
  } catch (error) {
    console.error("Error updating beverage:", error);
    return {
      status: "error",
      message: "Failed to update beverage. Please try again.",
    };
  }
}

// Separate action for handling redirect after successful update
export async function redirectToDashboard() {
  redirect("/dashboard");
}
