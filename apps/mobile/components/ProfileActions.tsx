import React from "react";
import { TouchableOpacity, View, Alert } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { LogOut, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import * as Haptics from "expo-haptics";

// Define section and action types
interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}

interface ActionSection {
  title?: string;
  items: ActionItem[];
}

export default function ProfileActions() {
  const { signOut } = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Theme colors
  const mutedForegroundColor =
    isDark ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)";

  const handleSignOut = async () => {
    try {
      // Add haptic feedback
      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  };

  // Define sections with their actions
  const accountSections: ActionSection[] = [
    {
      title: "Account",
      items: [
        {
          label: "Sign Out",
          icon: <LogOut size={18} color="#ef4444" />,
          onPress: handleSignOut,
          danger: true,
        },
      ],
    },
  ];

  return (
    <View className="space-y-6">
      {accountSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="space-y-2">
          {section.title && (
            <ThemedText className="text-sm font-medium px-1 mb-1">
              {section.title}
            </ThemedText>
          )}
          <ThemedView className="rounded-lg overflow-hidden border border-border">
            {section.items.map((action, index) => (
              <React.Fragment key={action.label}>
                {index > 0 && <View className="h-[1px] bg-border" />}
                <TouchableOpacity
                  className="py-3.5 px-4 flex-row justify-between items-center"
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    {action.icon}
                    <ThemedText
                      className={`font-medium ml-3 ${action.danger ? "text-destructive" : ""}`}
                    >
                      {action.label}
                    </ThemedText>
                  </View>
                  {action.showChevron && (
                    <ChevronRight size={18} color={mutedForegroundColor} />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ThemedView>
        </View>
      ))}
    </View>
  );
}
