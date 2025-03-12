import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  className,
  ...otherProps
}: ThemedViewProps) {
  const backgroundClass = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View
      style={style}
      className={`${backgroundClass} ${className || ""}`}
      {...otherProps}
    />
  );
}
