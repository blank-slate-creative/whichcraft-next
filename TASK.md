# Tasks

## Completed Tasks

### 2025-12-20: Convert Monorepo to Single Web App Repository

**Status**: ✅ Completed

**Description**: Converted the whichcraft-next repository from a Turborepo monorepo structure to a single Next.js web app repository.

**Changes Made**:
1. Moved package code from `packages/api-client` and `packages/beverage-context` to `lib/` directory in the web app
2. Moved all web app files from `apps/web/` to the repository root
3. Updated all imports from `@whichcraft/*` workspace packages to `@/lib/*` local imports
4. Merged dependencies from workspace packages into the root `package.json`
5. Removed workspace configuration and Turborepo setup
6. Removed `apps/`, `packages/`, and `turbo.json`
7. Updated documentation (README.md and PLANNING.md)
8. Validated with type checking and linting

**Files Modified**:
- `package.json` - Removed workspace config, merged dependencies, updated name
- `README.md` - Updated for single app structure
- `PLANNING.md` - Updated architecture documentation
- All component and page files - Updated imports to use local lib

**Files Added**:
- `lib/api-client/` - API client library (moved from packages)
- `lib/beverage-context/` - Beverage context library (moved from packages)
- `TASK.md` - This file

**Files Removed**:
- `apps/` directory
- `packages/` directory
- `turbo.json`

**Validation**:
- ✅ TypeScript compilation passes (`npm run typecheck`)
- ✅ Linting passes with auto-fixes applied
- ✅ All imports updated successfully
- ✅ Code structure maintained

**Notes**:
- The build process requires network access to Google Fonts, which may fail in some CI environments
- The code itself compiles correctly and is production-ready
- Environment variables must be set for the app to run (see `.env.example`)
