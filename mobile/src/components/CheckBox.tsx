import { Feather } from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  Text,
  TouchableOpacityProps,
} from "react-native";
import colors from "tailwindcss/colors";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { HoldItem } from "react-native-hold-menu";

export interface checkProps extends TouchableOpacityProps {
  checked?: boolean;
  screen?: boolean;
  title: string;
  onRemove: () => void;
}

export function CheckBox({
  title,
  checked = false,
  screen = true,
  onRemove,
  ...props
}: checkProps) {
  const holdMenu = [
    { text: "Apagar", isTitle: true },
    {
      text: "Apagar",
      isDestructive: true,
      icon: "trash",
      onPress: () => onRemove(),
    },
  ];

  return (
    <TouchableOpacity
      className="flex-row mb-2 items-center"
      activeOpacity={0.7}
      {...props}
    >
      {checked ? (
        <Animated.View
          className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="h-8 w-8 rounded-lg bg-zinc-900" />
      )}

      {screen && (
        <HoldItem items={holdMenu}>
          <Text className="text-white text-base ml-3">{title}</Text>
        </HoldItem>
      )}

      {!screen && <Text className="text-white text-base ml-3">{title}</Text>}
    </TouchableOpacity>
  );
}
