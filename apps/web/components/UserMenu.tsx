'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOutAction } from '@/app/actions';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" className="w-full justify-start" disabled={pending}>
      {pending ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}

export default function UserMenu({ userName = 'User' }: { userName?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {userName
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenuItems() {
  const { theme, setTheme } = useTheme();
  const [_, formAction] = useActionState(signOutAction, null);

  return (
    <>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <form action={formAction}>
        <SignOutButton />
      </form>
    </>
  );
}
