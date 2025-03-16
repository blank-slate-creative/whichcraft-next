import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useThemeColor } from "../hooks/useThemeColor";

export function BackButton() {
  const router = useRouter();
  const { colors } = useThemeColor();
  const primaryColor = colors.primary;

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <ArrowLeft size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}
