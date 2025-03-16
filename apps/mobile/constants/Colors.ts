/**
 * Below are the colors that are used in the app based on the tailwind theme in global.css.
 * This file provides hex color values derived from the RGB values in the tailwind theme.
 * The app uses NativeWind for styling as recommended.
 */

// Light theme colors from tailwind theme
const lightColors = {
  background: "#FFFFFF", // --background: 255, 255, 255
  foreground: "#0A0A0A", // --foreground: 10, 10, 10
  primary: "#0A0A0A", // --primary: 10, 10, 10
  primaryForeground: "#FAFAFA", // --primary-foreground: 250, 250, 250
  secondary: "#F5F5F5", // --secondary: 245, 245, 245
  secondaryForeground: "#0A0A0A", // --secondary-foreground: 10, 10, 10
  muted: "#F5F5F5", // --muted: 245, 245, 245
  mutedForeground: "#737373", // --muted-foreground: 115, 115, 115
  accent: "#F5F5F5", // --accent: 245, 245, 245
  accentForeground: "#0A0A0A", // --accent-foreground: 10, 10, 10
  destructive: "#EF4444", // --destructive: 239, 68, 68
  border: "#E6E6E6", // --border: 230, 230, 230
};

// Dark theme colors from tailwind theme
const darkColors = {
  background: "#0A0A0A", // --background: 10, 10, 10
  foreground: "#FAFAFA", // --foreground: 250, 250, 250
  primary: "#FAFAFA", // --primary: 250, 250, 250
  primaryForeground: "#0A0A0A", // --primary-foreground: 10, 10, 10
  secondary: "#262626", // --secondary: 38, 38, 38
  secondaryForeground: "#FAFAFA", // --secondary-foreground: 250, 250, 250
  muted: "#262626", // --muted: 38, 38, 38
  mutedForeground: "#A3A3A3", // --muted-foreground: 163, 163, 163
  accent: "#262626", // --accent: 38, 38, 38
  accentForeground: "#FAFAFA", // --accent-foreground: 250, 250, 250
  destructive: "#7F1D1D", // --destructive: 127, 29, 29
  border: "#262626", // --border: 38, 38, 38
};

// RGB values for direct use in components
const rgbColors = {
  light: {
    background: "rgb(255, 255, 255)",
    foreground: "rgb(10, 10, 10)",
    primary: "rgb(10, 10, 10)",
    primaryForeground: "rgb(250, 250, 250)",
    secondary: "rgb(245, 245, 245)",
    secondaryForeground: "rgb(10, 10, 10)",
    muted: "rgb(245, 245, 245)",
    mutedForeground: "rgb(115, 115, 115)",
    accent: "rgb(245, 245, 245)",
    accentForeground: "rgb(10, 10, 10)",
    destructive: "rgb(239, 68, 68)",
    border: "rgb(230, 230, 230)",
  },
  dark: {
    background: "rgb(10, 10, 10)",
    foreground: "rgb(250, 250, 250)",
    primary: "rgb(250, 250, 250)",
    primaryForeground: "rgb(10, 10, 10)",
    secondary: "rgb(38, 38, 38)",
    secondaryForeground: "rgb(250, 250, 250)",
    muted: "rgb(38, 38, 38)",
    mutedForeground: "rgb(163, 163, 163)",
    accent: "rgb(38, 38, 38)",
    accentForeground: "rgb(250, 250, 250)",
    destructive: "rgb(239, 68, 68)", // Using the same as light for consistency with current code
    border: "rgb(38, 38, 38)",
  },
};

export const Colors = {
  light: {
    text: lightColors.foreground,
    background: lightColors.background,
    tint: lightColors.primary,
    icon: lightColors.mutedForeground,
    tabIconDefault: lightColors.mutedForeground,
    tabIconSelected: lightColors.primary,
  },
  dark: {
    text: darkColors.foreground,
    background: darkColors.background,
    tint: darkColors.primary,
    icon: darkColors.mutedForeground,
    tabIconDefault: darkColors.mutedForeground,
    tabIconSelected: darkColors.primary,
  },
};

// Export RGB colors for direct use in components
export const ThemeColors = {
  // Function to get the appropriate color based on the theme
  get: (isDark: boolean, colorName: keyof typeof rgbColors.light) => {
    return isDark ? rgbColors.dark[colorName] : rgbColors.light[colorName];
  },
  // Direct access to RGB colors
  rgb: rgbColors,
};
