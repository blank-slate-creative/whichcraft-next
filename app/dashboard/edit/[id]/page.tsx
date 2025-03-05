import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { serverBeverageApi } from "@/utils/server-api";
import EditBeverageForm from "../edit-form";

export default async function EditBeveragePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  if (!id) {
    redirect("/dashboard");
  }

  // Fetch the beverage data
  try {
    const beverage = await serverBeverageApi.getById(id);

    return (
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-0 py-4 sm:py-8">
        <div className="flex items-center mb-4 sm:mb-8">
          <Button variant="ghost" size="icon" className="mr-2 sm:mr-4" asChild>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Beverage</h1>
        </div>

        <EditBeverageForm initialBeverage={beverage} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching beverage:", error);
    redirect("/dashboard");
  }
}
