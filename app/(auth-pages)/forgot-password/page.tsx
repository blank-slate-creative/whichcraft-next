import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex-1 flex flex-col min-w-64 max-w-64 mx-auto">
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
            <SubmitButton formAction={forgotPasswordAction} className="w-full">
              Reset Password
            </SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
