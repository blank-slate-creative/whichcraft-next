import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddBeverageForm from "./add-form"; // We'll create this client component

export default async function AddBeveragePage() {
  const supabase = await createClient();

  // Replace getSession with getUser for secure authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check for authentication errors or missing user
  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        <Link
          href="/dashboard"
          className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Add New Beverage</h1>
      </div>

      <AddBeverageForm user={user} />
    </div>
  );
}
