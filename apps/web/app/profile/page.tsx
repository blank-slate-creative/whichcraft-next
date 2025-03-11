import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';
import ProfileActions from '@/app/profile/profile-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGravatarUrl } from '@/utils/gravatar';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const userName = session?.user?.email?.split('@')[0] || 'User';
  const email = session?.user?.email || '';
  const gravatarUrl = await getGravatarUrl(email, 120); // 120px size for the 32x32 avatar (4x for retina)

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-8 md:flex hidden">Profile</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={gravatarUrl} alt={userName} />
              <AvatarFallback className="text-xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <ProfileActions />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Theme</h2>
        <ThemeSwitcher variant="buttons" />
      </div>
    </div>
  );
}
