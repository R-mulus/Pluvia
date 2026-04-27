import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { 
  CircleUser, 
  Bell, 
  Settings, 
  CircleHelp, 
  Headphones, 
  Phone 
} from 'lucide-react-native';

import MenuItem from '@/components/custom/ProfileItem';

type UserData = {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
};

export default function Perfil() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser({
      name: 'Renan da Towner',
      email: 'Renandatowner@gmail.com',
      role: 'Administrador',
      avatarUrl: 'https://i.pinimg.com/736x/dc/1a/e9/dc1ae92479a355bd04a46e437a6b360d.jpg' 
    });
  }, []);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* === CABEÇALHO DO USUÁRIO === */}
        <View className="flex-row items-center px-5 py-6">
          <Image 
            source={{ uri: user.avatarUrl }} 
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
          
          {/* justify-center alinha todo o bloco de texto (nome+tag+email) no meio da foto */}
          <View className="ml-4 flex-1 justify-center">
            
            {/* Nome e Tag agrupados na mesma linha (Row) */}
            <View className="flex-row items-center gap-3">
              {/* Nome em 16px */}
              <Text className="text-[16px] font-bold text-black">{user.name}</Text>
              
              {/* Tag com cantos arredondados (rounded-lg fica parecido com o Figma) e padding */}
              <View className="px-3 py-1 rounded-lg bg-[#00A0A6]">
                {/* Texto da Tag em 14px */}
                <Text className="text-white text-[14px] font-medium">
                  {user.role}
                </Text>
              </View>
            </View>
            
            {/* E-mail isolado na linha de baixo, em 12px */}
            <Text className="text-[12px] text-black mt-1">
              {user.email}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-[#E5E7EB] w-full" />

        {/* === PRIMEIRO BLOCO DE MENU === */}
        <View className="py-2">
          <MenuItem 
            icon={<CircleUser size={24} color="#000" />} 
            title="Editar Perfil" 
            onPress={() => console.log('Ir para Editar Perfil')} 
          />
          <MenuItem 
            icon={<Bell size={24} color="#000" />} 
            title="Notificações" 
            onPress={() => console.log('Ir para Notificações')} 
          />
          <MenuItem 
            icon={<Settings size={24} color="#000" />} 
            title="Configurações" 
            onPress={() => console.log('Ir para Configurações')} 
          />
        </View>

        <View className="h-[1px] bg-[#E5E7EB] w-full" />

        {/* === SEGUNDO BLOCO DE MENU === */}
        <View className="py-2">
          <MenuItem 
            icon={<CircleHelp size={24} color="#000" />} 
            title="Sobre Nós" 
            onPress={() => console.log('Ir para Sobre Nós')} 
          />
          <MenuItem 
            icon={<Headphones size={24} color="#000" />} 
            title="Central de Ajuda" 
            onPress={() => console.log('Ir para Central de Ajuda')} 
          />
          <MenuItem 
            icon={<Phone size={24} color="#000" />} 
            title="Fale Conosco" 
            onPress={() => console.log('Ir para Fale Conosco')} 
          />
        </View>

      </ScrollView>
    </View>
  );
}