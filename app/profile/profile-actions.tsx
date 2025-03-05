"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileActions() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-full sm:w-auto"
      >
        Sign out
      </Button>
    </div>
  );
}
