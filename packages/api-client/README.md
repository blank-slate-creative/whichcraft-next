# @whichcraft/api-client

A shared API client for the Whichcraft application, used by both the web and
mobile apps.

## Installation

This package is part of the Whichcraft monorepo and is automatically available
to all apps in the workspace.

## Usage

### Web App (Next.js)

```typescript
// apps/web/utils/server-api.ts
import { createBeverageApi } from "@whichcraft/api-client";
import { createClient } from "@/utils/supabase/server";

// Get the authentication token from Supabase (server-side)
async function getServerAuthToken() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// Create the server-side beverage API
export const serverBeverageApi = createBeverageApi(getServerAuthToken);

// Example usage in a server component or server action
// const beverages = await serverBeverageApi.getAll();
```

### Mobile App (React Native)

```typescript
// apps/mobile/utils/api.ts
import { createBeverageApi } from "@whichcraft/api-client";
import { supabase } from "@/utils/supabase";

// Get the authentication token from Supabase (mobile)
async function getMobileAuthToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// Create the mobile beverage API
export const mobileBeverageApi = createBeverageApi(getMobileAuthToken);

// Example usage in a React Native component
// const beverages = await mobileBeverageApi.getAll();
```

## API

### Beverage API

- `getAll(filters?: BeverageFilters): Promise<Beverage[]>` - Get all beverages
  for the current user
- `getById(id: string): Promise<Beverage>` - Get a specific beverage by ID
- `create(beverage: Partial<Beverage>): Promise<Beverage>` - Create a new
  beverage
- `update(id: string, beverage: Partial<Beverage>): Promise<Beverage>` - Update
  an existing beverage
- `delete(id: string): Promise<void>` - Delete a beverage

### Types

```typescript
interface BeverageFilters {
  type?: string;
  liked?: boolean;
  sort_by?: "name" | "type" | "producer" | "created_at";
  sort_order?: "asc" | "desc";
}

interface Beverage {
  id: string;
  name: string;
  type: string;
  producer?: string;
  liked?: boolean;
  created_at: string;
  [key: string]: any;
}
```
