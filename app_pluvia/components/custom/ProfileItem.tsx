import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

type MenuItemProps = {
  icon: React.ReactNode;
  iconColor?: string | "#000",
  title: string;
  titleColor?: string | "#000";
  onPress: () => void;
};

export default function MenuItem({
  icon,
  iconColor,
  title,
  titleColor,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-row items-center gap-4">
        {icon}
        {/* Fonte exata de 14px como no Figma */}
        <Text className={`text-[14px] font-medium ${titleColor}`}>{title}</Text>
      </View>
      <ChevronRight size={24} color={iconColor} />
    </TouchableOpacity>
  );
}
