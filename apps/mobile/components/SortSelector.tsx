import React, { useRef } from "react";
import { TouchableOpacity, View, Text, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ArrowUpDown } from "lucide-react-native";
import {
  MenuView,
  MenuAction,
  MenuComponentRef,
} from "@react-native-menu/menu";
import { useThemeColor } from "../hooks/useThemeColor";

export interface SortOption {
  label: string;
  value: string;
  field: "created_at" | "name" | "type" | "producer";
  order: "asc" | "desc";
}

interface SortSelectorProps {
  options: SortOption[];
  selectedOption: SortOption;
  onSelect: (option: SortOption) => void;
}

export function SortSelector({
  options,
  selectedOption,
  onSelect,
}: SortSelectorProps) {
  const { colors, isDark } = useThemeColor();
  const menuRef = useRef<MenuComponentRef>(null);

  const handleSelect = (option: SortOption) => {
    // Add haptic feedback when selecting an option
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSelect(option);
  };

  // Convert options to menu actions format
  const menuActions: MenuAction[] = options.map((option) => ({
    id: option.value,
    title: option.label,
    // Add a checkmark to the currently selected option
    state: selectedOption.value === option.value ? "on" : "off",
    // Add platform-specific icons if needed
    image: Platform.select({
      ios: selectedOption.value === option.value ? "checkmark" : undefined,
      android: undefined,
    }),
  }));

  return (
    <MenuView
      ref={menuRef}
      title="Sort By"
      actions={menuActions}
      onPressAction={({ nativeEvent }) => {
        const selected = options.find(
          (option) => option.value === nativeEvent.event
        );
        if (selected) {
          handleSelect(selected);
        }
      }}
      themeVariant={isDark ? "dark" : "light"}
      shouldOpenOnLongPress={false}
    >
      <TouchableOpacity
        className="bg-secondary py-2 px-3 rounded-full flex-row items-center gap-1"
        onPress={() => {
          // For Android, we can programmatically show the menu
          if (Platform.OS === "android") {
            menuRef.current?.show();
          }
        }}
      >
        <ArrowUpDown size={14} color={colors.mutedForeground} />
        <Text className="text-sm text-foreground font-medium">Sort</Text>
      </TouchableOpacity>
    </MenuView>
  );
}
