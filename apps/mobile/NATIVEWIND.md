# NativeWind Setup

This project uses [NativeWind](https://www.nativewind.dev/) for styling React
Native components with Tailwind CSS.

## Usage

### Basic Usage

You can use the `className` prop on any React Native component to apply Tailwind
CSS styles:

```tsx
import { View, Text } from "react-native";

function MyComponent() {
  return (
    <View className="p-4 bg-white dark:bg-gray-900 rounded-lg">
      <Text className="text-xl font-bold text-gray-800 dark:text-white">
        Hello, NativeWind!
      </Text>
    </View>
  );
}
```

### Conditional Styling

You can conditionally apply styles:

```tsx
import { View, Text } from "react-native";

function MyComponent({ isActive }) {
  return (
    <View className={`p-4 ${isActive ? "bg-blue-500" : "bg-gray-200"}`}>
      <Text className="text-white">{isActive ? "Active" : "Inactive"}</Text>
    </View>
  );
}
```

### Dark Mode

NativeWind supports dark mode with the `dark:` prefix:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-black dark:text-white">
    This text adapts to dark mode
  </Text>
</View>
```

### Creating Custom Components

You can create custom styled components:

```tsx
import { Text, TextProps } from "react-native";

export function StyledText(props: TextProps) {
  return <Text className="text-blue-500 font-bold" {...props} />;
}
```

## Configuration

The NativeWind configuration is in the following files:

- `tailwind.config.js` - Tailwind CSS configuration
- `babel.config.js` - Babel configuration with NativeWind plugin
- `global.css` - Tailwind CSS imports
- `types/nativewind.d.ts` - TypeScript types for NativeWind

## Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
