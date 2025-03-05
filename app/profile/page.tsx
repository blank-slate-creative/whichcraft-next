import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ProfileActions from "@/app/profile/profile-actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userName = session?.user?.email?.split("@")[0] || "User";
  const email = session?.user?.email || "";

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userName}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Theme</h2>
        <ThemeSwitcher variant="buttons" />
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <ProfileActions />
      </div>
    </div>
  );
}
