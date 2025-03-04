"use server";

import { redirect } from "next/navigation";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export async function saveBeverageAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const liked = formData.get("liked") as string;
  const userId = formData.get("user_id") as string;

  if (!name || !type || !liked) {
    return {
      status: "error",
      message: "Please fill in all required fields and rate the beverage",
    };
  }

  try {
    // Submit to API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/beverages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          producer: formData.get("producer"),
          type,
          style: formData.get("style"),
          notes: formData.get("notes"),
          liked: liked === "true",
          location: formData.get("location"),
          user_id: userId,
          rating: liked === "true" ? 1 : 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save beverage");
    }

    // Redirect to dashboard on success
    redirect("/dashboard");
  } catch (error) {
    console.error("Error saving beverage:", error);
    return {
      status: "error",
      message: "Failed to save beverage. Please try again.",
    };
  }
}
