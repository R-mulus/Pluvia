import React from "react";
import { View, Pressable, Linking, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { FontAwesome5 } from '@expo/vector-icons';
import {
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
} from "lucide-react-native";

export default function FaleConosco() {
  const handleContact = (type: string) => {
    // Aqui você implementaria as chamadas (Linking.openURL)
    console.log(`Contatando via ${type}`);
  };

  return (
    <Screen>
      <Header title="Fale Conosco" subtitle="Como podemos ajudar?" />

      <View className="gap-4 mt-2">
        {/* ITEM: WHATSAPP */}
        <Pressable
          className="flex-row items-center bg-white border-2 border-[#cacaca] rounded-[16px] p-4 active:bg-green-50"
          onPress={() => handleContact("whatsapp")}
        >
          <View className="bg-primaria-verde rounded-full w-[48px] h-[48px] justify-center items-center">
            <FontAwesome5 name="whatsapp" size={28} color="white" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-outfit-bold text-base">WhatsApp</Text>
            <Text className="text-xs font-outfit">(34) 9999-XXXX</Text>
          </View>
          <ChevronRight color="black" size={20} />
        </Pressable>

        {/* ITEM: TELEFONE */}
        <Pressable
          className="flex-row items-center bg-white border-2 border-[#cacaca] rounded-[16px] p-4 active:bg-blue-50"
          onPress={() => handleContact("phone")}
        >
          <View className="bg-primaria-azul p-3 rounded-full">
            <Phone color="white" size={24} />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-outfit-bold text-base">Telefone</Text>
            <Text className="text-xs font-outfit">(34) 3822-XXXX</Text>
          </View>
          <ChevronRight color="black" size={20} />
        </Pressable>

        {/* ITEM: EMAIL */}
        <Pressable
          className="flex-row items-center bg-white border-2 border-[#E1E1E1] rounded-[16px] p-4 active:bg-gray-50"
          onPress={() => handleContact("email")}
        >
          <View className="bg-secundaria-azul p-3 rounded-full">
            <Mail color="white" size={24} />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-outfit-bold text-base">E-mail</Text>
            <Text className="text-xs font-outfit">
              contato@pluvia@gmail.com
            </Text>
          </View>
          <ChevronRight color="black" size={20} />
        </Pressable>
      </View>
    </Screen>
  );
}
