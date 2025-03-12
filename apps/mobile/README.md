# Mobile App

This is the mobile app for the Whichcraft project.

## React Resolution in Monorepo

This project is configured to use the local version of React (18.3.1) instead of
the monorepo root version (19.0.0). This is achieved through several
configuration files:

1. **metro.config.js**: Configured to resolve React from the local node_modules
   directory.
2. **tsconfig.json**: Updated with paths to resolve React from local
   node_modules.

## Scripts

- `npm start`: Start the Expo development server.
- `npm run reset-modules`: Reset node_modules and Metro cache to ensure local
  React resolution.
- `npm run reset-project`: Reset the project to a blank state.
- `npm run android`: Start the app on an Android device/emulator.
- `npm run ios`: Start the app on an iOS device/simulator.
- `npm run web`: Start the app in a web browser.

## Troubleshooting

If you encounter issues with React version conflicts:

1. Run `npm run reset-modules` to clear node_modules and Metro cache.
2. Restart the development server with `npm start`.

## Development

This project uses:

- Expo for React Native development
- NativeWind for styling (Tailwind CSS for React Native)
- TypeScript for type safety

## About WhichCraft

WhichCraft helps you keep track of which beers and wines you've tried and
whether you liked them or not. The mobile app provides a convenient way to
record and rate beverages on the go, making it easy to remember your favorites
and avoid repeating mistakes.

## Features

- **Mobile-First Experience**: Optimized for on-the-go beverage tracking
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
- **Dark/Light Mode**: Choose your preferred theme
- **Offline Support**: Record beverages even without an internet connection
- **Sync with Web App**: Seamlessly sync your data with the WhichCraft web
  application
- **Camera Integration**: Take photos of beverage labels to add to your entries

## Tech Stack

- **Frontend**:

  - Expo & React Native
  - TypeScript
  - NativeWind (TailwindCSS for React Native)
  - Expo Router for navigation
  - Reanimated for animations
  - Lucide React Native icons

- **Backend Integration**:
  - Connects to the same Supabase backend as the web app
  - Offline-first architecture with local SQLite storage
  - Background sync capabilities

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app
  development with Expo

You can start developing by editing the files inside the **app** directory. This
project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Development

The WhichCraft mobile app is part of a monorepo that also includes the web
application. The mobile app shares design principles, data models, and backend
services with the web app while providing a native mobile experience.

### Environment Setup

Create a `.env` file in the `apps/mobile` directory with the following
variables:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://your-api-url
```

## Learn more

To learn more about developing your project with Expo, look at the following
resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into
  advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a
  step-by-step tutorial where you'll create a project that runs on Android, iOS,
  and the web.

## Related Projects

- [WhichCraft Web App](../web): The web version of WhichCraft
- [WhichCraft API](../api): The backend API that powers both web and mobile apps
