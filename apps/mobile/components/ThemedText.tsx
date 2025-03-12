import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const typeClasses = {
    default: "text-base leading-6 text-foreground dark:text-foreground",
    defaultSemiBold:
      "text-base leading-6 font-semibold text-foreground dark:text-foreground",
    title: "text-3xl font-bold leading-8 text-foreground dark:text-foreground",
    subtitle: "text-xl font-bold text-foreground dark:text-foreground",
    link: "leading-[30px] text-base text-[#0a7ea4]",
  };

  return (
    <Text
      className={`${typeClasses[type]} ${className || ""}`}
      style={style}
      {...rest}
    />
  );
}
