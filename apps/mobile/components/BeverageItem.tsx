import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Beverage } from "@whichcraft/api-client";
import { useThemeColor } from "../hooks/useThemeColor";

interface BeverageItemProps {
  beverage: Beverage;
  onPress?: () => void;
  showRating?: boolean;
  compact?: boolean;
  hideBottomBorder?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  disabled?: boolean;
  selected?: boolean;
  rightComponent?: React.ReactNode;
}

export const BeverageItem = ({
  beverage,
  onPress,
  showRating = true,
  compact = false,
  hideBottomBorder = false,
  containerStyle,
  titleStyle,
  subtitleStyle,
  disabled = false,
  selected = false,
  rightComponent,
}: BeverageItemProps) => {
  const { colors, isDark } = useThemeColor();

  // Theme colors
  const primaryColor = colors.primary;
  const mutedForegroundColor = colors.mutedForeground;
  const destructiveColor = colors.destructive;
  const selectedBgColor =
    isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

  // Determine image size based on compact mode (in pixels)
  const imageSizePx = compact ? 40 : 48; // 10 tailwind = 40px, 12 tailwind = 48px

  // Determine container padding based on compact mode
  const containerPadding = compact ? "py-2 px-3" : "py-3 px-4";

  // Determine border style
  const borderStyle = hideBottomBorder ? "" : "border-b border-border";

  // Determine background color if selected
  const bgColorStyle = selected ? { backgroundColor: selectedBgColor } : {};

  return (
    <TouchableOpacity
      className={`flex-row items-center gap-3 ${containerPadding} ${borderStyle}`}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[bgColorStyle, containerStyle]}
    >
      <View
        className="rounded-md bg-secondary items-center justify-center"
        style={{ height: imageSizePx, width: imageSizePx }}
      >
        {beverage.image_url ?
          <Image
            source={{ uri: beverage.image_url }}
            className="rounded-md"
            style={{ height: imageSizePx, width: imageSizePx }}
            resizeMode="cover"
          />
        : <Text className="text-lg">
            {beverage.type === "Beer" ? "🍺" : "🍷"}
          </Text>
        }
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-medium text-foreground"
          numberOfLines={1}
          style={titleStyle}
        >
          {beverage.name}
        </Text>
        <Text
          className="text-sm text-muted-foreground"
          numberOfLines={1}
          style={subtitleStyle}
        >
          {beverage.producer}
        </Text>
        {!compact && (
          <Text className="text-xs text-muted-foreground">
            {beverage.style || beverage.type}
          </Text>
        )}
      </View>

      {rightComponent ?
        rightComponent
      : showRating ?
        <View className="h-8 w-8 rounded-full items-center justify-center">
          {beverage.liked ?
            <ThumbsUp size={18} color={primaryColor} />
          : beverage.liked === false ?
            <ThumbsDown size={18} color={destructiveColor} />
          : <MoreHorizontal size={18} color={mutedForegroundColor} />}
        </View>
      : null}
    </TouchableOpacity>
  );
};

export default BeverageItem;
