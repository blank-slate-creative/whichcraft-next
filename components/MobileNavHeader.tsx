'use client';

import { usePathname } from 'next/navigation';
import BackButton from './BackButton';
import { getPageTitle } from '@/utils/page-utils';

export default function MobileNavHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

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

  return (
    <div className="flex items-center">
      {shouldShowBackButton() && <BackButton />}
      <h1 className="font-bold text-xl">{pageTitle}</h1>
    </div>
  );
}
