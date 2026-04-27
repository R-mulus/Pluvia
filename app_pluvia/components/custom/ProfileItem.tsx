import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
};

export default function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-5"
    >
      <View className="flex-row items-center gap-4">
        {icon}
        {/* Fonte exata de 14px como no Figma */}
        <Text className="text-[14px] text-black font-medium">{title}</Text>
      </View>
      <ChevronRight size={24} color="#000" />
    </TouchableOpacity>
  );
}