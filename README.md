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
  - Next.js 15 with App Router
  - React 19
  - TypeScript
  - TailwindCSS for styling
  - Shadcn UI components
  - Lucide React icons

- **Backend**:
  - FastAPI (separate repository: [whichcraft-api](https://github.com/ericcecchi/whichcraft-api))
  - PostgreSQL database (via Supabase)
  - JWT authentication

- **Infrastructure**:
  - Supabase for authentication and database
  - Vercel for frontend deployment

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 11.2.0 or newer
- Supabase account

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/ericcecchi/whichcraft-next.git
   cd whichcraft-next
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Build and Deploy

1. Build the application:

   ```bash
   npm run build
   ```

2. Run in production mode:

   ```bash
   npm start
   ```

3. Deploy to Vercel:

   Connect your GitHub repository to Vercel or use the Vercel CLI:

   ```bash
   vercel
   ```

## Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Project Structure

```
whichcraft-next/
├── app/                    # Next.js app directory
│   ├── (auth-pages)/      # Authentication pages
│   ├── collection/        # Beverage collection pages
│   ├── stats/            # Statistics pages
│   └── profile/          # User profile pages
├── components/           # React components
│   └── ui/              # Shadcn UI components
├── lib/                 # Library code
│   ├── api-client/      # API client for backend communication
│   └── beverage-context/ # Beverage state management
├── utils/               # Utility functions
│   └── supabase/       # Supabase client configuration
├── public/             # Static assets
└── supabase/           # Supabase configuration and migrations
```

## API Backend

The backend API is maintained in a separate repository:
[whichcraft-api](https://github.com/ericcecchi/whichcraft-api)

The API provides endpoints for:

- Beverage CRUD operations
- User authentication
- Beer search via Untappd
- Venue search
- Statistics aggregation

## Shared brew lists

`/l` opens a brew list shared from the app. The list travels in the link itself
(`https://whichcraft.beer/l#<payload>`); the part after the `#` is never sent to a server, so the
site stores nothing. The page shows the title and each beer's name and producer as plain text, is
`noindex`, and carries a "not verified by WhichCraft" line.

- Format and limits: `lib/share/brewlist.ts`.
- Shared test data, the contract with the iOS app: `lib/share/fixtures/shared-brewlist-v1.json` is
  copied byte for byte from WhichCraft-iOS (`WhichCraftTests/Fixtures/shared-brewlist-v1.json`),
  which owns it. Change it there first, then copy it here; never edit this copy. Its `contract`
  array lists the rules the reader enforces, and the tests read its `valid` and `invalid` cases.
- Tests: `npm test`.
- Universal links: `public/.well-known/apple-app-site-association` (served as `application/json`
  from `next.config.ts`) hands `/l` and `/l/` to the app (the only paths the app accepts as share links).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
