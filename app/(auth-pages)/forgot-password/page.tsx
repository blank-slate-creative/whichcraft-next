"use client";

import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";

// Define the possible return types from the forgotPasswordAction
type ForgotPasswordState =
  | { error: string; success?: undefined; redirect?: undefined }
  | { success: string; error?: undefined; redirect?: undefined }
  | { success: boolean; redirect: string; error?: undefined }
  | null;

export default function ForgotPassword() {
  // Initialize with null state
  const [state, formAction] = useActionState<ForgotPasswordState, FormData>(
    forgotPasswordAction,
    null
  );

  // Convert the state to a Message type for FormMessage component
  const message: Message | null =
    state ?
      "error" in state && state.error ? { error: state.error }
      : "success" in state && typeof state.success === "string" ?
        { success: state.success }
      : null
    : null;

  return (
    <>
      <form
        action={formAction}
        className="flex-1 flex flex-col min-w-80 max-w-80 mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-base text-muted-foreground mb-8">
          Already have an account?{" "}
          <Link
            className="text-primary font-medium underline hover:text-primary/90"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>
          <div className="pt-2">
            <SubmitButton className="w-full">Reset Password</SubmitButton>
          </div>
          {message && <FormMessage message={message} />}
        </div>
      </form>
    </>
  );
}
