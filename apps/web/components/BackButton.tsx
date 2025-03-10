'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine if we should show a back button based on the current path
  const shouldShowBackButton = () => {
    // Don't show on main pages
    if (
      pathname === '/' ||
      pathname === '/dashboard' ||
      pathname === '/profile' ||
      pathname === '/about' ||
      pathname === '/dashboard/stats'
    ) {
      return false;
    }

    // Show on detail/edit/add pages
    return true;
  };

  if (!shouldShowBackButton()) {
    return null;
  }

  // Determine the correct back path
  const getBackPath = () => {
    // For add/edit/view pages in dashboard, go back to dashboard
    if (
      pathname.includes('/dashboard/add') ||
      pathname.includes('/dashboard/edit') ||
      pathname.includes('/dashboard/view')
    ) {
      return '/dashboard';
    }

    // Default to browser history back
    return '';
  };

  const handleBack = () => {
    const backPath = getBackPath();
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`mr-1 ${className}`}
      onClick={handleBack}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
