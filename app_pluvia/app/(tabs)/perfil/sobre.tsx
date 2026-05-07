import React from 'react';
import { View, ScrollView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from '@/components/custom/Header';
import { Info, MapPin, Droplets, Zap } from 'lucide-react-native';

export default function SobreNos() {
  return (
    <Screen>
      <Header title='Sobre o Projeto' subtitle='Pluvia v1.0.0' />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 24 }}>
        
        {/* SEÇÃO: O APP PLUVIA */}
        <View className="bg-white border-2 border-[#E1E1E1] rounded-[20px] p-5 gap-4 shadow-sm">
          <View className="flex-row items-center justify-center gap-3">
            {/* <View className="bg-primaria-azul p-2 rounded-lg">
              <Droplets color="white" size={20} />
            </View> */}
            <Text className="font-outfit-bold text-xl text-primaria-azul">O App Pluvia</Text>
          </View>
          <Text className="leading-6">
            O Pluvia nasceu da necessidade de modernizar a gestão hídrica no campo. Nossa plataforma 
            conecta inteligência de dados à operação bruta, permitindo o controle total de pivôs de 
            irrigação na palma da mão, economizando recursos e otimizando a produção agrícola.
          </Text>
        </View>

        {/* SEÇÃO: A EMPRESA */}
        <View className="bg-white border-2 border-[#E1E1E1] rounded-[20px] p-5 gap-4 shadow-sm">
          <View className="flex-row items-center justify-center gap-3">
            {/* <View className="bg-primaria-verde p-2 rounded-lg">
              <Zap color="white" size={20} />
            </View> */}
            <Text className="font-outfit-bold text-xl text-primaria-azul">Dimensional</Text>
          </View>
          
          <Text className="leading-6">
            A <Text className="font-outfit-bold text-primaria-azul">Dimensional Eletrotécnica e Irrigação LTDA</Text> é 
            referência no setor de engenharia elétrica e soluções para irrigação em Minas Gerais.
          </Text>

          <Text className="font-outfit-regular leading-6">
            Com sede em <Text className="font-outfit-bold text-primaria-azul">Patos de Minas</Text>, combinamos tradição 
            e tecnologia para entregar projetos que garantem a eficiência energética e operacional 
            dos produtores rurais da região.
          </Text>

          <View className="flex-row items-center gap-2 mt-2 bg-gray-100 p-3 rounded-xl border border-gray-100">
            <MapPin size={18} color="#666" />
            <Text className="text-xs text-gray-500 font-outfit-medium">
              Patos de Minas - MG | Desde 1994
            </Text>
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}