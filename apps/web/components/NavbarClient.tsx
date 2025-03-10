'use client';

import UserMenu from './UserMenu';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Beer, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NavbarClient() {
  const [userName, setUserName] = useState('User');
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserName(session.user.email.split('@')[0]);
      }
    };

    getUser();
  }, [supabase]);

  const isActive = (path: string) => {
    if (path === '/collection' && pathname === '/collection') {
      return true;
    }
    if (path !== '/collection' && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const navLinks = [
    {
      href: '/collection',
      label: 'Collection',
      icon: <Beer className="h-4 w-4" />,
    },
    {
      href: '/collection/stats',
      label: 'Stats',
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  // Check if the current path is the collection page
  const isCollectionPage = pathname === '/collection';

  return (
    <div className="flex items-center gap-4">
      {isCollectionPage && (
        <Button
          className="bg-primary hover:bg-primary/90 transition-colors duration-200"
          size="sm"
          asChild
        >
          <Link href="/collection/add" prefetch={true}>
            <Plus className="h-4 w-4 mr-1" />
            Add Beverage
          </Link>
        </Button>
      )}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={true}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive(link.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-1">
              {link.icon}
              {link.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="hidden sm:block">
        <UserMenu userName={userName} />
      </div>
    </div>
  );
}
