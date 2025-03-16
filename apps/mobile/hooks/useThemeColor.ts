import { useColorScheme } from "nativewind";
import { Colors } from "../constants/Colors";

/**
 * A hook that provides access to theme colors based on the current color scheme.
 * This replaces the need to use ThemeColors.get(isDark, colorName) throughout the app.
 */
export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  /**
   * Get a color from the theme based on the current color scheme
   * @param colorName The name of the color to get
   * @returns The color value as a string (rgb format)
   */
  const getColor = (colorName: keyof typeof Colors.light) => {
    return isDark ? Colors.dark[colorName] : Colors.light[colorName];
  };

  // Return all theme colors as an object for easy access
  const colors = {
    background: getColor("background"),
    foreground: getColor("foreground"),
    primary: getColor("primary"),
    primaryForeground: getColor("primaryForeground"),
    secondary: getColor("secondary"),
    secondaryForeground: getColor("secondaryForeground"),
    muted: getColor("muted"),
    mutedForeground: getColor("mutedForeground"),
    accent: getColor("accent"),
    accentForeground: getColor("accentForeground"),
    destructive: getColor("destructive"),
    border: getColor("border"),
  };

  return {
    isDark,
    getColor,
    colors,
  };
}
