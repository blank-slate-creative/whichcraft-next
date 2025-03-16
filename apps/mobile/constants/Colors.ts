/**
 * Below are the colors that are used in the app based on the tailwind theme in global.css.
 * The app uses NativeWind for styling as recommended.
 */

// RGB values for direct use in components
export const Colors = {
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
