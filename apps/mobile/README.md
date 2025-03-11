# WhichCraft Mobile App 🍺🍷

This is the mobile companion app for WhichCraft, built with
[Expo](https://expo.dev) and React Native.

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
