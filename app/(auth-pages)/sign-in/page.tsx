import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { redirectAuthenticatedToHome } from "@/utils/auth";

export default async function Login(props: { searchParams: Promise<Message> }) {
  // Redirect authenticated users to dashboard
  await redirectAuthenticatedToHome();

  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-base text-muted-foreground mb-8">
        Don't have an account?{" "}
        <Link
          className="text-primary font-medium underline hover:text-primary/90"
          href="/sign-up"
        >
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-muted-foreground hover:text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>
        <div className="pt-2">
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="w-full"
          >
            Sign in
          </SubmitButton>
        </div>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
