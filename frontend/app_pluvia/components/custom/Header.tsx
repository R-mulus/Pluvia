import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    // Container Principal
    <View>
      <Text className="font-outfit-bold text-xl" numberOfLines={1} >{title}</Text>
      <Text className="text-xs">{subtitle}</Text>
    </View>
  );
}
