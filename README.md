# WhichCraft

WhichCraft is an application that helps users keep track of which beers and
wines they've tried and whether they liked them or not. It provides a simple and
intuitive interface for recording and rating beverages, making it easy to
remember your favorites and avoid repeating mistakes.

## Features

- **Beverage Collection Management**: Easily add, edit, and delete beers and
  wines you've tried
- **Like/Dislike Rating System**: Simple thumbs up/thumbs down approach to
  rating beverages
- **Detailed Beverage Information**: Track producer, style, ABV, and year for
  each beverage
- **Personal Notes**: Add your own tasting notes and location information
- **Advanced Filtering & Sorting**: Filter by beverage type, rating, and sort by
  various criteria
- **Beverage Search**: Quickly find beverages in your collection
- **Visual Statistics**: View insights about your collection with charts and
  statistics
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Secure Authentication**: Powered by Supabase authentication
- **User Profiles**: Manage your account information

## Tech Stack

- **Frontend**:

  - Next.js 14 with App Router
  - TypeScript
  - TailwindCSS for styling
  - Shadcn UI components
  - Lucide React icons
  - Space Grotesk typography

- **Backend**:

  - FastAPI with Pydantic models and SQLAlchemy
  - PostgreSQL database (via Supabase)
  - JWT authentication
  - Alembic for database migrations

- **Infrastructure**:
  - Supabase for authentication and database
  - Fly.io for API deployment
  - Vercel for frontend deployment
  - Turborepo for monorepo management

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Python 3.9+
- Docker (optional, for containerized deployment)
- Supabase account
- Fly.io account (optional, for deployment)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/whichcraft.git
   cd whichcraft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` for the frontend in the
   `apps/web` directory:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   and for the backend in the `apps/api` directory:

   ```
   DATABASE_URL=your-supabase-postgres-connection-string
   JWT_SECRET=your-jwt-secret
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

### Build and Deploy

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the frontend to Vercel:

   ```bash
   cd apps/web
   vercel
   ```

3. Deploy the API to Fly.io:
   ```bash
   cd apps/api
   ./deploy-api.sh
   ```

## Database Schema

The application uses the following main tables:

- **Users**: User accounts and authentication information
- **Producers**: Breweries and wineries that make beverages
- **BeverageTypes**: Categories like Beer, Wine, etc.
- **Beverages**: Detailed beverage information including name, style, ABV, etc.
- **Entries**: User ratings and notes for beverages they've tried

## API Endpoints

The backend provides the following main endpoints:

- `GET /api/beverages`: List all beverages in user's collection
- `POST /api/beverages`: Add a new beverage to collection
- `GET /api/beverages/:id`: Get details for a specific beverage
- `PUT /api/beverages/:id`: Update a beverage entry
- `DELETE /api/beverages/:id`: Remove a beverage from collection
- `GET /api/users/me`: Get current user information
- `GET /api/search/beer`: Search for beers to add to collection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

# Whichcraft Next Monorepo

This is a monorepo for the Whichcraft Next project, built with
[Turborepo](https://turbo.build/repo).

## What's inside?

This monorepo uses [npm](https://www.npmjs.com/) as a package manager. It
includes the following packages/apps:

### Apps

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: a [FastAPI](https://fastapi.tiangolo.com/) app

### Packages

- `turbo`: [Turborepo](https://turbo.build/repo) for monorepo management

## Setup

### Install dependencies

```
npm install
```

### Development

To develop all apps and packages, run the following command:

```
npm run dev
```

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Deployment

Each app can be deployed independently to its respective platform.

#### Web App (Next.js)

The web app can be deployed to Vercel.

#### API (FastAPI)

The API can be deployed to Fly.io using the deploy script.

# WhichCraft Next

A next-generation app for craft beer enthusiasts.

## Features

### Location Search

The app includes a lightweight location search implementation with the following
features:

- Native iOS location search via Expo Location integration
- Venue search with address and coordinates
- Simple, reusable React component
- Custom React hook for location search logic

### Usage

```jsx
import { LocationSearch } from "./app/components/LocationSearch";

// In your component
<LocationSearch
  onSelectLocation={(location) => {
    console.log(location.name, location.address, location.coordinates);
  }}
  placeholder="Search for venues"
/>;
```

## Implementation Details

The location search feature uses:

1. **Expo Location** for permission handling and current location
2. A lightweight MapKit JS wrapper for iOS native search (placeholder for real
   implementation)
3. Simple, reusable React components

## Setup Instructions

1. Install dependencies:

```
npm install expo-location
```

2. Add location permissions to your app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
}
```

3. Import and use the LocationSearch component in your screens.

## Example

See the `app/screens/LocationSearchExample.tsx` file for a complete usage
example.
