import { Text, TextProps } from "react-native";

export function StyledText(props: TextProps) {
  return <Text className="text-blue-500 font-bold" {...props} />;
}
