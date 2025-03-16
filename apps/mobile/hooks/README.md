# Custom Hooks

This directory contains custom hooks used throughout the mobile app.

## useThemeColor

A hook that provides access to theme colors based on the current color scheme.
This replaces the need to use `ThemeColors.get(isDark, colorName)` throughout
the app.

### Usage

```tsx
import { useThemeColor } from "../hooks/useThemeColor";

function MyComponent() {
  // Get all colors and isDark flag
  const { colors, isDark } = useThemeColor();

  // Use colors directly
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Hello World</Text>
    </View>
  );
}
```

### Getting a specific color

You can also use the `getColor` function to get a specific color:

```tsx
import { useThemeColor } from "../hooks/useThemeColor";

function MyComponent() {
  const { getColor } = useThemeColor();

  // Get a specific color
  const primaryColor = getColor("primary");

  return (
    <View>
      <Text style={{ color: primaryColor }}>Hello World</Text>
    </View>
  );
}
```

### Available Colors

The following colors are available:

- `background`
- `foreground`
- `primary`
- `primaryForeground`
- `secondary`
- `secondaryForeground`
- `muted`
- `mutedForeground`
- `accent`
- `accentForeground`
- `destructive`
- `border`

### Benefits

- Simplifies access to theme colors
- Automatically handles dark/light mode switching
- Provides type safety for color names
- Centralizes theme color logic in one place
