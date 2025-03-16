import React, { ReactNode } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { X } from "lucide-react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export type BadgeVariant = "default" | "primary" | "secondary" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  onPress?: () => void;
  onRemove?: () => void;
  className?: string;
  textClassName?: string;
  selected?: boolean;
}

export function Badge({
  children,
  variant = "secondary",
  size = "md",
  icon,
  onPress,
  onRemove,
  className = "",
  textClassName = "",
  selected = false,
}: BadgeProps) {
  const { colors } = useThemeColor();

  // Theme colors
  const primaryColor = colors.primary;
  const primaryForegroundColor = colors.primaryForeground;
  const mutedForegroundColor = colors.mutedForeground;

  // Size classes
  const sizeClasses = {
    sm: "py-0.5 px-2",
    md: "py-2 px-3",
    lg: "py-3 px-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Variant classes
  const getVariantClasses = () => {
    if (selected) {
      return "bg-primary";
    }

    switch (variant) {
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "outline":
        return "bg-transparent border border-border";
      default:
        return "bg-secondary";
    }
  };

  const getTextClasses = () => {
    if (selected) {
      return "text-primary-foreground font-medium";
    }

    switch (variant) {
      case "primary":
        return "text-primary-foreground font-medium";
      case "secondary":
        return "text-foreground";
      case "outline":
        return "text-foreground";
      default:
        return "text-foreground";
    }
  };

  const BadgeContent = () => (
    <>
      {icon}
      <Text
        className={`${textSizeClasses[size]} ${getTextClasses()} ${textClassName}`}
      >
        {children}
      </Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="ml-1"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X
            size={14}
            color={selected ? primaryForegroundColor : mutedForegroundColor}
          />
        </TouchableOpacity>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        className={`rounded-full flex-row items-center ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <BadgeContent />
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={`rounded-full flex-row items-center ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
    >
      <BadgeContent />
    </View>
  );
}
