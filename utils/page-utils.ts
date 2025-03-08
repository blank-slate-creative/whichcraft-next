/**
 * Utility to get page title based on current path
 */

type PageTitleMap = {
  [key: string]: string;
};

// Map routes to their respective titles
const PAGE_TITLES: PageTitleMap = {
  '/': 'WhichCraft',
  '/dashboard': 'Collection',
  '/dashboard/stats': 'Stats',
  '/dashboard/add': 'Add Beverage',
  '/dashboard/edit': 'Edit Beverage',
  '/profile': 'Profile',
  '/about': 'About',
  '/auth/login': 'Login',
  '/auth/signup': 'Sign Up',
  '/auth/forgot-password': 'Reset Password',
  '/reset-password': 'Reset Password',
};

/**
 * Get the page title based on the current path
 */
export function getPageTitle(path: string): string {
  // First check for exact match
  if (path in PAGE_TITLES) {
    return PAGE_TITLES[path];
  }

  // Check for dashboard view page
  if (path.match(/\/dashboard\/view\/[^/]+/)) {
    return 'Beverage Details';
  }

  // Check for dashboard edit page
  if (path.match(/\/dashboard\/edit\/[^/]+/)) {
    return 'Edit Beverage';
  }

  // Check for paths that start with a known prefix
  for (const [route, title] of Object.entries(PAGE_TITLES)) {
    if (path.startsWith(`${route}/`) && route !== '/') {
      return title;
    }
  }

  // Default fallback
  return 'WhichCraft';
}
