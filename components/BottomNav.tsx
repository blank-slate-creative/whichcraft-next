'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Beer, BarChart3, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on auth pages
  if (pathname.includes('/auth') || pathname === '/') {
    return null;
  }

  const isActive = (path: string) => {
    if (pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const navItems = [
    {
      href: '/collection',
      label: 'Collection',
      icon: <Beer className="h-5 w-5" />,
    },
    {
      href: '/stats',
      label: 'Stats',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="bg-background border-t shadow-lg z-10 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? 'default' : 'ghost'}
            size="icon"
            className="flex flex-col items-center justify-center h-full w-full rounded-none transition-colors duration-200"
            asChild
          >
            <Link href={item.href} prefetch={true}>
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
