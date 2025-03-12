import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  variant?: "default" | "card";
};

export function ThemedView({
  style,
  className,
  variant = "default",
  ...otherProps
}: ThemedViewProps) {
  const variantClasses = {
    default: "bg-background dark:bg-background",
    card: "bg-card dark:bg-card",
  };

  return (
    <View
      style={style}
      className={`${variantClasses[variant]} ${className || ""}`}
      {...otherProps}
    />
  );
}
