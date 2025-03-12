/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "@/hooks/useColorScheme";

// Map of color names to their corresponding NativeWind classes
const colorClassMap = {
  text: {
    light: "text-foreground",
    dark: "dark:text-foreground",
  },
  background: {
    light: "bg-background",
    dark: "dark:bg-background",
  },
  tint: {
    light: "text-primary",
    dark: "dark:text-primary",
  },
  icon: {
    light: "text-muted-foreground",
    dark: "dark:text-muted-foreground",
  },
  tabIconDefault: {
    light: "text-muted-foreground",
    dark: "dark:text-muted-foreground",
  },
  tabIconSelected: {
    light: "text-primary",
    dark: "dark:text-primary",
  },
};

export type ThemeColorName = keyof typeof colorClassMap;

/**
 * Returns the appropriate NativeWind color class based on the current theme
 * @param props Optional override classes for light and dark modes
 * @param colorName The name of the color to use
 * @returns A string containing the appropriate NativeWind class(es)
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return both light and dark classes to support system theme changes
    return `${colorClassMap[colorName].light} ${colorClassMap[colorName].dark}`;
  }
}
