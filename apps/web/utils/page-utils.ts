/**
 * Utility to get page title based on current path
 */

type PageTitleMap = {
  [key: string]: string;
};

// Map routes to their respective titles
const PAGE_TITLES: PageTitleMap = {
  '/': 'WhichCraft',
  '/collection': 'Collection',
  '/stats': 'Stats',
  '/collection/add': 'Add Beverage',
  '/collection/edit': 'Edit Beverage',
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

  // Check for collection view page
  if (path.match(/\/collection\/view\/[^/]+/)) {
    return 'Beverage Details';
  }

  // Check for collection edit page
  if (path.match(/\/collection\/edit\/[^/]+/)) {
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
